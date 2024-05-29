import { UIRoot } from "../../UIRoot";
import {
  assert,
  num,
  toBool,
  px,
  assume,
  relative,
  findLast,
  unimplemented,
} from "../../utils";
import Bitmap from "../Bitmap";
import Group from "./Group";
import XmlObj from "../XmlObj";
import Layout from "./Layout";
import Region from "./Region";
import ConfigAttribute from "./ConfigAttribute";
import { XmlElement } from "@rgrove/parse-xml";
import {
  Component,
  markup,
  onMounted,
  onPatched,
  onRendered,
  onWillPatch,
  onWillRender,
  onWillStart,
  onWillUpdateProps,
  useEffect,
  useRef,
  xml,
} from "@odoo/owl";
import { uiRegistry, xmlRegistry } from "@lib/registry";

let BRING_LEAST: number = -1;
let BRING_MOST_TOP: number = 1;

export class UI extends Component {
  static template = "ui";
  gui: { el: HTMLElement };
  // static template0 = xml`
  // <t t-tag="props.node.tag" t-att-id="props.node.getId()" t-att-class="getCssClass()" t-att-style="style()">
  //  <Children children="props.node.children" />
  // </t>`;
  // static components = { Children };

  setup() {
    this.props.node.el = this;
    this.gui = useRef("gui"); // the html element in DOM
    // const bound = () => {
    //   if (this.gui.el) {
    //     const r = this.gui.el.getBoundingClientRect();
    //     const { width } = r;
    //     return JSON.stringify({ width });
    //   } else {
    //     return "no-dom";
    //   }
    // };
    // onWillStart(() => console.log(`${bound()}:willStart`));
    // onMounted(() => console.log(`${bound()}:mounted`));
    // onWillUpdateProps(() => console.log(`${bound()}:willUpdateProps`));
    // onWillRender(() => console.log(`${bound()}:willRender`));
    // onRendered(() => console.log(`${bound()}:rendered`));
    // onWillPatch(() => console.log(`${bound()}:willPatch`));
    // onPatched(() => console.log(`${bound()}:patched`));
    
    onWillStart(() => {
      this.att.scalex = this.att.relatw? 100 : 1;
      this.att.scaley = this.att.relath? 100 : 1;
    });
    // onMounted(() => this.detectRealSize());
    // useEffect(
    //   (el) => {
    //     if (el) {
    //       console.log('guiEL mounted!:', this.att.id)
    //       this.detectRealSize();
    //     }
    //   },
    //   // () => [this.gui.el, this.att.w, this.att.h]
    //   () => [this.gui.el]
    // );
  }
  get att() {
    return this.props.node.attributes;
  }
  detectRealSize() {
    if(this.att.image=='wasabi.frame.top'){
      debugger
    }
    if ((this.att.background || this.att.image) && (this.att.relatw || this.att.relath) && this.gui.el) {
      console.log('guiWH mounted!')
      // const r = this.gui.el.getBoundingClientRect();
      const el = this.gui.el;
      this.att.bound = { width: el.offsetWidth, height: el.offsetHeight };
      this.render(true)
    }
  }
  nodeChildren() {
    const notFound = this.props.node.children
      .filter((e) => !uiRegistry.contains(e.tag))
      .map((e) => e.tag);
    if (notFound.length) {
      console.warn("TAG NOT FOUND:::", [...new Set(notFound)].join(", "));
    }
    return this.props.node.children.filter((e) => uiRegistry.contains(e.tag));
  }

  lookupTag(tag: string): typeof Component {
    // console.log('finding component for tag:', tag)
    try {
      //ts-ignore
      return uiRegistry.get(tag, Nothing) || Nothing;
    } catch {
      console.log("failed to get component:", tag);
      return Nothing;
    }
  }

