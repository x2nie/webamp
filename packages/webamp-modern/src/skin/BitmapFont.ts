import { Component, xml, useEnv } from "@odoo/owl";
import { num, px, toBool } from "../utils";
import Bitmap from "./Bitmap";
import ImageManager from "./ImageManager";

const NUMS = "0123456789 -";
const CHARS = [
  'abcdefghijklmnopqrstuvwxyz"@  ',
  "0123456789\u2026.:()-'!_+\\/[]^&%,=$#\nâöä?*",
];

const CHAR_MAP = {};
CHARS.forEach((chars, line) => {
  chars.split("").forEach((char, col) => {
    CHAR_MAP[char] = [col, line];
  });
});
// console.log("CHAR_MAP:", CHAR_MAP);

export class BitmapFontUI extends Component {
  static template = xml`
    <wrap font="BitmapFont" t-att-style="style()">
      <t t-foreach="chars()" t-as="style" t-key="style_index">
        <span t-att-style="style"/>
      </t>
    </wrap>`;

  setup(): void {
    this.env = useEnv()
  }
  get att() {
    return this.props.node.attributes;// <text>
  }
  get font() {
    return this.props.font.attributes;// <bitmapfont>
  }
  chars(){
    const chars = []
    const {charwidth,charheight} = this.font;
    const {timecolonwidth} = this.att;
    for (const char of this.props.text.split("")) {
      let style = ''
      const [x, y] = CHAR_MAP[char.toLocaleLowerCase()] ?? CHAR_MAP[" "];
      style += `--x:${px(-x * charwidth)};`
      style += `--y:${px(-y * charheight)};`
      if(char==':'&& timecolonwidth){
        style += `--charwidth: ${timecolonwidth}px;`
      }
      chars.push(style)
      // const charNode = font.renderLetter(char);
      // // TODO: This is quite hacky.
      // if (char === ":" && useColonWidth) {
      //   charNode.style.width = px(this._timeColonWidth);
      //   charNode.style.marginRight = "0";
      // }
      // this._textWrapper.appendChild(charNode);
    }
    return chars
  }
  style(){
    let style = ''
    const {url, charheight, charwidth,hspacing} = this.font

    // style += `display:block;`;
    style += `background-image:url(${url});`;
    style += `background-position-y:-${charheight}px;`;
    style += `height:${px(charheight)};`;
    style += `--charheight: ${charheight}px;`
    style += `--charwidth: ${charwidth}px;`
    style += `--hspacing: ${hspacing}px;`
    // style += `width:100px;`;
    return style
  }
}


// http://wiki.winamp.com/wiki/XML_Elements#.3Cbitmapfont.2F.3E
export default class BitmapFont extends Bitmap {
  _charWidth: number;
  _charHeight: number;
  _horizontalSpacing: number = 0;
  _verticalSpacing: number;
  _externalBitmap: boolean = false; //? true == _file = another.bitmap.id
  _bitmap: Bitmap = null; // the real external bitmap
  _wa2bignum: number = 0; //? special index for minus char ( '-' ). 1= has minus sign. | -1 no minus

  setXmlAttr(_key: string, value: string): boolean {
    if (super.setXmlAttr(_key, value)) {
      return true;
    }

    const key = _key.toLowerCase();
    switch (key) {
      case "charwidth":
        this._charWidth = num(value);
        break;
      case "charheight":
        this._charHeight = num(value);
        break;
      case "hspacing":
        this._horizontalSpacing = num(value);
        break;
      case "vspacing":
        this._verticalSpacing = num(value);
        break;
      case "wa2bignum": // only webamp, not available in winamp
        this._wa2bignum = num(value);
        break;
      default:
        return false;
    }
    return true;
  }

  getHorizontalSpacing(): number {
    return this._horizontalSpacing;
  }

  _setAsBackground(div: HTMLElement, prefix: string) {
    if (this._externalBitmap) {
      if (!this._bitmap && this._uiRoot != null) {
        this._bitmap = this._uiRoot.getBitmap(this._file);
      }
      if (this._bitmap != null) {
        this._bitmap._setAsBackground(div, prefix);
      }
    } else {
      super._setAsBackground(div, prefix);
    }
  }

  // TODO: This could likely be made more efficient.
  // For example, if we could do this in CSS, we could define everything except
  // the background position just once.
  renderLetter(char: string): HTMLSpanElement {
    if (char == "-" && this._wa2bignum != 0) {
      if (this._wa2bignum == 1) {
        char = "."; // Winamp2 nums_ex.bmp = '0123456789 -`
      } else {
        return this.renderWa2MinusChar();
      }
    }
    const span = document.createElement("span");
    const [x, y] = CHAR_MAP[char.toLocaleLowerCase()] ?? CHAR_MAP[" "];
    span.innerText = char; // Keep things accessible
    span.style.setProperty("--x", px(-(this._charWidth * x)));
    span.style.setProperty("--y", px(-(this._charHeight * y)));
    return span;
  }
  renderWa2MinusChar(): HTMLSpanElement {
    const span = document.createElement("span");
    span.innerText = "-"; // Keep things accessible
    span.classList.add("minus", "bignum");
    return span;
  }

  useExternalBitmap(): boolean {
    return this._externalBitmap;
  }

  setExternalBitmap(isExternal: boolean) {
    this._externalBitmap = isExternal;
  }
}
