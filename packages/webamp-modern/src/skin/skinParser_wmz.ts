import parseXml, { XmlDocument, XmlElement } from "@rgrove/parse-xml";
import Parser from "@rgrove/parse-xml/src/lib/Parser";
import JSZip from "jszip";
import UI_ROOT, { UIRoot } from "../UIRoot";
import BitmapFont from "./BitmapFont";
import EqVis from "./makiClasses/EqVis";
import Vis from "./makiClasses/Vis";
import SkinParser, { GROUP_PHASE, RESOURCE_PHASE } from "./parse";
import ButtonElement from "./wmzElements/ButtonElement";
import ButtonGroup from "./wmzElements/ButtonGroup";
import View from "./wmzElements/View";

export default class WmpSkinParser extends SkinParser {
  constructor(uiRoot: UIRoot) {
    super(uiRoot);
    // load internal wsz prototype from:
    // this._pushStreamSource("assets/winamp_classic/", null);
  }

  async parse(): Promise<UIRoot> {
    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    let includedXml = await this._uiRoot.getFileAsString(".wms");
    // for(var i = 0; i<12; i++){
    //   console.log(i, includedXml.charCodeAt(i))
    // }
    // includedXml = includedXml.substring(6, includedXml.length)

    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = this.parseXmlFragment(
      // utf8Encode(includedXml)
      decodeWideChars(includedXml)
      // decodeUTF16LE(includedXml)
    ) as unknown as XmlElement;

    await this.traverseChildren(parsed);

    await this._loadBitmaps();

    console.log("GROUP_PHASE #################");
    this._phase = GROUP_PHASE;
    await this.traverseChildren(parsed);

    //debug:
    for (const bmpId of Object.keys(UI_ROOT.getBitmaps())) {
      console.log("bitmap loaded:", bmpId);
    }

    return this._uiRoot;
  }

  async traverseChild(node: XmlElement, parent: any) {
    //? it completely replace this super method.
    const tag = node.name.toLowerCase();
    switch (tag) {
      case "theme":
        return this.theme(node, parent);
      case "view":
        return this.view(node, parent);
      case "subview":
        return this.subview(node, parent);
      case "buttongroup":
        return this.buttongroup(node, parent);
      case "buttonelement":
      case "playelement":
      case "stopelement":
        return this.buttonelement(node, parent);
      // Note: Included files don't have a single root node, so we add a synthetic one.
      // A different XML parser library might make this unnessesary.
      case "wrapper":
        return this.traverseChildren(node, parent);
      default:
        // TODO: This should be the default fall through
        if (this._uiRoot.getXuiElement(tag)) {
          return this.dynamicXuiElement(node, parent);
        } else if (this._predefinedXuiNode(tag)) {
          return this.dynamicXuiElement(node, parent);
        }
        console.warn(`Unhandled XML node type: ${node.name}`);
        return;
    }
  }

  /**
   * <view> = <container><layout/></container>
   * @param node
   * @param parent
   */
  async view(node: XmlElement, parent: any) {
    const attr = node.attributes;
    const containerEl = new XmlElement("container", {
      id: attr.id || "main",
    });
    const container = await this.container(containerEl, null);

    //? layout
    node.attributes.id = "normal";
    node.attributes.w = node.attributes.width;
    node.attributes.h = node.attributes.height;
    node.attributes.background = node.attributes.backgroundimage;

    await this.newGroup(View, node, container);
  }

  async subview(node: XmlElement, parent: any) {
    node.attributes.w = node.attributes.width;
    node.attributes.h = node.attributes.height;
    node.attributes.x = node.attributes.left;
    node.attributes.y = node.attributes.top;
    node.attributes.background = node.attributes.backgroundimage;

    await this.group(node, parent);
  }

  async buttongroup(node: XmlElement, parent: any) {
    node.attributes.w = node.attributes.width;
    node.attributes.h = node.attributes.height;
    node.attributes.x = node.attributes.left;
    node.attributes.y = node.attributes.top;
    node.attributes.background = node.attributes.backgroundimage;

    return await this.newGroup(ButtonGroup, node, parent);
  }

  async buttonelement(node: XmlElement, parent: any) {
    node.attributes.w = node.attributes.width;
    node.attributes.h = node.attributes.height;
    node.attributes.x = node.attributes.left;
    node.attributes.y = node.attributes.top;
    node.attributes.background = node.attributes.backgroundimage;

    return await this.newGui(ButtonElement, node, parent);
  }

