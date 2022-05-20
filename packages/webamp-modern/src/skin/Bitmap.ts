import UI_ROOT from "../UIRoot";
import { assert, getId, hexToRgb, normalizeDomId, num, px } from "../utils";
import ImageManager, { loadImage } from "./ImageManager";

export function genCssVar(bitmapId: string): string {
  return `--bitmap-${bitmapId.replace(/[^a-zA-Z0-9]/g, "-")}`;
}

// http://wiki.winamp.com/wiki/XML_Elements#.3Cbitmap.2F.3E
export default class Bitmap {
  _id: string;
  _cssVar: string;
  _url: string;
  _img: CanvasImageSource;
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
        this._id = value; //TODO: should be lowerCase here.
        this._cssVar = genCssVar(this.getId());
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
        //seem as only windows media player uses it.
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

  getImg(): CanvasImageSource {
    return this._img;
  }
  setImage(img: CanvasImageSource) {
    // await imageManager.setImage(this._file, url);
    // await this.ensureImageLoaded(imageManager);
    this._img = img;
  }

  loaded(): boolean {
    return this._img !=null;
  }

  // Ensure we've loaded the image into our image loader.
  async ensureImageLoaded(
    imageManager: ImageManager,
    allowReturnNull: boolean = false
  ) {
    assert(
      this._url == null,
      // this._loaded == false,
      "Tried to ensure a Bitmap was laoded more than once."
    );

    // if (!this._ownCache) {
      //force. also possibly set null:
      this._img = await imageManager.getImage(this._file);
    // }
    //this._loaded = true;
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
   * Final function that uses Bitmap;
   * Afther call this, bitmap maybe destroyed.
   * @returns url string used as embedded in <head><style>
   */
  async toDataURL(): Promise<string> {
    if (this._file.endsWith(".gif") && !this._transparentColor) {
      // don't draw _img into canvas, if it is animated gif
      return await UI_ROOT.getImageManager().getUrl(this._file);
    } else {
      return this.getCanvas().toDataURL();
    }
  }

  /**
   * Useful for calculating clip-path
   * @param store whether the generated canvas should be
   *              kept by this bitmap instance
   * @returns <canvas/>
   */
  getCanvas(
    applyTransparency: boolean = true,
    store: boolean = false
  ): HTMLCanvasElement {
    let workingCanvas: HTMLCanvasElement;
    if (this._canvas == null || !store) {
      assert(
        this._img != null,
        `Expected bitmap image to be loaded: ${this.getId()}`
      );
      workingCanvas = document.createElement("canvas");
      workingCanvas.width = this.getWidth() /* || this._img.width */;
      workingCanvas.height = this.getHeight() /* || this._img.height */;
      const ctx = workingCanvas.getContext("2d");
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      ctx.drawImage(this._img, -this._x, -this._y);

      //set transparentColor if any
      if (applyTransparency && this._transparentColor != null) {
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
