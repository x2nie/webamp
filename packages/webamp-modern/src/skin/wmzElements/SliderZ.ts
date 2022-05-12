import UI_ROOT from "../../UIRoot";
import Slider from "../makiClasses/Slider";
import { solvePendingProps } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class SliderZ extends Slider {
  _pendingProps: { [key: string]: string } = {};
  _background: string;

  getElTag(): string {
    return "slider";
  }

  setXmlAttr(_key: string, _value: string): boolean {
    const key = _key.toLowerCase();
    const value = _value.toLowerCase();
    if (value.startsWith("jscript:")) {
      this._pendingProps[key] = value;
      return true;
    }
    if (super.setXmlAttr(key, value)) {
      //? wmz has no action/param
      if (key == "id") {
        if (value.startsWith("eq")) {
          const index = value.substring(2);
          this.setxmlparam("action", "eq_band");
          this.setxmlparam("param", index);
        } else if (value == "balance") {
          this.setxmlparam("action", "pan");
        } else if (value == "volume") {
          this.setxmlparam("action", "volume");
        }
      }
      return true;
    }

    switch (key) {
      case "background":
        this._background = value;
        this._renderBackground();
        break;
      default:
        return false;
    }
    return true;
  }

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    if (this._height) {
      return this._height;
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if (bitmap) return bitmap.getHeight();
    }
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if (bitmap) return bitmap.getWidth();
    }
    return super.getwidth();
  }

  _renderBackground() {
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  draw() {
    solvePendingProps(this, this._pendingProps);
    super.draw();
    this._div.classList.add("webamp--img");
    // this._div.style.pointerEvents = "auto";
    this._renderBackground();
  }
}