  getCssClass() {
    return this.props.node ? this.props.node.tag : "unknown-tag";
  }
  style() {
    let { x, y, w, h, alpha, visible, relatx, relaty, relatw, relath } =
      this.att;
    let style = ""; //`top:${y}px; left:${x}px; color:fuchsia;`;
    if (x != null) style += `left:${relative(x, relatx)};`;
    if (y != null) style += `top:${relative(y, relaty)};`;
    // if (w != null) style += relatw ? `right:${w * -1}px;` : `width:${w}px;`;
    // if (h != null) style += relath ? `bottom:${h * -1}px` : `height:${h}px;`;
    if (w != null) style += `width:${relative(w, relatw)};`;
    if (h != null) style += `height:${relative(h, relath)};`;
    if (alpha != null && alpha < 255) style += `opacity:${alpha / 255};`;
    // if (visible != null && !visible) style += `display:none;`;
    if (this.att.background) style += this.bgStyle(this.att.background);
    if (this.att.image) style += this.bgStyle(this.att.image);
    return style;
  }
  bgStyle(bitmap_id: any): string {
    if(bitmap_id=='wasabi.frame.top'){
      // debugger
    }
    let style = "";
    // let scalex = 1,
    //   scaley = 1;
    const bitmap = this.env.ui.bitmaps[bitmap_id];
    if(!bitmap) {
      console.log('failed to find bitmap.id:', bitmap_id, 'for node:', this.props.node.id)
      return style
    }  
    const url = bitmap.attributes.url;
    style += `background:url(${url});`;
    if (this.att.w == null || this.att.h == null) {
      // if (bitmap.attributes.w == null || bitmap.attributes.h == null) {
      //   this.att.w = bitmap.attributes.width;
      //   this.att.h = bitmap.attributes.height;
      //   // const img = new Image();
      //   // img.addEventListener("load", () => {
      //   //   this.att.w = bitmap.attributes.w = img.width;
      //   //   this.att.h = bitmap.attributes.h = img.height;
      //   // });
      //   // img.addEventListener("error", () => {
      //   //   console.warn(`cant load empty image: ${this.att.image}. ::`, url);
      //   // });
      //   // // img.src = `url(${url})`
      //   // img.src = url;
      // } else {
        if (this.att.w == null)
          this.att.w = bitmap.attributes.w || bitmap.attributes.width;
        if (this.att.h == null)
          this.att.h = bitmap.attributes.h || bitmap.attributes.height;
      // }

      // if (bitmap.attributes.w) style += `width:${bitmap.attributes.w}px;`;
      // if (bitmap.attributes.h) style += `height:${bitmap.attributes.h}px;`;
    }

    // if (
    //   (this.att.relatw || this.att.relath) &&
    //   (!bitmap.attributes.width || !bitmap.attributes.height)
    // ) {
    //   // const img = new Image();
    //   // img.addEventListener("load", () => {
    //   //   bitmap.attributes.width = img.width;
    //   //   bitmap.attributes.height = img.height;
    //   // });
    //   // img.addEventListener("error", () => {
    //   //   // console.warn(`cant load empty image: ${this.att.image}. ::`, url);
    //   // });
    //   // // img.src = `url(${url})`
    //   // img.src = url;
    // }

    // if((this.att.relatw || this.att.relath) && this.gui.el){
    //   const b = this.gui.el
    //   scalex = b.offsetWidth / bitmap.attributes.w;
    //   scaley = b.offsetHeight / bitmap.attributes.h;
    //   debugger
    // }

    /*const b = this.att.bound;
    if (b && bitmap.attributes.width) {
      scalex = b.width / bitmap.attributes.w;
      scaley = b.height / bitmap.attributes.h;
    }*/
    const {scalex, scaley} = this.att
    if (scalex != 1 || scaley != 1) {
      // debugger
      style += `background-size:${bitmap.attributes.width * scalex}px ${
        bitmap.attributes.height * scaley
      }px;`;
      // style += `--scale-xy:${scalex} ${scaley};`;
    }
    if (bitmap.attributes.x)
      style += `background-position-x:${-bitmap.attributes.x * scalex}px;`;
    if (bitmap.attributes.y)
      style += `background-position-y:${-bitmap.attributes.y * scaley}px;`;
    return style;
  }
}

// http://wiki.winamp.com/wiki/XML_GUI_Objects#GuiObject_.28Global_params.29
export default class GuiObj extends XmlObj {
  static GUID = "4ee3e1994becc636bc78cd97b028869c";
  _uiRoot: UIRoot;
  _parent: Group;
  _children: GuiObj[] = [];
  // _id: string; moved to BaseObject
  _originalId: string; // non lowercase'd
  _name: string;
  _w: number = 0;
  _h: number = 0;
  _x: number = 0;
  _y: number = 0;
  _minimumHeight: number = 0;
  _maximumHeight: number = 0;
  _minimumWidth: number = 0;
  _maximumWidth: number = 0;
  _relatx: string;
  _relaty: string;
  _relatw: string = "0";
  _relath: string = "0";
  _autowidthsource: string;
  _droptarget: string;
  _visible: boolean = true;
  _alpha: number = 255;
  _ghost: boolean = false;
  _sysregion: number = 0;
  _tooltip: string = "";
  _targetX: number | null = null;
  _targetY: number | null = null;
  _targetWidth: number | null = null;
  _targetHeight: number | null = null;
  _targetAlpha: number | null = null;
  _targetSpeed: number | null = null;
  _goingToTarget: boolean = false;
  _div: HTMLElement;
  _backgroundBitmap: Bitmap | null = null;
  _configAttrib: ConfigAttribute;

