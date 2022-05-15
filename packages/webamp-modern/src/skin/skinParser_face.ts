import { XmlElement } from "@rgrove/parse-xml";
import JSZip from "jszip";
import UI_ROOT, { UIRoot } from "../UIRoot";
import SkinParser, { GROUP_PHASE, RESOURCE_PHASE } from "./parse";

export default class AudionFaceSkinParser extends SkinParser {
  _config: {};

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
    // await this.traverseChildren(parsed);
    await this.getRootGroup();

    return this._uiRoot;
  }

  async loadKnowBitmaps() {
    this.loadBase()
  }

  async loadBase() {
    const base = await this.loadBitmap("base.png");
    const alfa = await this.loadBitmap("base-alpha.png");

    const canvasb = base.getCanvas()
    const canvasa = alfa.getCanvas()
    const ctxb = canvasb.getContext('2d')
    const ctxa = canvasa.getContext('2d')
    const imgb = ctxb.getImageData(0,0,canvasb.width,canvasb.height)
    const imga = ctxa.getImageData(0,0,canvasa.width,canvasa.height)
    const datab = imgb.data
    const dataa = imga.data
    for (var i = 3; i < dataa.length; i += 4) {
      datab[i] = dataa[i];
    }
    ctxb.putImageData(imgb, 0, 0);

    document.getElementById('img-debug').setAttribute('src', canvasb.toDataURL())

    await base.setImage(canvasb.toDataURL(), this._imageManager)

    // await this._loadBitmap("playButton");
  }

  async loadBitmap(name: string) {
    //* const rect = this._config[`${name}Rect`];
    const bitmap = await this.bitmap({ id: name, file: name });
    await bitmap.ensureImageLoaded(this._imageManager);
    return bitmap;
  }

  async getRootGroup() {
    let node: XmlElement = new XmlElement("container", { id: "root" });
    const container = await this.container(node);
    //get layout size
    const base = this._uiRoot.getBitmap("base.png");
    node = new XmlElement("layout", {
      id: "normal",
      w: `${base.getWidth()}`,
      h: `${base.getHeight()}`,
      background: 'base.png'
    });
    const layout = await this.layout(node, container);
  }
}

/*
timeDigit4FirstPICTID
*/
