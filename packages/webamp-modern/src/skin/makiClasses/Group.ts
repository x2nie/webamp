import * as Utils from "../../utils";
import GuiObj, { UI } from "./GuiObj";
import SystemObject from "./SystemObject";
import Movable from "./Movable";
import Layout from "./Layout";
import { uiRegistry, xmlRegistry } from "@lib/registry";
import { onMounted } from "@odoo/owl";
import { V } from "../../maki/v";

export class GroupUI extends UI {
  setup() {
    super.setup();
    onMounted(() => {
      // setTimeout(() => {
        // debugger
        if (this.gui.el&& this.gui.el.getBoundingClientRect) {
          const r = this.gui.el.getBoundingClientRect();
          const { x, y, width, height } = r;
          console.log('resizing:',x,y,width,height)
          this.node.emitter.trigger("onResize", [
            V.newInt(height),
            V.newInt(width),
            V.newInt(x),
            V.newInt(y),

            // V.newInt(x),
            // V.newInt(y),
            // V.newInt(width),
            // V.newInt(height),

          ]);
        }
      // }, 1000);
    });
  }
  // static template = xml`
  // <t t-tag="props.node.tag" t-att-id="props.node.getId()" t-att-class="getCssClass()" t-att-style="style()">
  //  <Children children="props.node.children" />
  // </t>`;
  // static components = {Children}

  // get att() {
  //   return this.props.node.attributes;
  // }

  // getCssClass(){
  //   return this.props.node? this.props.node.tag : 'unknown-tag'
  // }
  // style() {
  //   let style = super.style();
  //   if (this.att.background) {
  //     // const url = this.env.bitmaps[this.att.image].url
  //     const bitmap = this.env.ui.bitmaps[this.att.background];
  //     const url = bitmap.url;
  //     style += `background:url(${url});`;
  //     if(this.att.w==null || this.att.h==null){
  //       if(bitmap.attributes.w==null || bitmap.attributes.h==null){
  //         const img = new Image();
  //         img.addEventListener("load", () => {
  //           this.att.w = img.width
  //           this.att.h = img.height
  //         });
  //         img.addEventListener("error", () => {
  //           console.warn(`cant load empty image: ${this.att.image}. ::`, url);

  //         });
  //         // img.src = `url(${url})`
  //         img.src = url
  //       }

  //       if (bitmap.attributes.w) style += `width:${bitmap.attributes.w}px;`;
  //       if (bitmap.attributes.h) style += `height:${bitmap.attributes.h}px;`;
  //     }
  //     if (bitmap.attributes.x)
  //       style += `background-position-x:${bitmap.attributes.x}px;`;
  //     if (bitmap.attributes.y)
  //       style += `background-position-y:${bitmap.attributes.y}px;`;
  //   }
  //   // if (visible != null && !visible) style += `display:none;`;
  //   return style;
  // }
}

uiRegistry.add("group", GroupUI);

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Cgroup.2F.3E
export default class Group extends Movable {
  static GUID = "45be95e5419120725fbb5c93fd17f1f9";
  _inited: boolean = false;
  _parent: Group;
  _instanceId: string;
  _background: string;
  _desktopAlpha: boolean;
  _drawBackground: boolean = true;
  _isLayout: boolean = false;
  _systemObjects: SystemObject[] = [];
  _actualWidth: number; // for _invalidatesize, after draw
  _actualHeight: number;
  _regionCanvas: HTMLCanvasElement;
  _allowZeroSize: boolean = false; //WMP set width = 0; in their script. Winamp unset width => get bitmap width

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    switch (key) {
      case "instance_id":
        this._instanceId = value;
        break;
      case "background":
        this._background = value;
        this._renderBackground();
        break;
      case "drawbackground":
        this._drawBackground = Utils.toBool(value);
        this._renderBackground();
        break;
      case "allowzerosize":
        this._allowZeroSize = Utils.toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  sendXuiParam(param, value) {
    // debugger
    const scripts = this.children.filter(
      (c) => c.tag == "script"
    ) as SystemObject[];
    // console.log('redirecting XuiParam', param, '=', value, 'cripts:', scripts.length)
    scripts.forEach((s) =>
      s.dispatch(s, "onSetXuiParam", [
        { type: "STRING", value: value },
        { type: "STRING", value: param },
      ])
    );
  }
  // setXmlParam(key, value){
  //   console.log('receiving XmlParam:',key, '=', value)
  //   this.attributes[key] = value
  // }

  initialize() {
    if (this._inited) return;
    this._inited = true;

    super.initialize();

    for (const systemObject of this._systemObjects) {
      systemObject.initialize();
    }
    for (const child of this._children) {
      child.initialize();
    }
  }

  dispose() {
    for (const systemObject of this._systemObjects) {
      systemObject.dispose();
    }
    for (const child of this._children) {
      child.dispose();
    }
  }

  // getId() {
  //   return this._instanceId || this._id;
  // }

  addSystemObject(systemObj: SystemObject) {
    systemObj.setParentGroup(this);
    this._systemObjects.push(systemObj);
  }

  addChild(child: GuiObj) {
    child.setParent(this);
    this._children.push(child);
  }

  /* Required for Maki */
  getObject(objectId: string): GuiObj {
    return this._findObject(objectId) as GuiObj;
    const lower = objectId.toLowerCase();
    for (const obj of this._children) {
      if (obj.getId() === lower) {
        return obj;
      }
    }
    const foundIds = this._children.map((child) => child.getId()).join(", ");
    throw new Error(
      `Could not find an object with the id: "${objectId}" within object "${this.getId()}". Only found: ${foundIds}`
    );
  }

  enumobject(index: number): GuiObj {
    return this._children[index];
  }

  getnumobjects(): number {
    return this._children.length;
  }

  getParentLayout(): Layout {
    let obj: Group = this;
    while (obj) {
      if (obj.tag == "layout") {
        return obj as Layout;
      }
      obj = obj.parent;
    }
    if (!obj) {
      console.warn("getParentLayout", this.getId(), "failed!");
    }
    return obj as Layout;
  }

  islayout(): boolean {
    return this._isLayout;
  }

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    const h = super.getheight();
    if (h == 0 && this._allowZeroSize) {
      return h;
    }
    if (!h && this._background != null) {
      const bitmap = this._uiRoot.getBitmap(this._background);
      if (bitmap) return bitmap.getHeight();
    }
    return h ?? 0;
  }

