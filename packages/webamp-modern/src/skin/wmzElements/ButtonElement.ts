import UI_ROOT from "../../UIRoot";
import { toBool } from "../../utils";
import { AUDIO_PAUSED, AUDIO_PLAYING, AUDIO_STOPPED } from "../AudioPlayer";
import { Edges } from "../Clippath";
import GuiObj from "../makiClasses/GuiObj";
import ButtonGroup from "./ButtonGroup";
import { runInlineScript } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttonelement-element
export default class ButtonElement extends GuiObj {
  _mappingColor: string;
  _action: string = null;
  _onClick: string = null;
  _down: boolean = false;
  _enabled: boolean = true;
  _sticky: boolean = false;
  _audioEvent: { [audioEvent: string]: string } = {};

  constructor() {
    super();
    // TODO: Cleanup!
    // this._div.addEventListener("mousedown", this._handleMouseDown.bind(this));
    this._div.addEventListener("click", (e: MouseEvent) => {
      if (this._onClick != null) {
        this.onClick();
      }
    });
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (value.startsWith("wmpenabled:player.controls.")) {
      this._audioEvent[value.split(".").pop()] = key;
      return;
    }
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      // case "image":
      //   //quick and dirty patch
      //   //TODO: implement all hover,down,disable. sample: quicksilver.wmz: playbutton
      //   this.setXmlAttr('background', value);
      //   return true
      case "mappingcolor":
        this._mappingColor = value;
        //temporary:
        // this._div.style.backgroundColor = value;
        break;
      case "action":
        this.setAction(value);
        break;
      case "onclick":
        this._onClick = value;
        break;
      case "sticky":
        // Specifies or retrieves a value indicating whether the BUTTONELEMENT
        // is sticky.
        // When sticky, a BUTTONELEMENT will change states after being clicked
        // and will remain in the new state until clicked again.
        this._sticky = toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  get down(): boolean {
    return this._down;
  }
  set down(value: boolean) {
    this._down = value;
    this._renderDown();
  }

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(value: boolean) {
    this._enabled = value;
    this._renderDisabled();
  }

  setAction(action: string) {
    this._action = action;
    if (action) {
      this._div.addEventListener("click", (e: MouseEvent) => {
        if (e.button == 0) {
          //   this.leftclick();
          this.dispatchAction(this._action, null, null);
        }
      });
    }
  }

  onClick() {
    if (!this.enabled) {
      return;
    }
    // if (this._action) {
    //   this.dispatchAction(this._action, this._param, this._actionTarget);
    //   this.invalidateActionState();
    // }
    // this.onLeftClick();
    runInlineScript(this._onClick);
    if (this._sticky) {
      this.down = true;
    }
  }

  _renderDown() {
    if (this._down) {
      this._div.classList.add("down");
    } else {
      this._div.classList.remove("down");
    }
  }

  _renderDisabled() {
    if (this._enabled) {
      this._div.classList.remove("disabled");
    } else {
      this._div.classList.add("disabled");
    }
  }

  

  _renderRegion() {
    if (this._mappingColor && this._parent instanceof ButtonGroup) {
      const canvas = UI_ROOT.getBitmap(this._parent._mappingImage).getCanvas();
      const edge = new Edges();
      edge.parseCanvasTransparencyByNonColor(canvas, this._mappingColor);
      if (edge.isSimpleRect()) {
        // this.setXmlAttr("sysregion", "0");
      } else {
        this._div.style.clipPath = edge.getPolygon();
      }
    }
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

  draw() {
    super.draw();
    this._renderRegion();
  }
}