  _metaCommands: XmlElement[] = [];

  // constructor(uiRoot: UIRoot) {
  //   super();
  //   this._uiRoot = uiRoot;

  //   this._div = document.createElement(
  //     this.getElTag().toLowerCase().replace("_", "")
  //   );
  // }

  getElTag(): string {
    return this.constructor.name;
  }

  setParent(group: Group) {
    this._parent = group;
  }

  setXmlAttr0(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    switch (key) {
      case "id":
        this._originalId = value;
        this._id = value.toLowerCase();
        break;
      case "name":
        this._name = value;
        break;

      case "autowidthsource":
        this._autowidthsource = value.toLowerCase();
        break;
      case "fitparent":
        this._relatw = "1";
        this._relath = "1";
        this._renderWidth();
        this._renderHeight();
        break;
      case "w":
      case "default_w":
        this._w = num(value);
        this._renderWidth();
        break;
      case "h":
      case "default_h":
        this._h = num(value);
        this._renderHeight();
        break;
      case "x":
      case "default_x":
        this._x = num(value) ?? 0;
        this._renderX();
        break;
      case "y":
      case "default_y":
        this._y = num(value) ?? 0;
        this._renderY();
        break;
      case "minimum_h":
        this._minimumHeight = num(value);
        break;
      case "minimum_w":
        this._minimumWidth = num(value);
        break;
      case "maximum_h":
        this._maximumHeight = num(value);
        break;
      case "maximum_w":
        this._maximumWidth = num(value);
        break;
      case "relatw":
        this._relatw = value;
        this._renderWidth();
        break;
      case "relath":
        this._relath = value;
        this._renderHeight();
        break;
      case "relatx":
        this._relatx = value;
        this._renderX();
        break;
      case "relaty":
        this._relaty = value;
        this._renderY();
        break;
      case "droptarget":
        this._droptarget = value;
        break;
      case "dblclickaction":
        const [action, param, actionTarget] = value.split(";");
        this._div.addEventListener("dblclick", (e) => {
          this.dispatchAction(action, param, actionTarget);
        });
        break;
      case "ghost":
        this._ghost = toBool(value);
        break;
      case "visible":
        this._visible = toBool(value);
        this._renderVisibility();
        break;
      case "activealpha":
      case "inactivealpha":
        this._div.setAttribute(key, value); // set directly to html attribute
        break;

      case "tooltip":
        this._tooltip = value;
        break;
      // (int) An integer [0,255] specifying the alpha blend mode of the object (0 is transparent, 255 is opaque). Default is 255.
      case "alpha":
        this.setalpha(num(value));
      case "sysregion":
        this._sysregion = num(value);
        break;
      case "cfgattrib":
        this._setConfigAttrib(value);
        break;
      default:
        return false;
    }
    return true;
  }

  setxmlparam0(key: string, value: string) {
    this.setXmlAttr(key, value);
  }

  _setConfigAttrib(cfgattrib: string) {
    const [guid, attrib] = cfgattrib.split(";");
    const configItem = this._uiRoot.CONFIG.getitem(guid);
    //TODO: check if old exist: dispose.
    this._configAttrib = configItem.getattribute(attrib);
    //TODO: dispose it
    this._configAttrib.on("datachanged", this.__cfgAttribChanged.bind(this));
  }

  /**
   * a callback that will be triggered when cfgattrib just being changed.
   * Inteded for disposable of .on() & .off()
   */
  __cfgAttribChanged = () => {
    // this function is called when other object make change to cfgattrib
    const newValue = this._configAttrib.getdata();
    this._cfgAttribChanged(newValue);
  };

  _cfgAttribChanged(newValue: string) {
    // inheritor shall
    // do something when configAttrib broadcast message `datachanged` by other object
  }

  updateCfgAttib(newValue: string) {
    if (this._configAttrib != null) {
      this._configAttrib.setdata(newValue);
    }
  }

  setSize(newWidth: number, newHeight: number) {}

