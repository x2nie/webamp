import GuiObj from "./GuiObj";
import UI_ROOT from "../../UIRoot";
import Movable from "./Movable";
import { Edges } from "../Clippath";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Clayer.2F.3E
export default class Layer extends Movable {
  static GUID = "5ab9fa1545579a7d5765c8aba97cc6a6";
  _image: string;
  _inactiveImage: string;

  setXmlAttr(key: string, value: string): boolean {
    if (super.setXmlAttr(key, value)) {
      if (key == "sysregion") {
        this._renderRegion();
      }
      return true;
    }
    switch (key) {
      case "image":
        this._image = value;
        this._renderBackground();
        this._renderRegion();
        break;
      case "inactiveimage":
        this._inactiveImage = value;
        this._renderBackground();
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
    const bitmap = this._image != null ? UI_ROOT.getBitmap(this._image) : null;
    this.setBackgroundImage(bitmap);
    this.setInactiveBackgroundImage(bitmap);
    if (this._inactiveImage) {
      this.setInactiveBackgroundImage(UI_ROOT.getBitmap(this._inactiveImage));
      this._div.classList.add("inactivable");
    }
  }

  _renderRegion() {
    if (this._sysregion == 1 && this._image) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if (bitmap && bitmap.getImg()) {
        const canvas = bitmap.getCanvas();
        const edge = new Edges();
        edge.parseCanvasTransparency(canvas, this.getwidth(), this.getheight());
        if (!edge.isSimpleRect()) {
          this._div.style.clipPath = edge.getPolygon();
          return
        }
      }
      // if anything failed, don't repeat:
      this.setXmlAttr("sysregion", "0");
    }
  }

  draw() {
    super.draw();
    this._div.classList.add("webamp--img");
    this._renderBackground();
  }
}
