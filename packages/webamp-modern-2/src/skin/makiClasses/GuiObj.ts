import UI_ROOT from "../../UIRoot";
import { assert, findLast, num, toBool, px, assume, relat } from "../../utils";
import Bitmap from "../Bitmap";
import Group from "./Group";
import XmlObj from "../XmlObj";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#GuiObject_.28Global_params.29
export default class GuiObj extends XmlObj {
  static GUID = "4ee3e1994becc636bc78cd97b028869c";
  _parent: Group | GuiObj;
  _children: GuiObj[] = [];
  _className: string = 'webamp--img';
  _id: string;
  _name: string;
  _width: number = 0;
  _height: number = 0;
  _x: number = 0;
  _y: number = 0;
  _minimumHeight: number = 0;
  _maximumHeight: number = 0;
  _minimumWidth: number = 0;
  _maximumWidth: number = 0;

  _relatx: boolean = false;
  _relaty: boolean = false;
  _relatw: boolean = false;
  _relath: boolean = false;
  _autowidthsource: string;

  _droptarget: string;
  _visible: boolean = true;
  _alpha: number = 255;
  _sysregion: number = 0;
  _ghost: boolean = false;
  _tooltip: string = "";
  _targetX: number | null = null;
  _targetY: number | null = null;
  _targetWidth: number | null = null;
  _targetHeight: number | null = null;
  _targetAlpha: number | null = null;
  _targetSpeed: number | null = null;
  _goingToTarget: boolean = false;
  _div: HTMLElement;// = document.createElement("div");
  _backgroundBitmap: Bitmap | null = null;
  
  constructor() {
    super();
    // this._div = document.createElement(this.constructor.name.toLowerCase().replace('_',''));//may recreate later in init
    this._div = document.createElement(this.getElTag().toLowerCase().replace('_',''));
  }

  getElTag():string{
    return this.constructor.name;
  }

  setParent(group: Group) {
    this._parent = group;
  }

  getParent(): GuiObj {
    return this._parent;
  }

  addChild(child: GuiObj) {
    child.setParent(this as unknown as Group);
    this._children.push(child);
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    switch (key) {
      case "id":
        this._id = value.toLowerCase();
        break;
      case "name":
        this._name = value;
        break;
  
      case "autowidthsource":
        this._autowidthsource = value.toLowerCase();
        break;
      case "w":
      case "default_w":
        this._width = num(value);
        this._renderWidth();
        break;
      case "h":
      case "default_h":
        this._height = num(value);
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
        this._relatw = toBool(value);
        break;
      case "relath":
        this._relath = toBool(value);
        break;
      case "relatx":
        this._relatx = toBool(value);
        break;
      case "relaty":
        this._relaty = toBool(value);
        break;
  
      case "droptarget":
        this._droptarget = value;
        break;
      case "sysregion":
        this._sysregion = num(value);
        break;
      case "ghost":
        this._ghost = toBool(value);
        break;
      case "visible":
        this._visible = toBool(value);
        this._renderVisibility();
        break;
      case "tooltip":
        this._tooltip = value;
        break;
      // (int) An integer [0,255] specifying the alpha blend mode of the object (0 is transparent, 255 is opaque). Default is 255.
      case "alpha":
        this._alpha = num(value);
      default:
        return false;
    }
    return true;
  }

  setxmlparam(key: string, value: string) {
    this.setXmlAttr(key, value);
  }
  // setxmlparam(key: string, value: any) {
  //   this.setXmlAttr(key, value.toString());
  // }


