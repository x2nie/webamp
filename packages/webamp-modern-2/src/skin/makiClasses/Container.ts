import UI_ROOT from "../../UIRoot";
import { assert, px, removeAllChildNodes, num, toBool } from "../../utils";
import Layout from "./Layout";
import XmlObj from "../XmlObj";

// > A container is a top level object and it basically represents a window.
// > Nothing holds a container. It is an object that holds multiple related
// > layouts. Each layout represents an appearance for that window. You can design
// > different layouts for each window but only one can be visible at a time.
//
// -- http://wiki.winamp.com/wiki/Modern_Skin:_Container
export default class Container extends XmlObj {
  static GUID = "e90dc47b4ae7840d0b042cb0fcf775d2";
  _layouts: Layout[] = [];
  _activeLayout: Layout | null = null;
  _visible: boolean = true;
  _id: string;
  _name: string;
  _x: number = 0;
  _y: number = 0;
  _div: HTMLElement = document.createElement("container");
  constructor() {
    super();
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    switch (key) {
      case "name":
        this._name = value;
        break;
      case "id":
        this._id = value.toLowerCase();
        break;
      case "default_visible":
        this._visible = toBool(value);
        break;
      case "x":
      case "default_x":
        this._x = num(value) ?? 0;
        this._renderDimensions();
        break;
      case "y":
      case "default_y":
        this._y = num(value) ?? 0;
        this._renderDimensions();
        break;
    
      default:
        return false;
    }
    return true;
  }

  init() {
    for (const layout of this._layouts) {
      layout.init();
    }
  }

  getId() {
    return this._id;
  }

  getDiv(): HTMLElement {
    return this._div;
  }

  getWidth(): number {
    return this._activeLayout.getwidth();
  }
  getHeight(): number {
    return this._activeLayout.getheight();
  }
  show() {
    if(!this._activeLayout){
      this.switchToLayout(this._layouts[0]._id);
    }
    this._visible = true;
    this._renderLayout()
  }
  hide() {
    this._visible = false;
    this._renderLayout()
  }
  toggle(){
    if(!this._visible) this.show()
    else this.hide()
  }
  close(){
    this._activeLayout = null;
    this.hide()
  }
  center() {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    this._div.style.top = px((height - this.getHeight()) / 2);
    this._div.style.left = px((width - this.getWidth()) / 2);
  }

  /* Required for Maki */
  /**
   * Get the layout associated with the an id.
   * This corresponds to the "id=..." attribute in
   * the XML tag <layout .. />.
   *
   *  @ret             The layout associated with the id.
   * @param  layout_id   The id of the layout you wish to retrieve.
   */
  getlayout(layoutId: string): Layout {
    const lower = layoutId.toLowerCase();
    for (const layout of this._layouts) {
      if (layout.getId() === lower) {
        return layout;
      }
    }
    throw new Error(`Could not find a container with the id; "${layoutId}"`);
  }

  /** 
  * @ret Layout
  */
  getCurLayout(): Layout {
    return this._activeLayout;
  }



  addLayout(layout: Layout) {
    layout.setParentContainer(this);
    this._layouts.push(layout);
    if (this._activeLayout == null || layout.getId() == 'normal') {
      this._activeLayout = layout;
    }
  }

  // parser need it.
  addChild(layout: Layout) {
    this.addLayout(layout)
  }

  _clearCurrentLayout() {
    removeAllChildNodes(this._div);
  }

  switchToLayout(layout_id: string) {
  // switchToLayout(id: string) {
    const newlayout = this.getlayout(layout_id);
    assert(newlayout != null, `Could not find layout with id "${layout_id}".`);
    // UI_ROOT.vm.dispatch(this, "onswitchtolayout", [
    //   { type: "OBJECT", value: this._activeLayout },
    //   { type: "OBJECT", value: layout },
    // ]);
    this._clearCurrentLayout();
    this._activeLayout = newlayout;
    this._renderLayout();
    UI_ROOT.vm.dispatch(this, "onswitchtolayout", [
      { type: "OBJECT", value: newlayout },
    ]);
  }
  dispatchAction(
    action: string,
    param: string | null,
    actionTarget: string | null
  ) {
    switch (action.toLowerCase()) {
      case "switch":
        this.switchToLayout(param);
        break;
      default:
        UI_ROOT.dispatch(action, param, actionTarget);
    }
  }

  _renderDimensions() {
    this._div.style.left = px(this._x ?? 0);
    this._div.style.top = px(this._y ?? 0);
  }

  _renderLayout() {
    if (this._visible && this._activeLayout) {
      this._activeLayout.draw();
      this._div.appendChild(this._activeLayout.getDiv());

      // this.center();
    } else {
      removeAllChildNodes(this._div);
    }
  }

  draw() {
    // this._div.setAttribute("data-xml-id", this.getId());
    this._div.setAttribute("id", this.getId());
    // this._div.setAttribute("data-obj-name", "Container");
    // this._div.style.position = "absolute";
    this._div.setAttribute("tabindex", "1");
    this._renderDimensions();
    this._renderLayout();
  }
}
