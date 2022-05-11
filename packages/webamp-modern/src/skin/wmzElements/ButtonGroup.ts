import UI_ROOT from "../../UIRoot";
import Group from "../makiClasses/Group";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttongroup-element
export default class ButtonGroup extends Group {
  _mappingImage: string;
  _hoverImage: string;
  _downImage: string;

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "mappingimage":
        this._mappingImage = value;
        break;
      case "hoverimage":
        this._hoverImage = value;
        this._renderBackground();
        break;
      case "downimage":
        this._downImage = value;
        this._renderBackground();
        break;
      default:
        return false;
    }
    return true;
  }

  _renderBackground() {
    if (this._hoverImage != null) {
      const hoverimage = UI_ROOT.getBitmap(this._hoverImage);
      this.setHoverBackgroundImage(hoverimage);
    } else {
      this.setHoverBackgroundImage(null);
    }
    
    if (this._downImage != null) {
      const downBitmap = UI_ROOT.getBitmap(this._downImage);
      this.setDownBackgroundImage(downBitmap);
    } else {
      this.setDownBackgroundImage(null);
    }

  }

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    const h = super.getheight();
    if (!h && this._mappingImage != null) {
      const bitmap = UI_ROOT.getBitmap(this._mappingImage);
      if (bitmap) return bitmap.getHeight();
    }
    return h ?? 0;
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    const w = super.getwidth();
    if (!w && this._mappingImage != null) {
      const bitmap = UI_ROOT.getBitmap(this._mappingImage);
      if (bitmap) return bitmap.getWidth();
    }
    return w || 0;
  }

  draw() {
    super.draw();
    if(!this._background){
      this._div.classList.remove("webamp--img");

    }
  }
}
