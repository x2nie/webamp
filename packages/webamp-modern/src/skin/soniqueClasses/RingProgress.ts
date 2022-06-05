import { num } from "../../utils";
import GuiObj from "../makiClasses/GuiObj";

export default class RingProgress extends GuiObj {
  _rgnId: string;
  _action: string;
  _colors: string[] = [];
  _degree: number = 360; // 0..360
  _bgColor: string;
  _bgImageId: string;
  _maskId: string;
  _progress: number = 0.7; //temporary

  getElTag(): string {
    return "layer";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      //   case "region":
      //     this._rgnId = value;
      //     break;
      //   case "background":
      //     this._bgImageId = value;
      //     break;
      case "degree":
        this._degree = num(value);
        break;
      case "mask":
        this._maskId = value;
        break;
      case "colors":
        this._buildColors(value);
        break;
      default:
        return false;
    }
    return true;
  }

  /**
   *
   * @param colors separated comma sonique color
   * * Note: RGB = 0xRRGGBB
   * *       ARGB = 0XFFRRGGBB
   */
  _buildColors(colors: string) {
    for (var color of colors.split(",")) {
      if (!color.startsWith("0x")) {
        throw new Error("color is expected in 0xFF999999 format.");
      }
      if (color.length == 10) {
        color = color.substring(4);
      } else {
        color = color.substring(2);
      }
      this._colors.push(`#${color}`);
    }
  }

  drawMask() {
    if (!this._maskId) return;
    const bitmap = this._uiRoot.getBitmap(this._maskId);
    bitmap._setAsBackground(this.getDiv(), "mask");
    // bitmap.setAsBackground(this.getDiv());
    // this.getDiv().classList.add('webamp--img')
    this.getDiv().style.setProperty('-webkit-mask-image', `var(${bitmap.getCSSVar()})`)
    this.getDiv().style.setProperty('webkit-mask-image', `var(${bitmap.getCSSVar()})`)
  }

  drawProgress() {
    const fullColors = this._colors.map((color,i, arr)=>`${color} ${(i+1) * this._degree / arr.length}deg`)
    if(this._degree<360){
      fullColors.push(`${this._colors[this._colors.length-1]} ${this._degree}deg`)
      fullColors.push(`transparent ${this._degree}deg`)
    }
    this.getDiv().style.backgroundImage = `conic-gradient(${fullColors.join(', ')})`;
  }

  draw(): void {
    super.draw();
    this.drawMask();
    this.drawProgress();
  }
}
