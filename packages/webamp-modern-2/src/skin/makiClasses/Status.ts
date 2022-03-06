import GuiObj from "./GuiObj";
import UI_ROOT from "../../UIRoot";

// Maybe this?
// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3CWasabi:StandardFrame:Status.2F.3E
export default class Status extends GuiObj {
  static GUID = "0f08c9404b23af39c4b8f38059bb7e8f";
  _stopbitmap: string;
  _playbitmap: string;
  _pausebitmap: string;
  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    switch (key) {
      case "stopbitmap":
        this._stopbitmap = value;
        this._renderBackground();
        break;
      case "playbitmap":
        this._playbitmap = value;
        this._renderBackground();
        break;
      case "pausebitmap":
        this._pausebitmap = value;
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
    if (this._stopbitmap != null) {
      const bitmap = UI_ROOT.getBitmap(this._stopbitmap);
      return bitmap ? bitmap.getHeight() : 15;
    }
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._stopbitmap != null) {
      const bitmap = UI_ROOT.getBitmap(this._stopbitmap);
      return bitmap ? bitmap.getWidth() : 15;
    }
    return super.getwidth();
  }

  _renderBackground() {
    if (this._stopbitmap != null) {
      const bitmap = UI_ROOT.getBitmap(this._stopbitmap);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  draw() {
    super.draw();
    // this._div.setAttribute("data-obj-name", "Button");
    this._div.classList.add("webamp--img");
    this._renderBackground();
  }
}
