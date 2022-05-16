import UI_ROOT from "../../UIRoot";
import AudioEventedGui from "../AudioEventedGui";
import Button from "../makiClasses/Button";

export default class ButtonFace extends AudioEventedGui {
  _image: string;
  _hoverImage: string;
  _downImage: string;
  _disabledImage: string;

  getElTag(): string {
    return "button";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(_key, value)) {
      return true;
    }

    switch (key) {
      case "image":
        this._image = value;
        break;
      case "hoverimage":
        this._hoverImage = value;
        break;
      case "downimage":
        this._downImage = value;
        break;
      case "disabledimage":
        this._disabledImage = value;
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
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if (bitmap) return bitmap.getHeight();
    }
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if (bitmap) return bitmap.getWidth();
    }
    return super.getwidth();
  }

  _renderBackground() {
    // _renderBackground() {
    const setCssVar = (bitmapId: string, bitmapMethod: string) => {
      if (bitmapId != null) {
        const bitmap = UI_ROOT.getBitmap(bitmapId);
        if (bitmap != null) {
          bitmap[bitmapMethod](this._div);
        }
      }
    };

    setCssVar(this._image, "setAsBackground");
    setCssVar(this._hoverImage, "setAsHoverBackground");
    setCssVar(this._downImage, "setAsDownBackground");
    setCssVar(this._disabledImage, "setAsDisabledBackground");
  }

  draw() {
    super.draw();
    this._div.classList.add("webamp--img");
    this._renderBackground();
  }

}
