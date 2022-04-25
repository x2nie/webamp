import parseXml, { XmlElement } from "@rgrove/parse-xml";
import { UIRoot } from "../UIRoot";
import BitmapFont from "./BitmapFont";
import EqVis from "./makiClasses/EqVis";
import Vis from "./makiClasses/Vis";
import SkinParser, {
  GROUP_PHASE,
  parseXmlFragment,
  RESOURCE_PHASE,
} from "./parse";

export default class ClassicSkinParser extends SkinParser {
  _wszRoot: string = "/assets/winamp_classic/";

  constructor(uiRoot: UIRoot) {
    super(uiRoot);
    // load internal wsz prototype from:
    uiRoot.setSkinDir("assets/winamp_classic/");
  }

  async _internalFile(fileName: string): Promise<string> {
    return await this._uiRoot.getFileAsStringPath(
      /* this._wszRoot + */ fileName
    );
  }

  async _parseInternalFile(fileName: string) {
    let content = await this._internalFile(fileName);
    content = content.replace(/wsz_root\//gi, "");
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXmlFragment(content);
    await this.traverseChildren(parsed);
  }

  async parse() {
    // Load built-in xui elements
    // await this.parseFromUrl("assets/xml/xui/standardframe.xml");

    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    // Load built-in xui elements
    // await this.loadFreeformXui();

    await this._parseInternalFile("xml/player-elements.xml");
    await this._parseInternalFile("xml/eq-elements.xml");
    await this._parseInternalFile("xml/eq.xml");

    await this._solveMissingBitmaps();
    await this._imageManager.loadUniquePaths();
    await this._imageManager.ensureBitmapsLoaded();

    console.log("GROUP_PHASE #################");
    this._phase = GROUP_PHASE;
    await this._parseInternalFile("xml/player.xml");
    //eqmain.bmp seem as not yet loaded, temporary disable:
    await this._parseInternalFile("xml/eq.xml");

    console.log("BUCKET_PHASE #################");
    await this.rebuildBuckets();

    return this._uiRoot;
  }

  //special loading mode. WSZ has no script.
  async script(node: XmlElement, parent: any) {
    // temporary hack
    const binFunc = this._uiRoot.getFileAsBytes;
    this._uiRoot.getFileAsBytes = this._uiRoot.getFileAsBytesPath;

    await super.script(node, parent);

    this._uiRoot.getFileAsBytes = binFunc;
  }

  //special case, wsz never use external/linked bitmap in its filename
  _isExternalBitmapFont(font: BitmapFont) {
    return false;
  }

  //   async bitmapFont(node: XmlElement) {
  //     // assume(
  //     //   node.children.length === 0,
  //     //   "Unexpected children in <bitmapFont> XML node."
  //     // );
  //     const font = new BitmapFont();
  //     font.setXmlAttributes(node.attributes);

  //       this._imageManager.addBitmap(font);
  //     }

  //     this._uiRoot.addFont(font);
  //   }

  async eqvis(node: XmlElement, parent: any): Promise<EqVis> {
    const eqv = await super.eqvis(node, parent);
    if (this._imageManager.isFilePathAdded("eqmain.bmp")) {
      //gradient lines
      let node: XmlElement = new XmlElement("bitmap", {
        id: "eq_gradient_line_",
        file: "eqmain.bmp",
        x: "115",
        y: "294",
        w: "1",
        h: "19",
      });
      await this.bitmap(node);
      eqv.setXmlAttr("colors", "eq_gradient_line_");
      // x="115" y="294" h="19" w="1"

      //preamp
      node = new XmlElement("bitmap", {
        id: "eq_preamp_line_",
        file: "eqmain.bmp",
        x: "0",
        y: "314",
        w: "113",
        h: "1",
      });
      await this.bitmap(node);
      eqv.setXmlAttr("preamp", "eq_preamp_line_");
    }
    return eqv;
  }

  async vis(node: XmlElement, parent: any): Promise<Vis> {
    const vis = await super.vis(node, parent);

    const content = await this._uiRoot.getFileAsString("viscolor.txt");
    if (content) {
      const colors = parseViscolors(content);
      for (let i = 1; i < 16; i++) {
        vis.setxmlparam(`colorband${i}`, colors[i]);
      }
    }

    return vis;
  }
}

const parseViscolors = (text: string): string[] => {
  const entries = text.split("\n");
  const regex = /^\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)/;
  const colors = [
    "0,0,0",
    "24,33,41",
    "239,49,16",
    "206,41,16",
    "214,90,0",
    "214,102,0",
    "214,115,0",
    "198,123,8",
    "222,165,24",
    "214,181,33",
    "189,222,41",
    "148,222,33",
    "41,206,16",
    "50,190,16",
    "57,181,16",
    "49,156,8",
    "41,148,0",
    "24,132,8",
    "255,255,255",
    "214,214,222",
    "181,189,189",
    "160,170,175",
    "148,156,165",
    "150,150,150",
  ];
  entries
    .map((line) => regex.exec(line))
    .filter(Boolean)
    .map((matches) => (matches as RegExpExecArray).slice(1, 4).join(","))
    .map((rgb, i) => {
      colors[i] = rgb; // `rgb(${rgb})`;
    });
  return colors;
};
