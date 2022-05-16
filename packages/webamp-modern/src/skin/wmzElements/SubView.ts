import UI_ROOT from "../../UIRoot";
import { num } from "../../utils";
import { AUDIO_PAUSED, AUDIO_PLAYING, AUDIO_STOPPED } from "../AudioPlayer";
import { Edges } from "../Clippath";
import Group from "../makiClasses/Group";
import { runInlineScript } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/subview-element
export default class SubView extends Group {
  _clippingColor: string;
  _transparencyColor: string;
  _backgroundColor: string;
  _onEndMove: string; // TODO: Put all onXXX into single object named AmbientEvents
  _audioEvent: { [audioEvent: string]: string } = {};

  getElTag(): string {
    return "subview";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (value.startsWith("wmpenabled:player.controls.")) {
      this._audioEvent[value.split(".").pop()] = key;
      return;
    }

    if (super.setXmlAttr(_key, value)) {
      return true;
    }

    switch (key) {
      case "backgroundcolor":
        this._backgroundColor = value;
        this._renderBackground();
        break;
      case "clippingcolor":
        this._clippingColor = value;
        break;
      case "transparencycolor":
        this._transparencyColor = value;
        break;
      case "onendmove":
        this._onEndMove = value;
        break;
      case "zindex":
        const zindex = value;
        this._div.style.zIndex = /* zindex == "-1" ? "6556" : */ zindex;
        break;
      default:
        return false;
    }
    return true;
  }

  moveTo(x: number, y: number, speed: number) {
    this.settargetx(x);
    this.settargety(y);
    this.settargetspeed(speed / 1000);
    this.gototarget();
    if (this._onEndMove != null) {
      setTimeout(() => {
        runInlineScript(this._onEndMove);
      }, speed / 1000 + 500);
    }
  }
  moveto(x: number, y: number, speed: number) {
    //TODO: duplicate remove it
    this.moveTo(x, y, speed);
  }

  alphaBlendTo(alpha: number, speed: number) {
    this.settargeta(alpha);
    this.settargetspeed(speed / 1000);
    this.gototarget();
  }

  get alphaBlend(): number {
    return this._alpha;
  }
  set alphaBlend(value: number) {
    this._alpha = value;
    this._renderAlpha();
  }

  set passThrough(value: string) {
    this._ghost = value == "True";
    this._div.style.pointerEvents = this._ghost ? "none" : "auto";
  }

  init() {
    super.init();
    UI_ROOT.audio.on("statchanged", () => this._updateStatus());
    this._updateStatus();
  }

  _updateStatus() {
    const state = UI_ROOT.audio.getState(); // playing
    for (const [audioEvent, prop] of Object.entries(this._audioEvent)) {
      this[prop] =
        (audioEvent == "play" && state != AUDIO_PLAYING) ||
        (audioEvent == "pause" && state != AUDIO_PAUSED) ||
        (audioEvent == "stop" && state != AUDIO_STOPPED);
    }
  }

  _renderRegion() {
    //* maybe, in win32/gdi the transparency has different.
    //* we thread both as same here, confirmed by visual see by eye is okay.
    if ((this._clippingColor || this._transparencyColor) && this._background) {
      const canvas = UI_ROOT.getBitmap(this._background).getCanvas(false);
      const edge = new Edges();
      edge.parseCanvasTransparencyByColor(
        canvas,
        this._clippingColor || this._transparencyColor
      );
      if (edge.isSimpleRect()) {
        // this.setXmlAttr("sysregion", "0");
      } else {
        this._div.style.clipPath = edge.getPolygon();
      }
    }
  }

  _renderBackground() {
    super._renderBackground();
    //alway has this css var
    this._div.style.setProperty(
      "--background-color",
      this._backgroundColor || "transparent"
    );
  }

  draw() {
    super.draw();
    // _renderBackground was done in super.
    this._renderRegion();
  }
}