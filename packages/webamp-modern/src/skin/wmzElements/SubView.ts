import { num } from "../../utils";
import Group from "../makiClasses/Group";

// https://docs.microsoft.com/en-us/windows/win32/wmp/subview-element
export default class SubView extends Group {
  // _clippingColor: string;
  _backgroundColor: string;

  getElTag(): string {
    return "subview";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "backgroundcolor":
        this._backgroundColor = value;
        this._renderBackground();
        break;
      case "zindex":
        const zindex = value;
        this._div.style.zIndex = zindex == "-1" ? "6556" : zindex;
        break;
      default:
        return false;
    }
    return true;
  }

  _renderBackground() {
    super._renderBackground();
    if (this._backgroundColor)
      this._div.style.setProperty('--background-color',this._backgroundColor);
  }
}
