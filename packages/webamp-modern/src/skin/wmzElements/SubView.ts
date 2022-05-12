import UI_ROOT from "../../UIRoot";
import { num } from "../../utils";
import { Edges } from "../Clippath";
import Group from "../makiClasses/Group";

// https://docs.microsoft.com/en-us/windows/win32/wmp/subview-element
export default class SubView extends Group {
  _clippingColor: string;
  _backgroundColor: string;

  getElTag(): string {
    return "subview";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
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
      case "zindex":
        const zindex = value;
        this._div.style.zIndex = /* zindex == "-1" ? "6556" : */ zindex;
        break;
      default:
        return false;
    }
    return true;
  }

  moveto(x: number, y: number, speed: number) {
    this.settargetx(x);
    this.settargety(y);
    this.settargetspeed(speed/1000);
    this.gototarget();
  }

  _renderRegion() {
    if (this._clippingColor && this._background) {
      const canvas = UI_ROOT.getBitmap(this._background).getCanvas();
      const edge = new Edges();
      edge.parseCanvasTransparencyByColor(canvas, this._clippingColor);
      if (edge.isSimpleRect()) {
        // this.setXmlAttr("sysregion", "0");
      } else {
        this._div.style.clipPath = edge.getPolygon();
      }
    }
  }
  
  _renderBackground() {
    super._renderBackground();
    if (this._backgroundColor)
      this._div.style.setProperty("--background-color", this._backgroundColor);
  }

  draw() {
    super.draw();
    // _renderBackground was done in super.
    this._renderRegion();
  }
}
