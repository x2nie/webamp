import Group from "./makiClasses/Group";
import { XmlElement } from "@rgrove/parse-xml";
import UI_ROOT from "../UIRoot";
import { removeAllChildNodes, toBool } from "../utils";

export default class WasabiStandardFrameNostatus extends Group {
  ___node: XmlElement; // holder for xml attributes, for later xuiInit
  __inited: boolean = false;

  constructor(node:XmlElement) {
    super();
    this.___node = node;
  }
  init() {
    if(this.__inited) return;
    this.__inited = true;
    
    super.init()
    UI_ROOT.vm.dispatch(this._systemObjects[0], "onsetxuiparam", [{type: "STRING", value:'content'}, {type:"STRING", value:'ctbigcontent'}]);

  }

  


  draw() {
    super.draw();
    this._div.setAttribute("data-obj-name", "wasabi:standardframe:nostatusZ");
  }
}
