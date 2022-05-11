import Layout from "../makiClasses/Layout";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class View extends Layout {
  _clippingColor: string;

  getElTag(): string {
    return "layout";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "clippingcolor":
        this._clippingColor = value;
        break;
      default:
        return false;
    }
    return true;
  }
}
