import GuiObj from "./GuiObj";
import UI_ROOT from "../../UIRoot";
import { num } from "../../utils";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Clayer.2F.3E
export default class Layer extends GuiObj {
  static GUID = "5ab9fa1545579a7d5765c8aba97cc6a6";
  _image: string;
  _isMouseTrap: boolean = false;
  
  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if(key === 'id' && value.toLowerCase().startsWith('mousetrap')){
      this._isMouseTrap = true;
    }
    if (super.setXmlAttr(_key, value)) {
      return true;
    }
    switch (key) {
      case "image":
        this._image = value;
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
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if(bitmap) return bitmap.getHeight();
    }
    return 0;
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if(bitmap) return bitmap.getWidth();
    }
    return 0;
    return super.getwidth();
  }

  _renderBackground() {
    const bitmap = this._image != null ? UI_ROOT.getBitmap(this._image) : null;
    this.setBackgroundImage(bitmap);
  }

  draw() {
    super.draw();
    // this._div.setAttribute("data-obj-name", "Layer");
    // this._div.style.pointerEvents = this._sysregion==-2 || this._ghost? 'none' : 'auto';
    this._div.style.pointerEvents = this._isMouseTrap? 'auto': 'none';
    // this._div.style.pointerEvents = 'auto';
    this._div.style.display = this._sysregion==-2? 'none' : 'block';
    this._div.style.display = 'block';
    // this._div.style.display = this._sysregion < 0 ? 'none' : 'block';
    this._div.style.overflow = "hidden";
    this._div.classList.add("webamp--img");
    this._renderBackground();
  }
  setregionfrommap(regionMap:any, threshold:number, reverse:boolean) {
    //TODO:
  }

  isinvalid():boolean {
    return false;
  }
}
