import parseXml, { XmlElement } from "@rgrove/parse-xml";
import JSZip from "jszip";
import { UIRoot } from "../UIRoot";
import Bitmap from "./Bitmap";
import BitmapFont from "./BitmapFont";
import EqVis from "./makiClasses/EqVis";
import Vis from "./makiClasses/Vis";
import SkinParser, { Attributes, GROUP_PHASE, RESOURCE_PHASE } from "./parse";

export default class KJofolSkinParser extends SkinParser {
  _config: {}; // whole kjofol.rc

  async parse(): Promise<UIRoot> {
    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    const configContent = await this._uiRoot.getFileAsString(".rc");

    this._config = parserRC(configContent);

    // await this.traverseChildren(parsed);
    await this.loadMain();
    // await this._loadBitmaps();

    // console.log("GROUP_PHASE #################");
    // this._phase = GROUP_PHASE;
    // const root = await this.getRootGroup();
    // await this.loadButtons(root);
    // await this.loadTime(root);

    return this._uiRoot;
  }

  //#region (collapsed) load-bitmap

  async loadMain() {
    const bg = await this.loadBitmap(this._config["BackgroundImage"]);
    // await this._loadBitmap("playButton");
    let node = new XmlElement('container', {
      id:'main',
      x: '0',
      y: '0',
    })
    const main = await this.container(node)

    node = new XmlElement('container', {
      id:'normal',
      w: `${bg.getWidth()}`,
      h: `${bg.getHeight()}`
    })
    const normal = await this.layout(node, main)

    node = new XmlElement('group', {
      id:'main-root',
      background: bg.getId(),
      w: `${bg.getWidth()}`,
      h: `${bg.getHeight()}`
    })
    const group = await this.group(node, normal)
  }

  /**
   * Special case, base*.png should be loaded first,
   * because it's dimension (width & height) are required immediately by
   * Container / Layout.
   */
  async loadBase() {
    // await this.loadPlainBitmap("base-alpha.png");
  }

  //#endregion

  // #region (collapsed) Bitmap manipulation

  /**
   * Load a bitmap from file, unmodified. Also register bitmapId
   * @param name
   * @returns
   */
  async loadPlainBitmap(
    fileName: string,
    name: string = null
  ): Promise<Bitmap> {
    if (name == null) {
      name = fileName;
    }
    const bitmap = await this.bitmap({ id: name, file: fileName });
    await bitmap.ensureImageLoaded(this._imageManager, true);
    return bitmap;
  }

  /**
   * Load bitmap and applyTransparency
   * @param name filename eg play-button.png
   */
  async loadBitmap(
    fileName: string,
    name: string = null
  ): Promise<Bitmap>  {
    const bitmap = await this.loadPlainBitmap(fileName, name);
    // sometime the Audion Face has no hover.png
    if (bitmap.getImg() != null) {
      this.applyTransparency(bitmap);
    }
    return bitmap;
  }
  applyTransparency(bitmap: Bitmap) {
    const rgb = { r: 255, g: 0, b: 255 }; //fuchsia
    let anyPixelChanged: boolean = false;
    const canvas = bitmap.getCanvas();
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // const dataa = this.alphaData;
    const w = bitmap.getWidth();
    const h = bitmap.getHeight();
    // const aw = this._uiRoot.getBitmap("base-alpha.png").getWidth();

    // get the image data values
    const data = img.data;
    const length = data.length;
    // set alpha=0 if match to color
    for (var i = 0; i < length; i += 4) {
      if (
        data[i + 0] == rgb.r &&
        data[i + 1] == rgb.g &&
        data[i + 2] == rgb.b
      ) {
        data[i + 3] = 0;
        anyPixelChanged = true;
      }
    }

    // to reduce resource in RAM and avoid polution,
    // we do not add new resource if the bitmap is completely opaque
    if (anyPixelChanged) {
      ctx.putImageData(img, 0, 0);

      // update img
      bitmap.setImage(canvas);
    }
  }
  //#endregion
}

function parserRC(content: string): { [key: string]: string|string[] } {
  const cfg: { [key: string]: any } = {};
  content = content.replace(/\r/g, "");
  const lines = content.split("\n");
  for (var line of lines) {
    if (line.startsWith("#")) continue;

    var words = line.split(" ");
    var first = words.shift(); // pop the first

    if (line.startsWith("About ")) {
      cfg["About"] = [...(cfg["About"] || [])].concat([words.join(" ")]);
    } else {
      cfg[first] = words.length==1? words[0] : words;
    }
  }

  console.log(cfg);

  return cfg;
}