  /**
   * WMZ seem as has only one xml; that is it
   * @param node
   * @param parent
   */
  async theme(node: XmlElement, parent: any) {
    if (this._phase == RESOURCE_PHASE) {
      this._uiRoot.setSkinInfo(node.attributes);
      console.log(node.attributes);
      return await this.parseAttributesAsImages(node);
    } else {
      await this.traverseChildren(node, parent);
    }
  }

  /**
   * wmp has no <bitmap/>, we load bitmaps here
   * @param theme
   * @returns
   */
  async parseAttributesAsImages(theme: XmlElement) {
    // return;
    const recursiveScanChildren = (mother: XmlElement) => {
      for (const element of mother.children) {
        if (element instanceof XmlElement) {
          this._lowercaseAttributes(element); // set all xml attribute to lowercase.
          for (const att of [
            "image",            
            "backgroundimage",
            "disabledimage",
            "downimage",
            "thumbimage",
            "hoverimage",
            "mappingimage",
          ])
            if (element.attributes[att]) {
              const bitmapId = element.attributes[att];
              const node = new XmlElement("bitmap", {
                id: bitmapId,
                file: bitmapId,
              });
              this.bitmap(node);
            }
          recursiveScanChildren(element);
        }
      }
    }; //eof function

    recursiveScanChildren(theme);
  }

  _lowercaseAttributes(element: XmlElement) {
    for (const att of Object.keys(element.attributes)) {
      if (att != att.toLowerCase()) {
        element.attributes[att.toLowerCase()] = element.attributes[att];
        delete element.attributes[att];
      }
    }
  }

  parseXmlFragment(xml: string): XmlElement {
    if (!xml.startsWith("<wrapper>")) {
      xml = `<wrapper>${xml}</wrapper>`;
    }
    let result;
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    try {
      // result= parseXml(xml) as unknown as XmlElement;
      result = parseXml2(xml) as unknown as XmlElement;
    } catch (error) {
      console.warn(error);
      console.log("e:", error.message);
      console.log("column:", error.column);
      console.log("exceprt:", error.excerpt);
      console.log("line:", error.line);
      console.log("pos:", error.pos);
      console.log(error.excerpt.substring(error.column, error.column + 100));
      console.log("full:", xml.substring(error.pos, error.pos + 100));
    }
    return result;
  }
}
//
//

//Braindead decoder that assumes fully valid input
function decodeUTF16LE(binaryStr) {
  var cp = [];
  for (var i = 0; i < binaryStr.length; i += 2) {
    cp.push(binaryStr.charCodeAt(i) | (binaryStr.charCodeAt(i + 1) << 8));
  }

  var result = String.fromCharCode.apply(String, cp);
  console.log("res:", result);
  return result;
}

function decodeWideChars(binaryStr: string) {
  if (binaryStr.charCodeAt(0) < 256) {
    return binaryStr;
  }
  var cp = "";
  for (var i = 1; i < binaryStr.length; i += 2) {
    cp += binaryStr[i];
  }
  var result = cp;
  // console.log("res:", result);
  return result;
}

/**
 * Encodes multi-byte Unicode string into utf-8 multiple single-byte characters
 * (BMP / basic multilingual plane only).
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars.
 *
 * Can be achieved in JavaScript by unescape(encodeURIComponent(str)),
 * but this approach may be useful in other languages.
 *
 * @param   {string} unicodeString - Unicode string to be encoded as UTF-8.
 * @returns {string} UTF8-encoded string.
 */
function utf8Encode(unicodeString) {
  if (typeof unicodeString != "string")
    throw new TypeError("parameter ‘unicodeString’ is not a string");
  const utf8String = unicodeString
    .replace(
      /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | (cc >> 6), 0x80 | (cc & 0x3f));
      }
    )
    .replace(
      /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function (c) {
        var cc = c.charCodeAt(0);
        return String.fromCharCode(
          0xe0 | (cc >> 12),
          0x80 | ((cc >> 6) & 0x3f),
          0x80 | (cc & 0x3f)
        );
      }
    );
  console.log("res:", utf8String);
  return utf8String;
}

class Parser2 extends Parser {
  error(message) {
    if (message.startsWith("Duplicate attribute:")) {
      return; // do not stop on duplicat
    }
    super.error(message);
  }
}

function parseXml2(xml: string, options: any = undefined): XmlDocument {
  return new Parser2(xml, options).document;
}
