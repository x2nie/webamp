import GuiObj from "../makiClasses/GuiObj";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttonelement-element
export default class ButtonElement extends GuiObj {
  _mappingColor: string;

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "mappingcolor":
        this._mappingColor = value;
        //temporary:
        this._div.style.backgroundColor = value;
        break;
      default:
        return false;
    }
    return true;
  }
}
