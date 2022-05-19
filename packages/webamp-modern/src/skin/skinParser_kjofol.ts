import parseXml, { XmlElement } from "@rgrove/parse-xml";
import JSZip from "jszip";
import UI_ROOT, { UIRoot } from "../UIRoot";
import Bitmap from "./Bitmap";
import BitmapFont from "./BitmapFont";
import { ImageManagerKjofol } from "./kjofolClasses/ImageManagerKjofol";
import Button from "./makiClasses/Button";
import Container from "./makiClasses/Container";
import EqVis from "./makiClasses/EqVis";
import Group from "./makiClasses/Group";
import Vis from "./makiClasses/Vis";
import SkinParser, { Attributes, GROUP_PHASE, RESOURCE_PHASE } from "./parse";

export default class KJofolSkinParser extends SkinParser {
  _config: {}; // whole kjofol.rc

  constructor(uiRoot: UIRoot) {
    /* Once UI_ROOT is not a singleton, we can create that objet in the constructor */
    uiRoot.setImageManager(new ImageManagerKjofol());
    super(uiRoot);
  }

  async parse(): Promise<UIRoot> {
    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    const configContent = await this._uiRoot.getFileAsString(".rc");

    this._config = parserRC(configContent);

    // await this.traverseChildren(parsed);
    await this.loadKnowBitmaps();
    const main = await this.loadMain();
    await this.loadMainNormal(main);
    // await this._loadBitmaps();

    // console.log("GROUP_PHASE #################");
    // this._phase = GROUP_PHASE;
    // const root = await this.getRootGroup();
    // await this.loadButtons(root);
    // await this.loadTime(root);

    return this._uiRoot;
  }

  //#region (collapsed) load-bitmap
  async loadKnowBitmaps() {
    //? BG
    await this.loadBitmap(this._config["BackgroundImage"], "base");
    await this.loadBitmap(this._config["BackgroundImage"], "base-inactive");
    //? Pressed
    for (var i = 1; i <= 3; i++) {
      const pressed = this._config[`BackgroundImagePressed${i}`];
      if (pressed != null) {
        await this.loadBitmap(pressed, `BMP${i}`);
      }
    }
    // await this._loadBitmap("playButton");
  }

  async loadMain(): Promise<Container> {
    let node = new XmlElement("container", {
      id: "main",
      x: "0",
      y: "0",
    });
    const main = await this.container(node);
    return main;
  }

  async loadMainNormal(parent: Container) {
    // const bg = await this.loadBitmap(this._config["BackgroundImage"]);
    const bg = UI_ROOT.getBitmap("base");
    let node = new XmlElement("container", {
      id: "normal",
      w: `${bg.getWidth()}`,
      h: `${bg.getHeight()}`,
    });
    const normal = await this.layout(node, parent);

    node = new XmlElement("group", {
      id: "main-root",
      background: bg.getId(),
      w: `${bg.getWidth()}`,
      h: `${bg.getHeight()}`,
    });
    const group = await this.group(node, normal);

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
    
    await this.loadButton("Play", group);
    await this.loadButton("Pause", group);
    await this.loadButton("Stop", group);
    await this.loadButton("PreviousSong", group);
    await this.loadButton("NextSong", group);
    await this.loadButton("OpenFile", group);
  }

  /**
   *
   * @param nick "Play" for "PlayButton"
   * @param parent
   */
  async loadButton(nick: string, parent: Group): Promise<Button> {
    const rect = this._config[`${nick}Button`];
    const [left, top, right, bottom, _action, downimage] = rect;
    let action: string;
    switch (_action.toLowerCase()) {
      case "stop!":
        action = "stop";
      case "previoussong":
        action = "prev";
      case "nextsong":
        action = "next";
      case "open":
        action = "eject";
      default:
        action = _action;
    }
    const node = new XmlElement("button", {
      id: nick,
      action,
      x: `${left}`,
      y: `${top}`,
      w: `${right - left}`,
      h: `${bottom - top}`,
      downimage,
    });
    const button = await this.button(node, parent);
    return button;
  }

  /**
   * Special case, base*.png should be loaded first,
   * because it's dimension (width & height) are required immediately by
   * Container / Layout.
   */
  // async loadBase() {
  //   // await this.loadPlainBitmap("base-alpha.png");
  // }

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
  async loadBitmap(fileName: string, name: string = null): Promise<Bitmap> {
    const bitmap = await this.loadPlainBitmap(fileName, name);
    // sometime the Audion Face has no hover.png
    if (bitmap.getImg() != null) {
      this.applyTransparency(bitmap);
    }
    return bitmap;
  }
  /**
   * Set all fuchsia color (#ff00ff) as transparent pixel
   * @param bitmap
   */
  applyTransparency(bitmap: Bitmap) {
    const rgb = { r: 255, g: 0, b: 255 }; //fuchsia
    let anyPixelChanged: boolean = false;
    const canvas = bitmap.getCanvas();
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);

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

function parserRC(content: string): { [key: string]: string | string[] } {
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
      // cfg[first] = words.length == 1 ? words[0] : words;

      let value: any;
      //? single string? don't bother with array, just return that string
      if (words.length == 1) {
        value = words[0];
      } else {
        value = words.map((v: string): any => {
          const num = parseInt(v);
          return isNaN(num) ? v : num;
        });
      }
      cfg[first] = value;
    }
  }

  console.log(cfg);

  return cfg;
}