  initialize() {
    //process <sendparams> and <hideobject>
    for (const node of this._metaCommands) {
      const cmd = node.name.toLowerCase();
      const el = node.attributes.group
        ? this.findObject(node.attributes.group)
        : this;
      const targets_ids = node.attributes.target.split(";");
      for (const target_id of targets_ids) {
        // individual target
        const gui = el.findobjectF(
          target_id,
          `<${cmd}(${target_id})=notfound. @${this.getId()}`
        );
        if (gui == null) {
          continue;
        }
        if (cmd == "sendparams") {
          for (let attribute in node.attributes) {
            if (gui && attribute != "target") {
              gui.setXmlParam(attribute, node.attributes[attribute]);
            }
          }
        } else if (cmd == "hideobject" && target_id != "close") {
          gui.hide();
        }
      }
    }

    if (this._configAttrib) {
      this._cfgAttribChanged(this._configAttrib.getdata());
    }

    this._div.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      // e.preventDefault();
      console.log("mouse-down!");
      this.onLeftButtonDown(
        e.offsetX + this.getLeft(),
        e.offsetY + this.gettop()
      );

      const mouseUpHandler = (e: MouseEvent) => {
        // e.stopPropagation();
        // e.preventDefault();
        console.log("mouse-up!");
        this.onLeftButtonUp(
          e.offsetX + this.getLeft(),
          e.offsetY + this.gettop()
        );
        this._div.removeEventListener("mouseup", mouseUpHandler);
      };
      this._div.addEventListener("mouseup", mouseUpHandler);
    });
    this._div.addEventListener("mouseenter", (e) => {
      this.onEnterArea();
    });

    this._div.addEventListener("mouseleave", (e) => {
      this.onLeaveArea();
    });
  }

  dispose() {}

  getDiv(): HTMLElement {
    return this._div;
  }

  // getId(): string {
  //   return this._id || "";
  // }
  getOriginalId(): string {
    return this._originalId;
  }

  /**
   * Trigger the show event.
   */
  show() {
    this._visible = true;
    this._renderVisibility();
    this.onsetvisible(true);
  }

  /**
   * Trigger the hide event.
   */
  hide() {
    this._visible = false;
    this._renderVisibility();
    this.onsetvisible(true);
  }
  isvisible(): boolean {
    return this._visible;
  }

  /** getter setter */
  get visible(): boolean {
    return this._visible;
  }
  set visible(showing: boolean) {
    if (showing) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Get the Y position, in the screen, of the
   * top edge of the object.
   *
   * @ret The top edge's position (in screen coordinates).
   */
  gettop(): number {
    return this._y;
  }

  /**
   * Get the X position, in the screen, of the
   * left edge of the object.
   *
   * @ret The left edge's position (in screen coordinates).
   */
  getLeft(): number {
    return this.attributes.x;
  }

  /**
   * Get the height of the object, in pixels.
   *
   * @ret The height of the object.
   */
  getheight(): number {
    if (this._h || this._minimumHeight || this._maximumHeight) {
      let h = Math.max(this._h || 0, this._minimumHeight);
      h = Math.min(h, this._maximumHeight || h);
      return h;
    }
    return this._h;
  }
  get height(): number {
    return this.getheight();
  }
  set height(value: number) {
    this._h = value;
    this._renderDimensions();
  }

  /**
   * Get the width of the object, in pixels.
   *
   * @ret The width of the object.
   */
  getWidth(): number {
    if(this.el && this.el.gui.el){
      return (this.el.gui.el as unknown as HTMLElement).offsetWidth
    }
    return 111;
    if (this._w || this._minimumWidth || this._maximumWidth) {
      let w = Math.max(this._w || 0, this._minimumWidth);
      if (this._maximumHeight) {
        w = Math.min(w, this._maximumWidth || w);
      }
      return w;
    }
    return this._w;
  }
  get width(): number {
    return this.getWidth();
  }
  set width(value: number) {
    this._w = value;
    this._renderDimensions();
  }

  /**
   * Resize the object to the desired size and position.
   *
   * @param  x   The X position where to anchor the object before resize.
   * @param  y   The Y position where to anchor the object before resize.
   * @param  w   The width you wish the object to have.
   * @param  h   The height you wish the object to have.
   */
  resize(x: number, y: number, w: number, h: number) {
    this._x = x;
    this._y = y;
    this._w = w;
    this._h = h;
    this._renderDimensions();
  }

  getxmlparam(param: string): string {
    param = param.toLowerCase();
    const _ = this["_" + param];
    return _ != null ? _.toString() : null;
  }
  getguiw(): number {
    return this._w;
  }
  getguih(): number {
    return this._h;
  }
  getguix(): number {
    return this._x;
  }
  getguiy(): number {
    return this._y;
  }
  getguirelatw(): number {
    return this._relatw == "1" ? 1 : 0;
  }
  getguirelath(): number {
    return this._relath == "1" ? 1 : 0;
  }
  getguirelatx(): number {
    return this._relatx == "1" ? 1 : 0;
  }
  getguirelaty(): number {
    return this._relaty == "1" ? 1 : 0;
  }
  getAutoWidth(): number {
    return 78
    const child = !this._autowidthsource
      ? this
      : findLast(
          this._children,
          (c) => c._id.toLowerCase() == this._autowidthsource
        );
    if (child) {
      return child._div.getBoundingClientRect().width;
    }
    return 1;
  }
  getautoheight(): number {
    return this._div.getBoundingClientRect().height;
  }

  findObject(id: string): GuiObj {
    if (id.toLowerCase() == this.getId().toLowerCase()) return this;

    //? Phase 1: find in this children
    let ret = this._findObject(id);

    //? Phase 2: find sibling
    if(!ret && this.parent){
      ret = this.parent._findObject(id);
    }
    //? Phase 3: find in this layout's children
    if (!ret /* && this._parent  */) {
      const layout = this.getparentlayout();
      if (layout) {
        ret = layout._findObject(id);
      }
    }
    if (!ret && id != "sysmenu") {
      console.warn(`findObject(${id}) failed, @${this.getId()}`);
    }
    // console.log(`findObject(${id}) = ${ret ? ret.id : ret}`);
    return ret as GuiObj;
  }

  /* internal findObject with custom error msg */
  findobjectF(id: string, msg: string): GuiObj {
    const ret = this._findObject(id);
    // temporary stop complaining missing obj, reduce polution of Devtool's Cnsole
    const warnMissingObject = false;
    if (warnMissingObject && !ret && id != "sysmenu") {
      console.warn(msg);
    }
    return ret as GuiObj;
  }

  // _findobject(id: string): GuiObj {
  //   // too complex to consol.log here
  //   const lower = id.toLowerCase();
  //   // find in direct children first
  //   for (const obj of this.children) {
  //     if ((obj.id || "").toLowerCase() === lower) {
  //       return obj as GuiObj;
  //     }
  //   }
  //   // find in grand child
  //   for (const obj of this.children) {
  //     const found = obj._findobject(id);
  //     if (found != null) {
  //       return found;
  //     }
  //   }
  //   return null;
  // }

  isActive(): boolean {
    return this._div.matches(":focus");
  }

  setregion(reg: Region) {
    //TODO:
  }

  ismouseoverrect(): boolean {
    return unimplemented(true); //TODO:
  }
  onresize(x: number, y: number, w: number, h: number) {
    this._uiRoot.vm.dispatch(this, "onresize", [
      { type: "INT", value: x },
      { type: "INT", value: y },
      { type: "INT", value: this.getwidth() },
      { type: "INT", value: this.getheight() },
    ]);
  }
  /**
   * Hookable. Event happens when the left mouse
   * button was previously down and is now up.
   *
   * @param  x   The X position in the screen where the cursor was when the event was triggered.
   * @param  y   The Y position in the screen where the cursor was when the event was triggered.
   */
  onLeftButtonUp(x: number, y: number) {
    this._uiRoot.vm.dispatch(this, "onleftbuttonup", [
      { type: "INT", value: x },
      { type: "INT", value: y },
    ]);
  }

  /**
   * Hookable. Event happens when the left mouse button
   * is pressed.
   *
   * @param  x   The X position in the screen where the cursor was when the event was triggered.
   * @param  y   The Y position in the screen where the cursor was when the event was triggered.
   */
  onLeftButtonDown(x: number, y: number) {
    assert(
      x >= this.getLeft(),
      "Expected click to be to the right of the component's left." +
        ` x:${x} left:${this.getLeft()}`
    );
    assert(
      y >= this.gettop(),
      "Expected click to be below the component's top." +
        ` y:${y} top:${this.gettop()}`
    );
    this.getparentlayout().bringtofront();
    this._uiRoot.vm.dispatch(this, "onleftbuttondown", [
      { type: "INT", value: x },
      { type: "INT", value: y },
    ]);
  }

  /**
   * Hookable. Event happens when the right mouse button
   * was previously down and is now up.
   *
   * @param  x   The X position in the screen where the cursor was when the event was triggered.
   * @param  y   The Y position in the screen where the cursor was when the event was triggered.
   */
  onRightButtonUp(x: number, y: number) {
    this._uiRoot.vm.dispatch(this, "onrightbuttonup", [
      { type: "INT", value: x },
      { type: "INT", value: y },
    ]);
  }

  /**
   * Hookable. Event happens when the right mouse button
   * is pressed.
   *
   * @param  x   The X position in the screen where the cursor was when the event was triggered.
   * @param  y   The Y position in the screen where the cursor was when the event was triggered.
   */
  onRightButtonDown(x: number, y: number) {
    this._uiRoot.vm.dispatch(this, "onrightbuttondown", [
      { type: "INT", value: x },
      { type: "INT", value: y },
    ]);
  }

  /**
   * Hookable. Event happens when the mouse
   * enters the objects area.
   */
  onEnterArea() {
    this._uiRoot.vm.dispatch(this, "onenterarea");
  }

  /**
   * Hookable. Event happens when the mouse
   * leaves the objects area.
   */
  onLeaveArea() {
    this._uiRoot.vm.dispatch(this, "onleavearea");
  }

  /**
   * Set a target X position, in the screen, for
   * the object.
   *
   * @param  x   The target X position of the object.
   */
  settargetx(x: number) {
    this._targetX = x;
  }

  /**
   * Set a target Y position, in the screen, for
   * the object.
   *
   * @param  y   The target Y position of the object.
   */
  settargety(y: number) {
    this._targetY = y;
  }

  /**
   * Set a target width, in pixels, for the object.
   *
   * @param  w   The target width of the object.
   */
  settargetw(w: number) {
    this._targetWidth = w;
  }

  /**
   * Set a target height, in pixels, for the object.
   *
   * @param  h   The target height of the object.
   */
  settargeth(h: number) {
    this._targetHeight = h;
  }

  /**
   * Set a target alphablending value for the object.
   * The value range is from 0 (totally transparent)
   * to 255 (totally opaque).
   *
   * @param  alpha   The target alpha value.
   */
  settargeta(alpha: number) {
    this._targetAlpha = alpha;
  }

  /**
   * The amount of time in which you wish to arrive at
   * the target(s) previously set, in seconds.
   *
   * @param  insecond    The number of seconds in which to reach the target.
   */
  settargetspeed(insecond: number) {
    this._targetSpeed = insecond;
  }

  /**
   * Begin transition to previously set target.
   */
  gototarget() {
    this._goingToTarget = true;
    const duration = this._targetSpeed * 1000;
    const startTime = performance.now();

    const pairs = [
      ["_x", "_targetX", "_renderX"],
      ["_y", "_targetY", "_renderY"],
      ["_w", "_targetWidth", "_renderWidth"],
      ["_h", "_targetHeight", "_renderHeight"],
      ["_alpha", "_targetAlpha", "_renderAlpha"],
    ];

    const changes: {
      [key: string]: {
        start: number;
        delta: number;
        renderKey: string;
        target: number;
        positive: boolean;
      };
    } = {};

    for (const [key, targetKey, renderKey] of pairs) {
      const target = this[targetKey];
      if (target != null) {
        const start = this[key];
        const positive = target > start;
        const delta = target - start;
        changes[key] = { start, delta, renderKey, target, positive };
      }
    }

    const clamp = (current, target, positive) => {
      if (positive) {
        return Math.min(current, target);
      } else {
        return Math.max(current, target);
      }
    };

    const update = (time: number) => {
      const timeDiff = time - startTime;
      const progress = timeDiff / duration;
      for (const [
        key,
        { start, delta, renderKey, target, positive },
      ] of Object.entries(changes)) {
        this[key] = clamp(start + delta * progress, target, positive);
        this[renderKey]();
      }
      if (timeDiff < duration && this._goingToTarget) {
        window.requestAnimationFrame(update);
      } else {
        this._goingToTarget = false;
        // TODO: Clear targets?
        this.ontargetreached();
      }
    };

    window.requestAnimationFrame(update);
  }

  /**
   * isGoingToTarget()
   */
  isgoingtotarget() {
    return this._goingToTarget;
  }

  /**
   * Experimental/unused
   */
  __gototargetWebAnimationApi() {
    const duration = this._targetSpeed * 1000;

    const start = {
      left: px(this._x ?? 0),
      top: px(this._y ?? 0),
      width: px(this._w),
      height: px(this._h),
      opacity: this._alpha / 255,
    };
    const end = {
      left: px(this._targetX ?? this._x ?? 0),
      top: px(this._targetY ?? this._y ?? 0),
      width: px(this._targetWidth ?? this._w),
      height: px(this._targetHeight ?? this._h),
      opacity: (this._targetAlpha ?? this._alpha) / 255,
    };

    const frames = [start, end];

    const animation = this._div.animate(frames, { duration });
    animation.addEventListener("finish", () => {
      this._x = this._targetX ?? this._x;
      this._y = this._targetY ?? this._y;
      this._w = this._targetWidth ?? this._w;
      this._h = this._targetHeight ?? this._h;
      this._alpha = this._targetAlpha ?? this._alpha;
      this._renderDimensions();
      this._renderAlpha();
      this._uiRoot.vm.dispatch(this, "ontargetreached");
    });
  }
  /**
   * Hookable. Event happens when the object has reached
   * it's previously set target.
   */
  ontargetreached() {
    this._uiRoot.vm.dispatch(this, "ontargetreached");
  }

  canceltarget() {
    this._goingToTarget = true;
  }

  // [WHERE IS THIS?]

  // modifies the x/y targets so that they compensate for gained width/height. useful to make drawers that open up without jittering
  reversetarget(reverse: number) {
    assume(false, "Unimplemented: reverseTarget");
  }

  onsetvisible(onoff: boolean) {
    this._uiRoot.vm.dispatch(this, "onsetvisible", [
      { type: "BOOLEAN", value: onoff ? 1 : 0 },
    ]);
  }
  onstartup() {
    this._uiRoot.vm.dispatch(this, "onstartup");
  }

  /**
   * Set the alphablending value of the object.
   * Value ranges from 0 (fully transparent) to
   * 255 (fully opaque).
   *
   * @param  alpha   The alpha value.
   */
  setalpha(alpha: number) {
    this._alpha = alpha;
    this._renderAlpha();
  }

  /**
   * Get the current alphablending value of
   * the object. Value ranges from 0 (fully
   * transparent) to 255 (fully opaque).
   *
   * @ret The alpha value.
   */
  getalpha(): number {
    return this._alpha;
  }

  /**
   * https://stackoverflow.com/questions/52604914/converting-screen-coordinates-to-page-coordinates
   * Given the screen coordinates of a point, is there some way to calculate the coordinates of that point on the actual page of the browser?
   */

  clientToScreenX(x: number): number {
    return x;
    const element = this.getDiv();
    const position = element.getBoundingClientRect();
    return window.screenX + position.left + x;
  }

  clienttoscreeny(y: number): number {
    const element = this.getDiv();
    const position = element.getBoundingClientRect();
    return window.screenX + position.top + y;
  }
  clienttoscreenw(w: number): number {
    return unimplemented(this.clienttoscreenx(w));
  }
  clienttoscreenh(h: number): number {
    return unimplemented(this.clienttoscreeny(h));
  }

  screenToClientX(x: number): number {
    return x;
    const element = this.getDiv();
    const position = element.getBoundingClientRect();
    return x - (window.screenX + position.left);
  }

  screentoclienty(y: number): number {
    const element = this.getDiv();
    const position = element.getBoundingClientRect();
    return y - (window.screenX + position.top);
  }
  screentoclientw(w: number): number {
    return unimplemented(this.screentoclienty(w));
  }
  screentoclienth(h: number): number {
    return unimplemented(this.screentoclienty(h));
  }

  getparent(): Group {
    return this._parent;
  }

  getparentlayout(): Layout {
    if (this._parent) {
      return this._parent.getparentlayout();
    }
  }

  bringtofront() {
    BRING_MOST_TOP += 1;
    this._div.style.zIndex = String(BRING_MOST_TOP);
  }

  bringtoback() {
    BRING_LEAST -= 1;
    this._div.style.zIndex = String(BRING_LEAST);
  }

  setenabled(onoff: boolean | number) {
    //TODO:
  }

  handleAction(
    action: string,
    param: string | null = null,
    actionTarget: string | null = null,
    source: GuiObj = null
  ): boolean {
    // ancestor may override this function.
    return false;
  }

  // Sends an action up the UI heirarchy
  dispatchAction(
    action: string,
    param: string | null,
    actionTarget: string | null
  ) {
    const handled = this.handleAction(action, param, actionTarget);
    if (!handled && this._parent != null) {
      this._parent.dispatchAction(action, param, actionTarget);
    }
  }

  sendaction(
    action: string,
    param: string,
    x: number,
    y: number,
    p1: number,
    p2: number
  ): number {
    return this._uiRoot.vm.dispatch(this, "onaction", [
      { type: "STRING", value: action },
      { type: "STRING", value: param },
      { type: "INT", value: x },
      { type: "INT", value: y },
      { type: "INT", value: p1 },
      { type: "INT", value: p2 },
      { type: "OBJECT", value: this },
    ]);
  }

  _renderAlpha() {
    if (this._alpha != 255) {
      this._div.style.opacity = `${this._alpha / 255}`;
    } else {
      this._div.style.removeProperty("opacity");
    }
  }
  _renderVisibility() {
    if (!this._visible) {
      this._div.style.display = "none";
    } else {
      this._div.style.removeProperty("display");
    }
  }
  _renderTransate() {
    this._div.style.transform = `translate(${px(this._x ?? 0)}, ${px(
      this._y ?? 0
    )})`;
  }
  _renderX() {
    this._div.style.left =
      this._relatx == "1" ? relative(this._x ?? 0) : px(this._x ?? 0);
  }

  _renderY() {
    this._div.style.top =
      this._relaty == "1" ? relative(this._y ?? 0) : px(this._y ?? 0);
  }

  _renderWidth() {
    this._div.style.width =
      this._relatw == "1" ? relative(this._w ?? 0) : px(this.getwidth());
  }

  _renderHeight() {
    this._div.style.height =
      this._relath == "1" ? relative(this._h ?? 0) : px(this.getheight());
  }

  _renderDimensions() {
    this._renderX();
    this._renderY();
    this._renderWidth();
    this._renderHeight();
  }

  _renderLocation() {
    this._renderX();
    this._renderY();
  }
  _renderSize() {
    this._renderWidth();
    this._renderHeight();
  }

  doResize() {
    this._uiRoot.vm.dispatch(this, "onresize", [
      { type: "INT", value: 0 },
      { type: "INT", value: 0 },
      { type: "INT", value: this.getwidth() },
      { type: "INT", value: this.getheight() },
    ]);
  }

  setBackgroundImage(bitmap: Bitmap | null) {
    this._backgroundBitmap = bitmap;
    if (bitmap != null) {
      bitmap.setAsBackground(this._div);
    } else {
      this._div.style.setProperty(`--background-image`, "none");
    }
  }

  // JS Can't set the :active pseudo selector. Instead we have a hard-coded
  // pseduo-selector in our stylesheet which references a CSS variable and then
  // we control the value of that variable from JS.
  setDownBackgroundImage(bitmap: Bitmap | null) {
    if (bitmap != null) {
      bitmap.setAsDownBackground(this._div);
    }
  }

  setHoverBackgroundImage(bitmap: Bitmap | null) {
    if (bitmap != null) {
      bitmap.setAsHoverBackground(this._div);
    }
  }

  setActiveBackgroundImage(bitmap: Bitmap | null) {
    if (bitmap != null) {
      bitmap.setAsActiveBackground(this._div);
    }
  }
  setInactiveBackgroundImage(bitmap: Bitmap | null) {
    if (bitmap != null) {
      bitmap.setAsInactiveBackground(this._div);
    }
  }

  setDisabledBackgroundImage(bitmap: Bitmap | null) {
    if (bitmap != null) {
      bitmap.setAsDisabledBackground(this._div);
    }
  }

  draw() {
    this.getId() && this._div.setAttribute("id", this.getId());
    this._renderVisibility();
    this._renderAlpha();
    if (this._tooltip) {
      this._div.setAttribute("title", this._tooltip);
    }
    if (this._ghost || this._sysregion == -2) {
      this._div.style.pointerEvents = "none";
    } else {
      this._div.style.pointerEvents = "auto";
    }
    this._renderDimensions();
  }
}
xmlRegistry.add('xml', GuiObj)
export class Nothing extends Component {
  static template = xml`<t t-out="commented()" />`;

  commented() {
    return markup(`<!-- @ -->`);
    return markup(`<!-- @${this.props.node.tag} -->`);
    return markup(
      `<!-- @${this.props.node.tag}:${this.props.node.attributes.id} -->`
    );
  }
}
