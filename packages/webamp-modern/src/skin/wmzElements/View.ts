import UI_ROOT from "../../UIRoot";
import Group from "../makiClasses/Group";
import GuiObj from "../makiClasses/GuiObj";
import Layout from "../makiClasses/Layout";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class View extends Layout {
  _clippingColor: string;
  _scriptFile: string;

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
      case "scriptfile":
        this._scriptFile = value;
        UI_ROOT.addJsScript(value);
        break;
      default:
        return false;
    }
    return true;
  }

  init() {
    super.init();
    if (this._scriptFile) {
      this.prepareScriptGlobalObjects();
    }
  }

  prepareScriptGlobalObjects() {
    const recursiveSetGlobal = (element: GuiObj) => {
      if (element.getOriginalId() != null) {
        window[element.getOriginalId()] = element;
        // console.log('set global:', element.getOriginalId())
      }
      if (element instanceof Group) {
        for (const child of element._children) {
          recursiveSetGlobal(child);
        }
      }
    };

    recursiveSetGlobal(this);
  }
}
