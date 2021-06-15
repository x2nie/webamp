import { SkinContext } from "../types";
import * as Utils from "../utils";
import XmlObj from "./XmlObj";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#GuiObject_.28Global_params.29
export default class GuiObj extends XmlObj {
  _id: string;
  _width: number;
  _height: number;
  _x: number = 0;
  _y: number = 0;
  _droptarget: string;
  _visible: boolean = true;
  _dirty: boolean = false;

  setXmlAttr(key: string, value: string): boolean {
    switch (key) {
      case "id":
        this._id = value.toLowerCase();
        break;
      case "w":
        this._width = Utils.num(value);
        break;
      case "h":
        this._height = Utils.num(value);
        break;
      case "x":
        this._x = Utils.num(value) ?? 0;
        break;
      case "y":
        this._y = Utils.num(value) ?? 0;
        break;
      case "droptarget":
        this._droptarget = value;
        break;
      case "visible":
        this._visible = Utils.toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  init(context: SkinContext) {
    // pass
  }

  getId(): string {
    return this._id;
  }

  /**
   * Trigger the show event.
   */
  show() {
    this._visible = true;
    this._dirty = true;
  }

  /**
   * Trigger the hide event.
   */
  hide() {
    this._visible = false;
    this._dirty = true;
  }

  /**
   * Get the Y position, in the screen, of the
   * top edge of the object.
   *
   * @ret The top edge's position (in screen coordinates).
   */
  gettop(): number {
    return this._x;
  }

  /**
   * Get the height of the object, in pixels.
   *
   * @ret The height of the object.
   */
  getheight() {
    // FIXME
    return this._height || 100;
  }

  /**
   * Get the width of the object, in pixels.
   *
   * @ret The width of the object.
   */
  getwidth() {
    // FIXME
    return this._width || 100;
  }

  /**
   * Resize the object to the desired size and position.
   *
   * @param  x   The X position where to anchor the object before resize.
   * @param  y   The Y position where to anchor the object before resize.
   * @param  w   The width you wish the object to have.
   * @param  h   The height you wish the object to have.
   */
  resize(x: number, y: number, w: number, h: number) {
    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
    this._dirty = true;
  }

  getDebugDom(): HTMLDivElement {
    const div = window.document.createElement("div");
    div.style.display = this._visible ? "inline-block" : "none";
    div.style.position = "absolute";
    if (this._x) {
      div.style.left = Utils.px(this._x);
    }
    if (this._y) {
      div.style.top = Utils.px(this._y);
    }
    if (this._width) {
      div.style.width = Utils.px(this._width);
    }
    if (this._height) {
      div.style.height = Utils.px(this._height);
    }
    return div;
  }
}