  init() {
    this._div.addEventListener("mousedown", (e) => {
      /*
      if (this._backgroundBitmap != null) {
        const { clientX, clientY } = e;
        const { x, y } = this._div.getBoundingClientRect();
        const canvasX = clientX - x;
        const canvasY = clientY - y;
        const canvas = this._backgroundBitmap.getCanvas();
        const ctx = canvas.getContext("2d");

        const opacity = ctx.getImageData(canvasX, canvasY, 1, 1).data[3];
        if (opacity === 0) {
          this._div.style.pointerEvents = "none";
          const newTarget = document.elementFromPoint(clientX, clientY);
          this._div.style.pointerEvents = "auto";
          var newEvent = new MouseEvent("click", {
            clientX,
            clientY,
            bubbles: true,
          });
          newTarget.dispatchEvent(newEvent);
          return;
        }
      }
     */
      this.onLeftButtonDown(e.clientX, e.clientY);

      const mouseUpHandler = (e) => {
        this.onLeftButtonUp(e.clientX, e.clientY);
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

  getDiv(): HTMLElement {
    return this._div;
  }

  getId(): string {
    return this._id;
  }

  getTopParent(): GuiObj {
    let obj: GuiObj = this;
    while (obj._parent) {
      obj = obj._parent
    }
    return obj;
  }

  /**
   * Trigger the show event.
   */
  show() {
    console.log('show()', this?'obj':'null', this._name, this.getId())
    this._visible = true;
    this._renderVisibility();
  }
  
  /**
   * Trigger the hide event.
   */
  hide() {
    console.log('hide()', this?'obj':'null', this._name, this.getId())
    this._visible = false;
    this._renderVisibility();
  }
  isvisible(): boolean {
    return this._visible;
  }

  /**
   * Get the Y position, in the screen, of the
   * top edge of the object.
   *
   * @ret The top edge's position (in screen coordinates).
   */
  gettop(): number {
    return this._div.getBoundingClientRect().y;
  }

  /**
   * Get the X position, in the screen, of the
   * left edge of the object.
   *
   * @ret The left edge's position (in screen coordinates).
   */
  getleft(): number {
    return this._div.getBoundingClientRect().x;
  }

  /**
   * Get the height of the object, in pixels.
   *
   * @ret The height of the object.
   */
  getheight(): number {
    /*
    assert(
      this._height != null,
      `Expected GUIObj to have a height in ${this.getId()}.`
    );
    */
    if (this._height || this._minimumHeight || this._maximumHeight) {
      // return Math.min( Math.max(this._height || this._minimumHeight), this._maximumHeight);
      let h = Math.max(this._height || this._minimumHeight);
      h = Math.min(h, this._maximumHeight || h);
      return h
    }
  }

  /**
   * Get the width of the object, in pixels.
   *
   * @ret The width of the object.
   */
  getwidth(): number {
    /*
    assert(
      this._width != null,
      `Expected GUIObj to have a width in ${this.getId()}.`
    );
    */
    if (this._width || this._minimumWidth || this._maximumWidth) {
      // return Math.min( Math.max(this._width, this._minimumWidth), this._maximumWidth);
      let w = Math.max(this._width, this._minimumWidth);
      if(this._maximumHeight){
        w = Math.min(w, this._maximumWidth || w);
      }
      return w
    }

    return this._width ?? 0;
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
    this._width = w;
    this._height = h;
    this._renderDimensions();
  }

  getxmlparam(param:string): string { 
    const _ = this['_'+param];
    return _ != null ? _.toString() : null;
  }
  getguiw(): number { return this._width; }
  getguih(): number { return this._height; }
  getguix(): number { return this._x; }
  getguiy(): number { return this._y; }
  getguirelatw(): number { return this._relatw ? 1 : 0; }
  getguirelath(): number { return this._relath ? 1 : 0; }
  getguirelatx(): number { return this._relatx ? 1 : 0; }
  getguirelaty(): number { return this._relaty ? 1 : 0; }
  getautowidth(): number { 
    const child = findLast(
      this._children,
      (c) => c._id.toLowerCase() == this._autowidthsource
    );
    if(child){
      return child._div.getBoundingClientRect().width; 
      // return child._width;
    }
    return 1;
  }
  getautoheight(): number { return this._div.getBoundingClientRect().height; }


  findobject(id: string): GuiObj {
    const ret = this._findobject(id);
    if(!ret){
      // console.log(`findObject at ${this.getId()} failed:`, id)

    }
    return ret;
  }

  _findobject(id: string): GuiObj { // too complex to consol.log here
    const lower = id.toLowerCase();
    // find in direct children first
    for (const obj of this._children) {
      if ((obj.getId() || '').toLowerCase() === lower) {
        return obj;
      }
    }
    // find in grand child 
    for (const obj of this._children) {
      const found = obj.findobject(id);
      if (found != null) {
        return found;
      }
    }
    return null;
  }


  isActive(): boolean {
    return this._div.matches(':focus')
  }
  /**
   * Hookable. Event happens when the left mouse
   * button was previously down and is now up.
   *
   * @param  x   The X position in the screen where the cursor was when the event was triggered.
   * @param  y   The Y position in the screen where the cursor was when the event was triggered.
   */
  onLeftButtonUp(x: number, y: number) {
    UI_ROOT.vm.dispatch(this, "onleftbuttonup", [
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
      x >= this.getleft(),
      "Expected click to be to the right of the component's left"
    );
    assert(
      y >= this.gettop(),
      "Expected click to be below the component's top"
    );
    UI_ROOT.vm.dispatch(this, "onleftbuttondown", [
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
    UI_ROOT.vm.dispatch(this, "onrightbuttonup", [
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
    UI_ROOT.vm.dispatch(this, "onrightbuttondown", [
      { type: "INT", value: x },
      { type: "INT", value: y },
    ]);
  }

  /**
   * Hookable. Event happens when the mouse
   * enters the objects area.
   */
  onEnterArea() {
    UI_ROOT.vm.dispatch(this, "onenterarea");
  }

  /**
   * Hookable. Event happens when the mouse
   * leaves the objects area.
   */
  onLeaveArea() {
    UI_ROOT.vm.dispatch(this, "onleavearea");
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
      ["_width", "_targetWidth", "_renderWidth"],
      ["_height", "_targetHeight", "_renderHeight"],
      ["_alpha", "_targetAlpha", "_renderAlpha"],
    ];

    const changes: {
      [key: string]: { start: number; delta: number; renderKey: string; target: number; positive: boolean };
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
      if(positive) {
        return Math.min(current, target);
      } else {
        return Math.max(current, target);
      }
    }

    const update = (time: number) => {
      const timeDiff = time - startTime;
      const progress = timeDiff / duration;
      for (const [key, { start, delta, renderKey, target, positive }] of Object.entries(
        changes
      )) {
        this[key] = clamp(start + delta * progress, target, positive);
        this[renderKey]();
      }
      if (timeDiff < duration) {
        window.requestAnimationFrame(update);
      } else {
        this._goingToTarget = false;
        // TODO: Clear targets?
        UI_ROOT.vm.dispatch(this, "ontargetreached");
      }
    };

    window.requestAnimationFrame(update);
  }

  /**
   * isGoingToTarget()
   */
   isgoingtotarget(){
    return this._goingToTarget;
  }

  /**
   * Experimental/unused
   */
  __gototargetWebAnimationApi() {
    const duration = this._targetSpeed * 1000;

    const start = {
      left: px(this._x ?? 0),
      content: "'by-goto-start'",
      top: px(this._y ?? 0),
      width: px(this._width),
      height: px(this._height),
      opacity: this._alpha / 255,
    };
    const end = {
      left: px(this._targetX ?? this._x ?? 0),
      content: "'by-goto-end'",
      top: px(this._targetY ?? this._y ?? 0),
      width: px(this._targetWidth ?? this._width),
      height: px(this._targetHeight ?? this._height),
      opacity: (this._targetAlpha ?? this._alpha) / 255,
    };

    const frames = [start, end];

    const animation = this._div.animate(frames, { duration });
    animation.addEventListener("finish", () => {
      this._x = this._targetX ?? this._x;
      this._y = this._targetY ?? this._y;
      this._width = this._targetWidth ?? this._width;
      this._height = this._targetHeight ?? this._height;
      this._alpha = this._targetAlpha ?? this._alpha;
      this._renderDimensions();
      this._renderAlpha();
      UI_ROOT.vm.dispatch(this, "ontargetreached");
    });
  }
  /**
   * Hookable. Event happens when the object has reached
   * it's previously set target.
   */
  ontargetreached() {
    assume(false, "Unimplemented");
  }

  canceltarget() {
    assume(false, "Unimplemented");
  }

  

  // [WHERE IS THIS?]

  // modifies the x/y targets so that they compensate for gained width/height. useful to make drawers that open up without jittering
  reversetarget(reverse: number) {
    assume(false, "Unimplemented");
  }

  onStartup() {
    assume(false, "Unimplemented");
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

  handleAction(
    action: string,
    param: string | null,
    actionTarget: string | null
  ): boolean {
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

  _renderAlpha() {
    this._div.style.opacity = `${this._alpha / 255}`;
  }
  _renderVisibility() {
    this._div.style.display = this._visible ? "inline-block" : "none";
    // if(this._visible)
    //   this._div.style.removeProperty("display");
    // else
    //   this._div.style.display = "none";
  }
  _renderTransate() {
    this._div.style.transform = `translate(${px(this._x ?? 0)}, ${px(
      this._y ?? 0
    )})`;
  }
  _renderX() {
    // if(this._x==0 && !this._relatx)return;
    if(this._relatx) {
      this._div.style.left = relat(this._x ?? 0);
    } else {
      this._div.style.left = px(this._x ?? 0);
    }
  }
  _renderY() {
    // if(this._y==0 && !this._relaty)return;
    if(this._relaty) {
      this._div.style.top = relat(this._y ?? 0);
    } else {
      this._div.style.top = px(this._y ?? 0);
    }
  }
  _renderWidth() {
    if(this._autowidthsource) return;
    this._div.style.width = this._relatw ? relat(this._width??0) : px(this.getwidth());
  }
  _renderHeight() {
    this._div.style.height = this._relath ? relat(this._height??0) : px(this.getheight());
  }

  _renderDimensions() {
    //MMD:plEdit-normal.xml 
    // <layer id="pl.switcher" x="35" y="0" relatw="1" w="-87" h="30" rectrgn="1" />
    // <layer id="pl.buttonbg" x="-50" relatx="1" y="2" image="pl.button.bg" />
    this._renderX();
    this._renderY();
    this._renderWidth();
    this._renderHeight();
  }

  setBackgroundImage(bitmap: Bitmap | null) {
    this._backgroundBitmap = bitmap;
    if (bitmap != null) {
      bitmap.setAsBackground(this._div);
    } else {
      this._div.style.setProperty(`--background-image`, "none");
      // this._div.style.setProperty(`--background-position`, "none");
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

  draw() {
    // this._div.setAttribute("data-id", this.getId());
    this._div.setAttribute("id", this.getId());
    // this._div.setAttribute("data-obj-name", "GuiObj");
    // this._div.setAttribute("tabindex", "0");
    this._renderVisibility();
    // this._div.style.position = "absolute";
    this._renderAlpha();
    if (this._tooltip) {
      this._div.setAttribute("title", this._tooltip);
    }
    if (this._ghost) {
      this._div.style.pointerEvents = "none";
      // this._div.style.opacity = "0";
    } else {
      this._div.style.pointerEvents = "auto";
    }
    this._renderDimensions();

  }
}
