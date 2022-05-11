import Group from "../makiClasses/Group";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttongroup-element
export default class ButtonGroup extends Group {
  _mappingImage: string;
  _hoverImage: string;

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "mappingimage":
        this._mappingImage = value;
        break;
      case "hoverimage":
        this._hoverImage = value;
        break;
      default:
        return false;
    }
    return true;
  }
}
