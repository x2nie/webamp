import { XmlElement } from "@rgrove/parse-xml";
import JSZip from "jszip";
import UI_ROOT, { UIRoot } from "../UIRoot";
import Group from "./makiClasses/Group";
import SkinParser, { GROUP_PHASE, RESOURCE_PHASE } from "./parse";

export default class AudionFaceSkinParser extends SkinParser {
  _config: {}; // whole index.json
  _alphaData: Uint8ClampedArray = null; // canvas.contex2d.data.data

  constructor(uiRoot: UIRoot) {
    super(uiRoot);
  }

  async parse(): Promise<UIRoot> {
    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    const configContent = await this._uiRoot.getFileAsString("index.json");

    this._config = JSON.parse(configContent);

    // await this.traverseChildren(parsed);
    await this.loadKnowBitmaps();
    await this._loadBitmaps();

    console.log("GROUP_PHASE #################");
    this._phase = GROUP_PHASE;
    const root = await this.getRootGroup();
    await this.loadButtons(root);

    return this._uiRoot;
  }

  async loadKnowBitmaps() {
    await this.loadBase();
    // await this._loadBitmap("playButton");
  }

  /**
   * Special case, base*.png should be loaded first,
   * because it's dimension (width & height) are required immediately by
   * Container / Layout.
   */
  async loadBase() {
    await this.loadBitmap("base-alpha.png");
    await this.loadBitmap("base.png");
    // const alfa = await this.loadBitmap("base-alpha.png");

    this.applyTransparency("base.png");
  }

  async loadButtons(parent: Group) {

  }

  applyTransparency(bitmapId: string) {
    let modified: boolean = false;
    const bitmap = this._uiRoot.getBitmap(bitmapId);
    const canvasb = bitmap.getCanvas();
    const ctxb = canvasb.getContext("2d");
    const imgb = ctxb.getImageData(0, 0, canvasb.width, canvasb.height);
    const datab = imgb.data;
    const dataa = this.alphaData;
    for (var i = 3; i < dataa.length; i += 4) {
      //? ignore transparent
      if (datab[i] != 0) {
        datab[i] = dataa[i];
      }
    }
    ctxb.putImageData(imgb, 0, 0);

    // update img
    bitmap.setImage(canvasb);
  }

  get alphaData(): Uint8ClampedArray {
    if (!this._alphaData) {
      const alphaBitmap = this._uiRoot.getBitmap("base-alpha.png");
      const canvasa = alphaBitmap.getCanvas();
      const ctxa = canvasa.getContext("2d");
      const imga = ctxa.getImageData(0, 0, canvasa.width, canvasa.height);
      this._alphaData = imga.data;
    }
    return this._alphaData;
  }
  async loadBitmap(name: string) {
    //* const rect = this._config[`${name}Rect`];
    const bitmap = await this.bitmap({ id: name, file: name });
    await bitmap.ensureImageLoaded(this._imageManager);
    return bitmap;
  }

  async getRootGroup():Promise<Group> {
    let node: XmlElement = new XmlElement("container", { id: "root" });
    const container = await this.container(node);
    //get layout size
    const base = this._uiRoot.getBitmap("base.png");
    node = new XmlElement("layout", {
      id: "normal",
      w: `${base.getWidth()}`,
      h: `${base.getHeight()}`,
      background: "base.png",
    });
    const layout = await this.layout(node, container);
    // const group = await this.group(node, container);
    return layout as Group;
  }
}

/*
timeDigit4FirstPICTID
*/
