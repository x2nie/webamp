import UI_ROOT from "../../UIRoot";
import { toBool } from "../../utils";
import { Edges } from "../Clippath";
import GuiObj from "../makiClasses/GuiObj";
import ButtonGroup from "./ButtonGroup";
import { runOnClickScript } from "./util";

// https://docs.microsoft.com/en-us/windows/win32/wmp/buttonelement-element
export default class ButtonElement extends GuiObj {
  _mappingColor: string;
  _action: string = null;
  _onClick: string = null;
  _down: boolean = false;
  _sticky: boolean = false;

  constructor() {
    super();
    // TODO: Cleanup!
    // this._div.addEventListener("mousedown", this._handleMouseDown.bind(this));
    this._div.addEventListener("click", (e: MouseEvent) => {
      if (this._onClick != null) {
        this.onClick();
      }
    });
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }

    switch (key) {
      case "mappingcolor":
        this._mappingColor = value;
        //temporary:
        // this._div.style.backgroundColor = value;
        break;
      case "action":
        this.setAction(value);
        break;
      case "onclick":
        this._onClick = value;
        break;
      case "sticky":
        this._sticky = toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  get down(): boolean {
    return this._down;
  }
  set down(value: boolean) {
    console.log(this.getId(),'down=', value)
    this._down = value;
    this._renderDown();
  }

  setAction(action: string) {
    this._action = action;
    if (action) {
      this._div.addEventListener("click", (e: MouseEvent) => {
        if (e.button == 0) {
          //   this.leftclick();
          this.dispatchAction(this._action, null, null);
        }
      });
    }
  }

  onClick() {
    // if (this._action) {
    //   this.dispatchAction(this._action, this._param, this._actionTarget);
    //   this.invalidateActionState();
    // }
    // this.onLeftClick();
    runOnClickScript(this._onClick);
    if(this._sticky){
      this.down = true
    }
  }

  _renderDown() {
    if (this._down) {
      this._div.classList.add("down");
    } else {
      this._div.classList.remove("down");
    }
  }

  _renderRegion() {
    if (this._mappingColor && this._parent instanceof ButtonGroup) {
      const canvas = UI_ROOT.getBitmap(this._parent._mappingImage).getCanvas();
      const edge = new Edges();
      edge.parseCanvasTransparencyByNonColor(canvas, this._mappingColor);
      if (edge.isSimpleRect()) {
        // this.setXmlAttr("sysregion", "0");
      } else {
        this._div.style.clipPath = edge.getPolygon();
      }
    }
  }

  draw() {
    super.draw();
    this._renderRegion();
  }
}
