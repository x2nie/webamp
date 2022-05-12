import UI_ROOT from "../../UIRoot";
import { Edges } from "../Clippath";
import GuiObj from "../makiClasses/GuiObj";
import ButtonGroup from "./ButtonGroup";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttonelement-element
export default class ButtonElement extends GuiObj {
  _mappingColor: string;
  _action: string = null;

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
      case "action":
        this.setAction(value);
        break;
      default:
        return false;
    }
    return true;
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
    this._renderRegion();
  }
}
