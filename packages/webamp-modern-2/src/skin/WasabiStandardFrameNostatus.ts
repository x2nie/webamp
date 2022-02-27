import GuiObj from "./makiClasses/GuiObj";
import { XmlElement } from "@rgrove/parse-xml";
import UI_ROOT from "../UIRoot";
import { removeAllChildNodes, toBool } from "../utils";

export default class WasabiStandardFrameNostatus extends GuiObj {
  // _select: HTMLSelectElement = document.createElement("select");
  _content: XmlElement | null = null;
  // _nocolheader: boolean = false;

  constructor() {
    super();
    // this._div.appendChild(this._select);
    this._width = 300;
    this._height = 300;
  }
  setXmlAttr(key: string, value: string): boolean {
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    const _key = key.toLowerCase();
    switch (_key) {
      // see skin: D-Reliction
      case "content":
        this._content = UI_ROOT.getGroupDef(value);
        break;
      // case "nohscroll":
      //   this._nohscroll = toBool(value);
      //   break;
      default:
        return false;
    }
    return true;
  }

 

  // handleAction(
  //   action: string,
  //   param: string | null,
  //   actionTarget: string | null
  // ) {
  //   switch (action) {
  //     case "colorthemes_switch":
  //       const selected = this._select.value;
  //       if (selected != null) {
  //         UI_ROOT.enableGammaSet(selected);
  //       //   this._renderBoldSelection()
  //       }
  //       return true;
  //   }
  //   return false;
  // }
  _draw_content(){
    if(this._content){
      // this._content.draw();
      // this._div.appendChild(this._content.getDiv());
      this._div.appendChild(this._content);
      // this.center();
    } else {
      removeAllChildNodes(this._div);
    }
  }

  draw() {
    super.draw();
    this._div.setAttribute("data-obj-name", "wasabi:standardframe:nostatusZ");
    // this._renderGammaSets();
  }
}
