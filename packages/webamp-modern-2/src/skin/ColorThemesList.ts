// import GuiObj from "./makiClasses/GuiObj";
import Group from "./makiClasses/Group";
import UI_ROOT from "../UIRoot";
import { removeAllChildNodes, toBool } from "../utils";

export default class ColorThemesList extends Group {
  _select: HTMLSelectElement = document.createElement("select");
  _nohscroll: boolean = false;
  _nocolheader: boolean = false;

  constructor() {
    super();
    this._div.appendChild(this._select);
    this._select.addEventListener('dblclick', ()=>{
      const selected = this._select.value;
        if (selected != null) {
          UI_ROOT.enableGammaSet(selected);
          this._renderBoldSelection()
        }
    })
  }
  setXmlAttr(key: string, value: string): boolean {
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    const _key = key.toLowerCase();
    switch (_key) {
      // see skin: D-Reliction
      case "nocolheader":
        this._nocolheader = toBool(value);
        break;
      case "nohscroll":
        this._nohscroll = toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  _renderGammaSets() {
    removeAllChildNodes(this._select);
    this._div.style.border = "1px solid black";
    this._div.style.boxSizing = "content-box";
    this._select.setAttribute("multiple", "1");
    this._select.style.position = "absolute";
    this._select.style.width = "100%";
    this._select.style.height = "100%";
    this._select.style.color = "gold";
    this._select.style.border = "none";
    this._select.style.backgroundColor = "transparent";
    //error on wacup: this._select.style.backgroundImage = UI_ROOT.getBitmap('studio.list.background')._getBackgrondImageCSSAttribute();
    this._select.style.pointerEvents = "auto";

    // Overflow
    this._select.style.overflowY = "scroll";
    if(this._nohscroll){
      this._select.style.overflowX = "hidden";
    } else {
      this._select.style.overflowX = "scroll";
    }

    for (const key of UI_ROOT._gammaSets.keys()) {
      const option = document.createElement("option");
      option.value = key;
      option.innerText = UI_ROOT._gammaNames[key];
      this._select.appendChild(option);
    }
    this._select.value = UI_ROOT._activeGammaSetName;

    // window.UI_ROOT = UI_ROOT;
    // console.log('_activeGammaSet',UI_ROOT._gammaSets, UI_ROOT._activeGammaSet , UI_ROOT._gammaSets.keys()[0])

    if(this._nocolheader){
      // this._select.style.paddingTop = "0";
      this._select.style.setProperty('--colheader', null)
      // this._select.style.setProperty('--colheadertop', null)
    } else {
      // this._select.style.paddingTop = "12px";
      this._select.style.setProperty('--colheader', "'Theme'")
      // this._select.style.setProperty('--colheadertop', "-12px")
      // firstOption.style.paddingTop = '1em';
    }
    this._renderBoldSelection()
  }

  _renderBoldSelection() {
    Array.from(this._select.options).forEach(function(option_element) {
      if(option_element.value === UI_ROOT._activeGammaSetName){
        option_element.setAttribute('selected', 'selected');
      } else {
        option_element.removeAttribute('selected')
      }
    });
  }

  handleAction(
    action: string,
    param: string | null,
    actionTarget: string | null
  ) {
    switch (action) {
      case "colorthemes_switch":
        const selected = this._select.value;
        if (selected != null) {
          UI_ROOT.enableGammaSet(selected);
          this._renderBoldSelection()
        }
        return true;
    }
    return false;
  }

  draw() {
    super.draw();
    this._div.setAttribute("data-obj-name", "ColorThemes:List");
    this._renderGammaSets();
  }
}
