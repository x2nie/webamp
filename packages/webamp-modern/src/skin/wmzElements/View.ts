import UI_ROOT, { UIRoot } from "../../UIRoot";
import { num } from "../../utils";
import Container from "../makiClasses/Container";
import Group from "../makiClasses/Group";
import GuiObj from "../makiClasses/GuiObj";
import Layout from "../makiClasses/Layout";
import Theme from "./Theme";
import { runInlineScript } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/view-element
export default class View extends Container {
  _clippingColor: string;
  _scriptFile: string;
  _onLoad: string;
  _timerInterval: number;
  _onTimer:string;

  getElTag(): string {
    return "container";
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
      case "onload":
        this._onLoad = value;
        break;
      case "timerinterval":
        this._timerInterval = num(value);
        break;
      case "ontimer":
        this._onTimer = value;
        break;
      default:
        return false;
    }
    return true;
  }

  init() {
    super.init();

    
    if(this._onTimer && this._timerInterval){
      setTimeout(() => {
        console.log('Blendshutter!?',this._onTimer)
        runInlineScript(this._onTimer)
      }, this._timerInterval);
    }

  }

  prepareScriptGlobalObjects() {
    const theme = UI_ROOT.findContainer("theme") as Theme;
    window["theme"] = theme;
    window["mediacenter"] = theme.mediaCenter;
    window["view"] = this;

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

    const layout = this.getCurLayout()
    recursiveSetGlobal(layout);
  }

  draw() {
    super.draw();

    //register self
    if (this.getOriginalId() != null) {
      window[this.getOriginalId()] = this;
      // console.log('set global:', element.getOriginalId())
    }

    if (this._scriptFile) {
      this.prepareScriptGlobalObjects();
      //? temporary disabling due incomplete methods
      if (this._onLoad) {
        setTimeout(() => {
          runInlineScript(this._onLoad);
        }, 1000);
      }
    }

  }
}
