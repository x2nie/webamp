// import Text from "./Text";
import UI_ROOT from "../../UIRoot";
import Group from "./Group";

export default class WasabiTitle extends Group {
  static GUID = "7DFD324437514e7cBF4082AE5F3ADC33";


  getElTag():string{
    return 'group';
  }
  
  constructor(){
    super()
    // this._text = ':componentname'
  }

  init() {
    super.init()
    UI_ROOT.vm.dispatch(this, "onresize", [
      { type: "INT", value: 0 },
      { type: "INT", value: 0 },
      { type: "INT", value: this.getwidth() },
      { type: "INT", value: this.getheight() },
    ]);
  }
  
}
