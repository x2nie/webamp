import { useEnv } from "@odoo/owl";
import { Object_ } from "./Object";
import { value2number } from "@xml/parse-xml";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#GuiObject_.28Global_params.29
export class GuiObject extends Object_ {
  static GUID = "4ee3e1994becc636bc78cd97b028869c";

  setup() {
    this.env = useEnv();
  }
  get att() {
    return this.props.node.attributes;
  }
  setXmlParam(param: string, value: string) {
    if (value2number.includes(param)) {
      //@ts-ignore
      value = Number(value);
    }
    this.att[param] = value;
  }
  getXmlParam(param: string): string {
    return String(this.att[param]);
  }

  getId(): string {
    return this.att.id || "";
  }

  style(){
    let {x,y, alpha, visible } = this.att;
    let style = `top:${y}px; left:${x}px; color:fuchsia;`;
    if(alpha!=null && alpha < 255) style += `opacity:${alpha / 255};`
    if(visible!=null && !visible) style += `display:none;`
    return style
  }
  /**
   * Trigger the show event.
   */
  show() {
    this.att.visible = true;
  }

  /**
   * Trigger the hide event.
   */
  hide() {
    this.att.visible = false;
  }
  isVisible(): boolean {
    return this.att.visible;
  }

  /** getter setter */
  get visible(): boolean {
    return this.att.visible;
  }
  set visible(showing: boolean) {
    this.att.visible = showing
  }


  /**
   * Set the alphablending value of the object.
   * Value ranges from 0 (fully transparent) to
   * 255 (fully opaque).
   *
   * @param  alpha   The alpha value.
   */
  setAlpha(alpha: number) {
    this.att.alpha = alpha;
    // this._renderAlpha();
  }

  /**
   * Get the current alphablending value of
   * the object. Value ranges from 0 (fully
   * transparent) to 255 (fully opaque).
   *
   * @ret The alpha value.
   */
  getAlpha(): number {
    const alpha = this.att.alpha
    return alpha!==null ? alpha : 255;
  }
}
