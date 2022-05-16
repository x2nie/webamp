import { XmlElement } from "@rgrove/parse-xml";
import { UIRoot } from "../UIRoot";
import Bitmap from "./Bitmap";
import ButtonFace from "./faceClasses/ButtonFace";
import Button from "./makiClasses/Button";
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
    await this.loadPlainBitmap("base-alpha.png");
    await this.loadBitmap("base.png");
  }

  async loadButtons(parent: Group) {
    await this.loadButton("pause", parent, { rectName: "play" });
    await this.loadButton("play", parent, {
      attributes: { visible: "allowed-to:play" },
    });
    await this.loadButton("stop", parent);
    await this.loadButton("rewind", parent, {
      fileName: "rw",
      action: "prev",
      attributes: { enabled: "allowed-to:prev" },
    });
    await this.loadButton("fastForward", parent, {
      fileName: "ff",
      action: "next",
      attributes: { enabled: "allowed-to:next" },
    });
    await this.loadButton("eject", parent, { fileName: "eject" });
    await this.loadButton("playlist", parent, { fileName: "menu" });
    await this.loadButton("info", parent, { fileName: "info" });
    await this.loadButton("volume", parent, { fileName: "volume" });
    await this.loadButton("mode", parent, { fileName: "music" });
    await this.loadButton("close", parent);
  }

  async loadButton(
    name: string,
    parent: Group,
    options: {
      fileName?: string;
      rectName?: string;
      action?: string;
      attributes?: { [key: string]: string };
    } = {}
  ) {
    const fileName = options.fileName || name;
    const rectName = options.rectName || name;
    const actionName = options.action || name;
    const rect = this._config[`${rectName}ButtonRect`];

    //? bitmaps for the button
    await this.loadBitmap(`${fileName}.png`, `${name}`, rect.left, rect.top);
    await this.loadBitmap(
      `${fileName}-hover.png`,
      `${name}-hover`,
      rect.left,
      rect.top
    );
    await this.loadBitmap(
      `${fileName}-active.png`,
      `${name}-active`,
      rect.left,
      rect.top
    );
    await this.loadBitmap(
      `${fileName}-disabled.png`,
      `${name}-disabled`,
      rect.left,
      rect.top
    );

    //? button
    const attributes = options.attributes || {};
    const node = new XmlElement("button", {
      id: name,
      image: `${name}`,
      downImage: `${name}-active`,
      hoverImage: `${name}-hover`,
      disabledImage: `${name}-disabled`,
      action: actionName,
      x: `${rect.left}`,
      y: `${rect.top}`,
      w: `${rect.right - rect.left}`,
      h: `${rect.bottom - rect.top}`,
      ...attributes,
    });
    const button = await this.buttonFace(node, parent);
    // return button;
  }
  async buttonFace(node: XmlElement, parent: any) {
    return this.newGui(ButtonFace, node, parent);
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

  /**
   * Load a bitmap from file, unmodified
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
    //* const rect = this._config[`${name}Rect`];
    const bitmap = await this.bitmap({ id: name, file: fileName });
    await bitmap.ensureImageLoaded(this._imageManager);
    return bitmap;
  }

  /**
   * Load bitmap and applyTransparency
   * @param name filename eg play-button.png
   */
  async loadBitmap(
    fileName: string,
    name: string = null,
    dx: number = 0,
    dy: number = 0
  ) {
    const bitmap = await this.loadPlainBitmap(fileName, name);
    this.applyTransparency(bitmap, dx, dy);
  }
  applyTransparency(bitmap: Bitmap, dx: number, dy: number) {
    const canvasb = bitmap.getCanvas();
    const ctxb = canvasb.getContext("2d");
    const imgb = ctxb.getImageData(0, 0, canvasb.width, canvasb.height);
    const datab = imgb.data;
    const dataa = this.alphaData;
    const bw = bitmap.getWidth();
    const bh = bitmap.getHeight();
    const aw = this._uiRoot.getBitmap("base-alpha.png").getWidth();

    for (var y = 0; y < bh; y++) {
      for (var x = 0; x < bw; x++) {
        // // for (var i = 3; i < dataa.length; i += 4) {
        const b = y * bw + x;
        //? ignore transparent
        if (datab[b * 4 + 3] != 0) {
          const a = (y + dy) * aw + dx + x;
          datab[b * 4 + 3] = dataa[a * 4 + 3];
        }
      }
    }
    ctxb.putImageData(imgb, 0, 0);

    // update img
    bitmap.setImage(canvasb);
  }

  async getRootGroup(): Promise<Group> {
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
    // return layout as Group;
    node = new XmlElement("group", {
      id: "wrapper",
      w: `0`,
      h: `0`,
      relatw: `1`,
      relath: `1`,
      // background: "base.png",
      // move:"1"
    });
    const group = await this.group(node, layout);
    node = new XmlElement("layer", {
      id: "mover",
      w: `0`,
      h: `0`,
      relatw: `1`,
      relath: `1`,
      // background: "base.png",
      move: "1",
    });
    const mover = await this.layer(node, group);
    return group;
  }
}

/*
Gizmo2.0
timeDigit1FirstPICTID 140 timeDigit1Rect
timeDigit2FirstPICTID 160 timeDigit2Rect
timeDigit3FirstPICTID 180 timeDigit3Rect
timeDigit4FirstPICTID 191 timeDigit4Rect
trackDigit1FirstPICTID 202
trackDigit2FirstPICTID 213

TokyoBay
trackDigit1FirstPICTID 140
trackDigit2FirstPICTID 160
timeDigit1FirstPICTID 180 timeDigit1Rect
timeDigit2FirstPICTID 200 timeDigit2Rect
timeDigit3FirstPICTID 220 timeDigit3Rect
timeDigit4FirstPICTID 240 timeDigit4Rect

*/
