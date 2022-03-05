// import Text from "./Text";
import GuiObj from "./GuiObj";

export default class WasabiTitle extends GuiObj {
  static GUID = "7DFD324437514e7cBF4082AE5F3ADC33";


  getElTag():string{
    return 'text';
  }
  
  constructor(){
    super()
    // this._text = ':componentname'
  }
  
}
