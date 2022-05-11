import UI_ROOT from "../../UIRoot";
import { Edges } from "../Clippath";
import GuiObj from "../makiClasses/GuiObj";
import ButtonGroup from "./ButtonGroup";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttonelement-element
export default class ButtonElement extends GuiObj {
  _mappingColor: string;

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "mappingcolor":
        this._mappingColor = value;
        //temporary:
        // this._div.style.backgroundColor = value;
        break;
      default:
        return false;
    }
    return true;
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

  draw() {
    super.draw();
    // this._div.classList.add("webamp--img");
    this._renderRegion();
  }
}
