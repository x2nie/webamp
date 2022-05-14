import { assert, getId, hexToRgb, normalizeDomId, num, px } from "../utils";
import ImageManager from "./ImageManager";

export function genCssVar(bitmapId: string): string {
  return `--bitmap-${bitmapId.replace(/[^a-zA-Z0-9]/g, "-")}`;
}

// http://wiki.winamp.com/wiki/XML_Elements#.3Cbitmap.2F.3E
export default class Bitmap {
  _id: string;
  _cssVar: string;
  _url: string;
  _img: HTMLImageElement;
  _canvas: HTMLCanvasElement;
  _x: number = 0;
  _y: number = 0;
  _width: number;
  _height: number;
  _file: string;
  _transparentColor: string;
  _gammagroup: string;

  setXmlAttributes(attributes: { [attrName: string]: string }) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setXmlAttr(key, value);
    }
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    switch (key) {
      case "id":
        this._id = value;
        this._cssVar = `--bitmap-${this.getId().replace(/[^a-zA-Z0-9]/g, "-")}`;
        break;
      case "x":
        this._x = num(value) ?? 0;
        break;
      case "y":
        this._y = num(value) ?? 0;
        break;
      case "w":
        this._width = num(value);
        break;
      case "h":
        this._height = num(value);
        break;
      case "file":
        this._file = value;
        break;
      case "gammagroup":
        this._gammagroup = value;
        break;
      case "transparentcolor":
        this._transparentColor = value;
        break;
      default:
        return false;
    }
    return true;
  }

  getId() {
    return this._id || "";
  }

  getFile() {
    return this._file || "";
  }

  getWidth() {
    return this._width;
  }

  getHeight() {
    return this._height;
  }

  getLeft() {
    return this._x;
  }

  getTop() {
    return this._y;
  }

  getCSSVar(): string {
    return this._cssVar;
  }

  getGammaGroup(): string {
    return this._gammagroup;
  }

  getImg(): HTMLImageElement {
    return this._img;
  }

  // Ensure we've loaded the image into our image loader.
  async ensureImageLoaded(imageManager: ImageManager) {
    assert(
      this._url == null,
      "Tried to ensure a Bitmap was laoded more than once."
    );

    //force. also possibly set null:
    this._img = await imageManager.getImage(this._file);
    if (this._img) {
      if (this._width == null && this._height == null) {
        this.setXmlAttr("w", String(this._img.width));
        this.setXmlAttr("h", String(this._img.height));
      }
    }
  }

  _getBackgrondImageCSSAttribute(): string {
    return `var(${this.getCSSVar()})`;
  }

  _getBackgrondPositionCSSAttribute(): string {
    const x = px(-(this._x ?? 0));
    const y = px(-(this._y ?? 0));
    return `${x} ${y}`;
  }

  _getBackgrondSizeCSSAttribute(): string {
    const width = px(this._width);
    const height = px(this._height);
    return `${width} ${height}`;
  }

  _setAsBackground(div: HTMLElement, prefix: string) {
    div.style.setProperty(
      `--${prefix}background-image`,
      this._getBackgrondImageCSSAttribute()
    );
  }

  setAsBackground(div: HTMLElement) {
    this._setAsBackground(div, "");
  }

  setAsDownBackground(div: HTMLElement) {
    this._setAsBackground(div, "down-");
  }

  setAsActiveBackground(div: HTMLElement) {
    this._setAsBackground(div, "active-");
  }
  setAsInactiveBackground(div: HTMLElement) {
    this._setAsBackground(div, "inactive-");
  }

  setAsHoverBackground(div: HTMLElement) {
    this._setAsBackground(div, "hover-");
  }

  setAsHoverDownBackground(div: HTMLElement) {
    this._setAsBackground(div, "hover-down-");
  }

  setAsDisabledBackground(div: HTMLElement) {
    this._setAsBackground(div, "disabled-");
  }

  /**
   *
   * @param store whether the generated canvas should be
   *              kept by this bitmap instance
   * @returns <canvas/>
   */
  getCanvas(store: boolean = false): HTMLCanvasElement {
    let workingCanvas: HTMLCanvasElement;
    if (this._canvas == null || !store) {
      assert(this._img != null, "Expected bitmap image to be loaded");
      workingCanvas = document.createElement("canvas");
      workingCanvas.width = this.getWidth() || this._img.width;
      workingCanvas.height = this.getHeight() || this._img.height;
      const ctx = workingCanvas.getContext("2d");
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      ctx.drawImage(this._img, -this._x, -this._y);

      //set transparentColor if any
      if (this._transparentColor != null) {
        const rgb = hexToRgb(this._transparentColor);
        // // get the image data object
        // var data = ctx.getImageData(0, 0, this._canvas.width, this._canvas.height).data;
        // get the image data object
        var image = ctx.getImageData(
          0,
          0,
          workingCanvas.width,
          workingCanvas.height
        );
        // get the image data values
        var data = image.data;
        const length = data.length;
        // set alpha=0 if match to color
        for (var i = 0; i < length; i += 4) {
          if (
            data[i + 0] == rgb.r &&
            data[i + 1] == rgb.g &&
            data[i + 2] == rgb.b
          ) {
            data[i + 3] = 0;
          }
        }
        // after the manipulation, reset the data
        // image.data = data;
        // and put the imagedata back to the canvas
        ctx.putImageData(image, 0, 0);
      }
      if (store) {
        this._canvas = workingCanvas;
      }
    }
    if (store) {
      workingCanvas = this._canvas;
    }
    return workingCanvas;
  }
}
