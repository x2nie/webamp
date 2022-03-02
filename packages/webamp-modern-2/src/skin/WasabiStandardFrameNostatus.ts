import Group from "./makiClasses/Group";
import { XmlElement } from "@rgrove/parse-xml";
import UI_ROOT from "../UIRoot";
import { removeAllChildNodes, toBool } from "../utils";

export default class WasabiStandardFrameNostatus extends Group {
  // _select: HTMLSelectElement = document.createElement("select");
  // _content: XmlElement | null = null;
  // _nocolheader: boolean = false;
  ___node: XmlElement; // holder for xml attributes, for later xuiInit

  constructor(node:XmlElement) {
    super();
    this.___node = node;
    // this._div.appendChild(this._select);
  }
  init() {
    super.init()
    // for (const systemObject of this._systemObjects) {
    //   //   systemObject.init();
    //   for (const [key, avalue] of Object.entries(this.___node.attributes)) {
    //     // this.setXmlAttr(key, value);
    //     UI_ROOT.vm.dispatch(systemObject, "onsetxuiparam", [{type: "STRING", value:key}, {type:"STRING", value:avalue}]);
    //   }
    // }
  }

  

  // setXmlAttr(key: string, value: string): boolean {
  //   if (super.setXmlAttr(key, value)) {
  //     return true;
  //   }
  //   const _key = key.toLowerCase();
  //   switch (_key) {
  //     // see skin: D-Reliction
  //     case "content":
  //       this._content = UI_ROOT.getGroupDef(value);
  //       break;
  //     // case "nohscroll":
  //     //   this._nohscroll = toBool(value);
  //     //   break;
  //     default:
  //       return false;
  //   }
  //   return true;
  // }

 

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
  // _draw_content(){
  //   if(this._content){
  //     // this._content.draw();
  //     // this._div.appendChild(this._content.getDiv());
  //     this._div.appendChild(this._content);
  //     // this.center();
  //   } else {
  //     removeAllChildNodes(this._div);
  //   }
  // }

  draw() {
    // for (const systemObject of this._systemObjects) {
    //   //   systemObject.init();
    //   for (const [key, avalue] of Object.entries(this.___node.attributes)) {
    //     // this.setXmlAttr(key, value);
    //     UI_ROOT.vm.dispatch(systemObject, "onsetxuiparam", [{type: "STRING", value:key}, {type:"STRING", value:avalue}]);
    //   }
    // }
    super.draw();
    this._div.setAttribute("data-obj-name", "wasabi:standardframe:nostatusZ");
    UI_ROOT.vm.dispatch(this._systemObjects[0], "onsetxuiparam", [{type: "STRING", value:'content'}, {type:"STRING", value:'ctbigcontent'}]);
    // this._renderGammaSets();
  }
}
