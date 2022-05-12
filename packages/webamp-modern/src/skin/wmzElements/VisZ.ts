import UI_ROOT from "../../UIRoot";
import { Edges } from "../Clippath";
import Vis from "../makiClasses/Vis";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class VisZ extends Vis {
  _clippingColor: string;
  _clippingImage: string;

  getElTag(): string {
    return "vis";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "clippingcolor":
        this._clippingColor = value;
        break;
      case "clippingimage":
        this._clippingImage = value;
        break;
      default:
        return false;
    }
    return true;
  }

  _renderRegion() {
    if (this._clippingImage && this._clippingColor) {
      const canvas = UI_ROOT.getBitmap(this._clippingImage).getCanvas();
      const edge = new Edges();
      edge.parseCanvasTransparencyByColor(canvas, this._clippingColor);
      if (edge.isSimpleRect()) {
        // this.setXmlAttr("sysregion", "0");
      } else {
        this._div.style.clipPath = edge.getPolygon();
      }
    }
  }

  draw() {
    super.draw();
    this._renderRegion();
  }
}
