import * as Utils from "../../utils";
import UI_ROOT from "../../UIRoot";
import GuiObj from "./GuiObj";
import SystemObject from "./SystemObject";
// import Layout from "./Layout";
// import Layout = require('./Layout');

const MOUSE_POS = { x: 0, y: 0 };

// TODO: Figure out how this could be unsubscribed eventually
document.addEventListener("mousemove", (e: MouseEvent) => {
  MOUSE_POS.x = e.clientX;
  MOUSE_POS.y = e.clientY;
});

let elementIncrement: number = 1;

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Cgroup.2F.3E
export default class Group extends GuiObj {
  static GUID = "45be95e5419120725fbb5c93fd17f1f9";
  _inited: boolean = false;
  _parent: Group;
  _instanceId: string;
  _background: string;
  _desktopAlpha: boolean;
  _drawBackground: boolean = true;
  _systemObjects: SystemObject[] = [];
  // _children: GuiObj[] = []; //moved to GuiObj
  _isLayout:boolean=false;
  _regionId: string; //svg.id
  _regionCanvas: HTMLCanvasElement;
  _regionImage: HTMLElement;
  _regionContainer: HTMLElement;
  
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
      default:
        return false;
    }
    return true;
  }

  // init(whatever:Group = null) {
  init() {
    if(this._inited) return;
    this._inited = true;
    
    super.init();

    // return;
    
    // if(arguments.length){
    //   return; //it is called by wasabi. dont bother.
    // }
    // for (const child of this._children) {
    //   child.init();
    // }
    for (const systemObject of this._systemObjects) {
      systemObject.init();
    }
    for (const child of this._children) {
      child.init();
    }

  }

  applyRegions() {

    let hasRegions = false;
    for (const child of this._children) {
      // child.draw();
      if(child._sysregion==-1||child._sysregion==-2){
        this.putAsRegion(child);
        hasRegions = true;
      }
      else if(child._sysregion==1){
        const bgUrl= child._div.style.getPropertyValue('--background-image');
        child._div.style.setProperty('mask-image', bgUrl);
        child._div.style.setProperty('-webkit-mask-image', bgUrl);
        // child._div.style.pointerEvents = 'none'; //TODO: don't! because some sysregion=1 == resize!=0
      }
    }
    if(hasRegions){
      this.setRegion()
    }
  }

  getId() {
    return this._instanceId || this._id;
  }

  addSystemObject(systemObj: SystemObject) {
    systemObj.setParentGroup(this);
    this._systemObjects.push(systemObj);
  }

  /* Required for Maki */
  getobject(objectId: string): GuiObj {
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

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    if (this._height || this._minimumHeight || this._maximumHeight) {
      // return Math.min( Math.max(this._height || this._minimumHeight), this._maximumHeight);
      let h = Math.max(this._height || this._minimumHeight);
      h = Math.min(h, this._maximumHeight || h);
      return h
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if(!bitmap){
        return 50;
      }
      return bitmap.getHeight();
    }
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if(this._autowidthsource){
      const widthSource = this.findobject(this._autowidthsource);
      if(widthSource){
        return widthSource.getautowidth()
      }
    }
    if (this._width || this._minimumWidth || this._maximumWidth) {
      // return Math.min( Math.max(this._width, this._minimumWidth), this._maximumWidth);
      let w = Math.max(this._width, this._minimumWidth);
      w = Math.min(w, this._maximumWidth || w);
      return w
    }
    if (this._background != null) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      if(bitmap)
        return bitmap.getWidth();
    }
    return super.getwidth();
  }

  _renderBackground() {
    if (this._background != null && this._drawBackground) {
      const bitmap = UI_ROOT.getBitmap(this._background);
      this.setBackgroundImage(bitmap);
    } else {
      this.setBackgroundImage(null);
    }
  }

  doResize() {
    super.doResize();
    this._regionCanvas=null;
    this.applyRegions();
    for (const child of this._children) {
      child.doResize()
    }
  }

  // _renderWidth() {
  //   if(this._autowidthsource) return;
  //   this._div.style.width = this._relatw=='1' ? relat(this._width??0) : px(this.getwidth());
  //   this._div.style.width = this._relatw? Utils.relat(this._width): Utils.px(this.getwidth());
  // }

  // _renderHeight() {
  //   this._div.style.height = this._relath=='1' ? relat(this._height??0) : px(this.getheight());
  //   this._div.style.height = this._relath? Utils.relat(this._height) : Utils.px(this.getheight());
  // }

  draw() {
    super.draw();
    // this._div.setAttribute("data-obj-name", "Group");
    if(this._className)
      this._div.classList.add(this._className);
    // It seems Groups are not responsive to click events.
    this._div.style.pointerEvents = "none";
    // this._div.style.overflow = "hidden";
    // this._div.style.height = Utils.px(this._maximumHeight);
    // this._div.style.width = Utils.px(this._maximumWidth);
    this._renderBackground();
    for (const child of this._children) {
      child.draw();
      // if(child._sysregion==-1){
      //   this.putAsRegion(child);
      // }
      // else {
        this._div.appendChild(child.getDiv());
      // }
    }
    if(this._autowidthsource){
      // this._div.style.removeProperty('width');
      this._div.classList.add('autowidthsource');
    }

  }

  getparentlayout(): Group{
    let obj: Group = this;
    // console.log('getParentLayout', this.getId(), this._parent)
    while (obj._parent) {
      // if(obj instanceof Layout) {
      if(obj._isLayout) {
        break
      }
      obj = obj._parent
    }
    if(!obj){
      console.log('>>getParentLayout', this.getId(), 'got:', obj)
    }
    return obj;
  }

  isLayout():boolean{
    return this._isLayout;
  }

  getmouseposx(): number {
    return MOUSE_POS.x - this.getparentlayout().getleft();
  }

  getmouseposy(): number {
    return MOUSE_POS.y - this.getparentlayout().gettop();
  }

  enumobject(index: number): GuiObj {
    return this._children[index]
  }

  getnumobjects(): number {
    return this._children.length;
  }

  // SYSREGION THINGS ==============================
  // addChild(child: GuiObj) {
  //   if(child._sysregion==-1){
  //     this.putAsRegion(child);
  //   }
  //   child.setParent(this as unknown as Group);
  //   this._children.push(child);
  // }

  putAsRegion(child: GuiObj){
    if(this._regionCanvas==null || this._regionCanvas.width==0 || this._regionCanvas.height==0){
      const canvas = this._regionCanvas = document.createElement("canvas");
      const bound = this._div.getBoundingClientRect();
      canvas.width  = bound.width;
      canvas.height = bound.height;
      // console.log('createRegionCanvas:', bound.width, bound.height)
      const ctx = canvas.getContext("2d");
      // const fs = ctx.fillStyle;
      ctx.fillStyle = 'white';
      // ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0,0, bound.width, bound.height)
      // ctx.fillStyle = 'transparent';
      // ctx.fillStyle = fs;
    }
    if(this._regionCanvas.width==0 || this._regionCanvas.height==0){
      return
    }
    
    if(child._sysregion==1) {  
      //just crop by transparency.
      const bitmap = child._backgroundBitmap;
      const ctxSrc = bitmap.getCanvas().getContext('2d');
      const dataSrc = ctxSrc.getImageData(0, 0, bitmap.getWidth(), bitmap.getHeight()).data;
      // const data = imageData.data;
      
      const ctx2 = this._regionCanvas.getContext("2d");
      const r = child._div.getBoundingClientRect();

      const imageData = ctx2.getImageData(r.left, r.top, bitmap.getWidth(), bitmap.getHeight());
      const dataDst = imageData.data;
      for (var i = 0; i < dataDst.length; i += 4) {
        // data[i + 3] = data[i + 1] != 255 ? 0 : data[i + 1];
        dataDst[i + 0] = dataSrc[i + 3]; //? draw transparency
      }
      ctx2.putImageData(imageData, r.left, r.top)
      
    } else {

      const ctx2 = this._regionCanvas.getContext("2d");
      const r = child._div.getBoundingClientRect();
      const bitmap = child._backgroundBitmap;
      const img = child._backgroundBitmap.getImg()
      ctx2.drawImage(
        img, 
        bitmap._x,
        bitmap._y,
        r.width, r.height,

        child._div.offsetLeft, 
        child._div.offsetTop, 
        // 0,0,
        r.width, r.height
        // bitmap._width, bitmap._height
        // 500, 500
        );
      // console.log('createDraw:',  child._div.offsetLeft - bitmap._x, 
      // child._div.offsetTop - bitmap._y, 
      // r.width, r.height,
      // r)
    }
  }

  setRegion(){
    if(this._regionCanvas.width==0 || this._regionCanvas.height==0){
      return
    }

    const ctx2 = this._regionCanvas.getContext("2d");

    const imageData = ctx2.getImageData(0, 0, this._regionCanvas.width, this._regionCanvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      // data[i + 3] = data[i + 1] != 255 ? 0 : data[i + 1];
      data[i + 3] = data[i + 0];
    }
    ctx2.putImageData(imageData, 0, 0);

    this._regionCanvas.toBlob(blob=>{
      const url = URL.createObjectURL(blob)
      this._div.style.setProperty('mask-image', `url(${url})`)
      this._div.style.setProperty('-webkit-mask-image', `url(${url})`);
      });

    // const url = this._regionCanvas.toDataURL();
    // this._div.style.setProperty('mask-image', `url(${url})`)
    // this._div.style.setProperty('-webkit-mask-image', `url(${url})`);
    // this._div.style.setProperty('--mask-image', `url(${url})`);
    // document.body.style.setProperty('background-image', `url(${url})`);
    // document.body.style.backgroundRepeat = 'no-repeat';
    // this._div.style.setProperty('mask-type', 'luminance')
    // this._div.style.setProperty('-webkit-mask-type', 'luminance')


  }
  putAsRegion0(child: GuiObj){
    if(this._regionImage==null){
      // const a : SVGAElement = new SVGAElement();
      elementIncrement++;
      this._regionId = `svgregion-${elementIncrement}`;
      
      const svg = this._regionImage = document.createElement('svg')
      // svg.setAttribute('id', this._regionId);
      svg.style.position = 'absolute';
      svg.style.width = '100%';
      svg.style.height = '100%';
      
      const defs = document.createElement('defs')
      svg.appendChild(defs)
      
      const mask = document.createElement('mask')
      mask.setAttribute('id', this._regionId);
      defs.appendChild(mask)

      mask.innerHTML = '<rect fill="#ffffff" x="0" y="0" width="500" height="500"></rect>'

      const fo = this._regionContainer = document.createElement('foreignObject')
      fo.innerHTML = '<div style="background:white;left:0;top:0; width:100%; height:100%;position:relative;"></div>';
      mask.appendChild(fo)

      this._div.appendChild(svg);
      this._div.style.setProperty('mask-type', 'luminance')
      this._div.style.setProperty('-webkit-mask-type', 'luminance')
      this._div.style.setProperty('mask-image', `url(#${this._regionId})`)
      this._div.style.setProperty('-webkit-mask-image', `url(#${this._regionId})`);
      this._div.addEventListener('resize', ()=>{
        console.log('resized!')
      })
    }

    this._regionContainer.appendChild(child.getDiv());

  }


  __logSelf(){
    const id= this.getId() || this._name;
    for (var attribut in this) {
        if (this[attribut] === null) {
            // cloneObj[attribut] = this[attribut].clone();
            console.log(id, 'null:', attribut, '=', this[attribut])
        } else 
        if (typeof this[attribut] === "object") {
            // cloneObj[attribut] = this[attribut].clone();
            console.log(id,'obj:', attribut, '=', this[attribut])
        } else {
            // cloneObj[attribut] = this[attribut];
            console.log(id,'att:', attribut, '=', this[attribut])
        }
    }
  }
}

/*
* https://stackoverflow.com/questions/28150967/typescript-cloning-object
public clone(): any {
    var cloneObj = new (this.constructor() as any);
    for (var attribut in this) {
        if (typeof this[attribut] === "object") {
            cloneObj[attribut] = this[attribut].clone();
        } else {
            cloneObj[attribut] = this[attribut];
        }
    }
    return cloneObj;
}
*/