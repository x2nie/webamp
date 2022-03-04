import Group from "./makiClasses/Group";
import { XmlElement } from "@rgrove/parse-xml";
import UI_ROOT from "../UIRoot";
import { removeAllChildNodes, toBool } from "../utils";

export default class WasabiStandardFrameNostatus extends Group {
  ___node: XmlElement; // holder for xml attributes, for later xuiInit
  __inited: boolean = false;
  _content: string;

  getElTag():string{
    return 'wasabiframe';
  }

  constructor(node:XmlElement) {
    super();
    this.___node = node;
  }

  setXmlAttr(_key: string, value: string): boolean {
    const lowerkey = _key.toLowerCase();
    // console.log('wasabi:frame.key=',lowerkey,':=', value)
    if (super.setXmlAttr(lowerkey, value)) {
      return true;
    }
    switch (lowerkey) {
      case "content":
        this._content = value;
        break;
      default:
        return false;
    }
    return true;
  }

  init() {
    // console.error('wasabi:standard->> INITing:', this._content)
    if(this.__inited) return;
    this.__inited = true;
    
    super.init()
    // console.error('wasabi:standard->> sending onsetxuiparam:', this._content)
    UI_ROOT.vm.dispatch(this._systemObjects[0], "onsetxuiparam", [
      {type: "STRING", value:'content'}, 
      {type:"STRING", value:this._content}]);
  }

}
