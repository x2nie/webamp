import UI_ROOT from "../../UIRoot";
import { num, toBool } from "../../utils";
import Slider from "../makiClasses/Slider";
import { solvePendingProps } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class SliderZ extends Slider {
  _pendingProps: { [key: string]: string } = {};
  _background: string;
  _tiled: boolean;
  _borderSize: number;

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
        break;
      case "tiled":
        this._tiled = toBool(value);
        break;
      case "bordersize":
        this._borderSize = num(value);
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
    if(this._tiled){
      this._div.classList.add('background-stretched')
      if(this._borderSize){
        let h:number,w:number;
        if(this._vertical){
          // vertical
          h = this._borderSize;
          w = Math.min( Math.floor(h/2), Math.floor(this.getwidth()/2) )
        } else {
          // horizontal
          w = this._borderSize;
          h = Math.min( Math.floor(w/2), Math.floor(this.getheight()/2) )
        }
        this._div.style.setProperty('--border-width', `${w}`)
        this._div.style.setProperty('--border-height', `${h}`)
        this._div.style.setProperty('--border-width-px', `${w}px`)
        this._div.style.setProperty('--border-height-px', `${h}px`)
      }
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
