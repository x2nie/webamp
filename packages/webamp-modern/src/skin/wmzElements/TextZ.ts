import Text from "../makiClasses/Text";
import { solvePendingProps } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class TextZ extends Text {
  _pendingProps: { [key: string]: string } = {};
  _background: string;
  _foregroundColor: string;

  getElTag(): string {
    return "text";
  }

  constructor() {
    super();
    this.setXmlAttr("font", "arial");
  }

  setXmlAttr(_key: string, _value: string): boolean {
    let key = _key.toLowerCase();
    const value = _value.toLowerCase();
    if (value.startsWith("jscript:")) {
      this._pendingProps[key] = value;
      return true;
    }
    if (key == "value") {
      key = "text";
    }
    if (super.setXmlAttr(key, value)) {
      //   //? wmz has no action/param
      //   if (key == "id") {
      //     if (value.startsWith("eq")) {
      //       const index = value.substring(2);
      //       this.setxmlparam("action", "eq_band");
      //       this.setxmlparam("param", index);
      //     } else if(value =='balance'){
      //       this.setxmlparam("action", "pan");

      //     } else if(value =='volume'){
      //       this.setxmlparam("action", "volume");

      //     }
      //   }
      return true;
    }

    switch (key) {
      case "foregroundcolor":
        this._foregroundColor = value;
        this._div.style.color = value;
        break;
      default:
        return false;
    }
    return true;
  }

  draw() {
    solvePendingProps(this, this._pendingProps);
    super.draw();
    if (!this._width) {
      this._div.style.setProperty("--full-width", "auto");
    }
    if (this.getwidth() == 0) {
      this._div.style.removeProperty("width");
    }
    if (this.getheight() == 0) {
      this._div.style.removeProperty("height");
    }
  }
}
