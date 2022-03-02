import XmlObj from "../XmlObj";

export default class ConfigAttribute  {
  //?    GUID = "24DEC283B76E4a368CCC9E24C46B6C73";
  static GUID = "24dec2834a36b76e249ecc8c736c6bc4";
  _name : string;
  _default: string;
  _value: string;

//   constructor(name:string, defaultValue: string) {
  constructor() {
    // super();
    // this._name = name;
    // this._default = defaultValue;
    this._value = ''
  }
  getdata():string{
      return this._value || this._default;
  }
  setdata(value:string){
      this._value = value;
  }
}
