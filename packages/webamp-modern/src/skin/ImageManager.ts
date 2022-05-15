import UI_ROOT from "../UIRoot";
import { getCaseInsensitiveFile } from "../utils";
import Bitmap from "./Bitmap";

// https://png-pixel.com/
const DEFAULT_IMAGE_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==";

export default class ImageManager {
  _urlCache: Map<string, string> = new Map();
  _imgCache: Map<string, HTMLImageElement> = new Map();
  // _pathofBitmap = {}; //? file : true|false|null
  // _bitmaps: { [key: string]: Bitmap } = {}; //? Bitmap:file

  async getUrl(filePath: string): Promise<string | null> {
    if (!this._urlCache.has(filePath)) {
      const imgBlob = await UI_ROOT.getFileAsBlob(filePath);
      if (imgBlob == null) {
        return null;
      }
      const imgUrl = await getUrlFromBlob(imgBlob);
      this._urlCache.set(filePath, imgUrl);
    }
    return this._urlCache.get(filePath);
  }

  getCachedUrl(filePath: string): string {
    return this._urlCache.get(filePath);
  }

  addBitmap0(bitmap: Bitmap) {
    const id = bitmap.getId().toLowerCase();
    const filePath = bitmap.getFile().toLowerCase();
    this._pathofBitmap[filePath] = false;
    this._bitmaps[id] = bitmap;
  }

  isFilePathAdded(filePath: string) {
    return Object.keys(this._pathofBitmap).includes(filePath);
  }

  // Ensure we've loaded the image into our image loader.
  async loadUniquePaths() {
    const bitmaps: Bitmap[] = [];

    //? Collect unique filepath
    const filesPath: string[] = [];
    for (const bitmap of Object.values(UI_ROOT.getBitmaps())) {
      //? ignore bitmap that already has _img
      if (!bitmap.getImg()) {
        if (!filesPath.includes(bitmap.getFile())) {
          filesPath.push(bitmap.getFile());
          bitmaps.push(bitmap);
        }
      }
    }
    await Promise.all(
      filesPath.map(async (filePath) => {
        await this.getImage(filePath);
      })
    );
    return bitmaps;
  }

  async ensureBitmapsLoaded() {
    const bitmaps = await this.loadUniquePaths();

    return Promise.all(
      bitmaps.map(async (bitmap) => {
        // await this.setBimapImg(bitmap);
        bitmap._img = await this.getImage(bitmap.getFile());
        if (bitmap._img && bitmap._width == null && bitmap._height == null) {
          bitmap.setXmlAttr("w", String(bitmap._img.width));
          bitmap.setXmlAttr("h", String(bitmap._img.height));
        }
      })
    );
  }

  // async setBimapImg(bitmap: Bitmap) {
  //   if (!bitmap._ownCache) {
  //     bitmap._img = await this.getImage(bitmap.getFile());
  //   }
  // }

  async getImage(filePath: string): Promise<HTMLImageElement | null> {
    if (!this._imgCache.has(filePath)) {
      // TODO: We could cache this
      const url = (await this.getUrl(filePath)) ?? DEFAULT_IMAGE_URL;
      const img = await loadImage(url);
      this._imgCache.set(filePath, img);
    }
    return this._imgCache.get(filePath);
  }

  // /**
  //  * Useful if an img is modified/drawn
  //  * @param filePath 
  //  * @param url 
  //  */
  // async setImage(filePath: string, url: string) {
  //   const img = await loadImage(url);
  //   this._imgCache.set(filePath, img);
  //   // return this._imgCache.get(filePath);
  // }
}

// This is intentionally async since we may want to sub it out for an async
// function in a node environment
async function getUrlFromBlob(blob: Blob): Promise<string> {
  // We initiallay used `URL.createObjectURL(blob)` here, but it had an issue
  // where, when used as a background imaged, they would take more than one
  // frame to load resulting in a white flash when switching background iamges.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      // @ts-ignore This API is not very type-friendly.
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function loadImage(imgUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.addEventListener("error", (e) => {
      reject(e);
    });
    img.src = imgUrl;
  });
}