  // This shadows `getwidth()` on GuiObj
  getWidth0(): number {
    if (this.el) {
      return (this.el as unknown as HTMLElement).offsetWidth;
    }
    return 76;
    if (this._autowidthsource) {
      const widthSource = this.findObject(this._autowidthsource);
      if (widthSource) {
        return widthSource.getautowidth();
      }
    }
    const w = super.getwidth();
    if (w == 0 && this._allowZeroSize) {
      return w;
    }
    if (!w && this._background != null) {
      const bitmap = this._uiRoot.getBitmap(this._background);
      if (bitmap) return bitmap.getWidth();
    }
    return w || this._div.getBoundingClientRect().width;
  }

  _renderBackground() {
    if (this._background != null && this._drawBackground) {
      const bitmap = this._uiRoot.getBitmap(this._background);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  async doResize() {
    this._uiRoot.vm.dispatch(this, "onresize", [
      { type: "INT", value: 0 },
      { type: "INT", value: 0 },
      { type: "INT", value: this.getwidth() },
      { type: "INT", value: this.getheight() },
    ]);
  }

  /**
   * it is needed because render region is expensive.
   * Hence, we recalculate regions only if needed */
  async _invalidateSize() {
    const actualBox = this._div.getBoundingClientRect();
    if (
      actualBox.width != this._actualWidth ||
      actualBox.height != this._actualHeight
    ) {
      this._actualWidth = actualBox.width;
      this._actualHeight = actualBox.height;
      this.doResize();
      this.applyRegions();
    }
    for (const child of this._children) {
      if (child instanceof Group) child._invalidateSize();
    }
  }

  // SYSREGION THINGS ==============================
  applyRegions() {
    this._regionCanvas = null;
    let hasRegions = false;
    for (const child of this._children) {
      if (child._sysregion == -1 || child._sysregion == -2) {
        this.putAsRegion(child);
        hasRegions = true;
      }
    }
    if (hasRegions) {
      this.setRegion();
    }
    this._regionCanvas = null;
  }

  putAsRegion(child: GuiObj) {
    if (
      this._regionCanvas == null ||
      this._regionCanvas.width == 0 ||
      this._regionCanvas.height == 0
    ) {
      const canvas = (this._regionCanvas = document.createElement("canvas"));
      const bound = this._div.getBoundingClientRect();
      canvas.width = bound.width;
      canvas.height = bound.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, bound.width, bound.height);
    }
    if (this._regionCanvas.width == 0 || this._regionCanvas.height == 0) {
      return;
    }

    const ctx2 = this._regionCanvas.getContext("2d");
    const r = child._div.getBoundingClientRect();
    const bitmap = child._backgroundBitmap;
    if (bitmap && bitmap.loaded()) {
      const img = bitmap.getImg();
      ctx2.drawImage(
        img,
        bitmap._x,
        bitmap._y,
        r.width,
        r.height,

        child._div.offsetLeft,
        child._div.offsetTop,
        r.width,
        r.height
      );
    }
  }

  setRegion() {
    if (this._regionCanvas.width == 0 || this._regionCanvas.height == 0) {
      return;
    }

    const ctx2 = this._regionCanvas.getContext("2d");

    const imageData = ctx2.getImageData(
      0,
      0,
      this._regionCanvas.width,
      this._regionCanvas.height
    );
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i + 3] = data[i + 0];
    }
    ctx2.putImageData(imageData, 0, 0);

    this._regionCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      this._div.style.setProperty("mask-image", `url(${url})`);
      this._div.style.setProperty("-webkit-mask-image", `url(${url})`);
    });
  }

  appendChildrenDiv() {
    // ComponentBucket may has different way to append children
    this._appendChildrenToDiv(this._div);
  }
  _appendChildrenToDiv(containerDiv: HTMLElement) {
    for (const child of this._children) {
      child.draw();
      containerDiv.appendChild(child.getDiv());
    }
  }

  draw() {
    super.draw();
    this._div.classList.add("webamp--img");
    // It seems Groups are not responsive to click events.
    if (this._movable || this._canResize) {
      this._div.style.pointerEvents = "auto";
    } else {
      this._div.style.pointerEvents = "none";
    }
    //TODO: allow move/resize if has ._image
    this._div.style.pointerEvents = "none";
    this._renderBackground();
    this.appendChildrenDiv();
    if (this._autowidthsource) {
      this._div.classList.add("autowidthsource");
    }
  }
}

xmlRegistry.add("group", Group);
