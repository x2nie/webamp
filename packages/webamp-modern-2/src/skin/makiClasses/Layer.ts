import GuiObj from "./GuiObj";
import UI_ROOT from "../../UIRoot";
import { num, toBool } from "../../utils";
import Layout from "./Layout";
import { Edges } from "../Clippath";

export const LEFT   = 1 << 1;
export const RIGHT  = 1 << 2;
export const TOP    = 1 << 3;
export const BOTTOM = 1 << 4;
export const MOVE   = TOP | LEFT | 1;
export const CURSOR = 1 << 31;

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Clayer.2F.3E
export default class Layer extends GuiObj {
  static GUID = "5ab9fa1545579a7d5765c8aba97cc6a6";
  _image: string;
  _resize: string;
  _isMouseTrap: boolean = false;
  _resizable: number = 0;
  _movable: boolean = false;
  
  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if(key === 'id' && value.toLowerCase().startsWith('mousetrap')){
      this._isMouseTrap = true;
    }
    if (super.setXmlAttr(_key, value)) {
      if(key=='sysregion'){
        this._renderRegion()
      }
      return true;
    }
    switch (key) {
      case "image":
        this._image = value;
        this._renderBackground();
        this._renderRegion()
        break;
      case "move":
        this._movable = toBool(value);
        this._renderCssCursor();
        break;
      case "resize":
        this._resize = value=='0'?'':value;
        this._renderCssCursor();
        break;
      default:
        return false;
    }
    return true;
  }

  _renderRegion(){
    if(this._sysregion==1 && this._image){
      const canvas = UI_ROOT.getBitmap(this._image).getCanvas();
      const edge = new Edges();
      edge.parseCanvasTransparency(canvas);
      if(edge.isSimpleRect()){
        this.setXmlAttr('sysregion','0')
      } else {
        this._div.style.clipPath = edge.getPolygon()
      }
    }
  }

  _renderCssCursor() {
    this._div.style.cursor = 'none'; //flag. replace soon
    switch(this._resize) {
      case "right":
        this._div.style.cursor = 'e-resize';
        this._resizable = RIGHT;
        break;
      case "left":
        this._div.style.cursor = 'w-resize';
        this._resizable = LEFT;
        break;
      case "top":
        this._div.style.cursor = 'n-resize';
        this._resizable = TOP;
        break;
      case "bottom":
        this._div.style.cursor = 's-resize';
        this._resizable = BOTTOM;
        break;
      case "topleft":
        this._div.style.cursor = 'nw-resize';
        this._resizable = TOP | LEFT;
        break;
      case "topright":
        this._div.style.cursor = 'ne-resize';
        this._resizable = TOP | RIGHT;
        break;
      case "bottomleft":
        this._div.style.cursor = 'sw-resize';
        this._resizable = BOTTOM | LEFT;
        break;
      case "bottomright":
        this._div.style.cursor = 'se-resize';
        this._resizable = BOTTOM | RIGHT;
        break;
      default:
        // this._div.style.removeProperty('cursor');
        this._resizable = 0;
    }
    if(this._movable){
      this._div.style.cursor = 'move';
      this._resizable = MOVE;
      this._registerMovingEvents();
    }
    else if(this._div.style.cursor == 'none'){
        this._div.style.removeProperty('cursor');
    } else {
      this._div.style.pointerEvents = 'auto';
      this._registerResizingEvents()
    }
  }

  _resizingEventsRegisterd:boolean=false;

  _registerResizingEvents(){
    if(this._resizingEventsRegisterd) {
      return;
    }
    this._resizingEventsRegisterd = true;
    this._div.addEventListener("mousedown", (downEvent: MouseEvent) => {
      if(downEvent.button!=0) return; // only care LeftButton
      const layout = this.getparentlayout() as Layout;
      layout.setResizing('constraint', this._resizable, 0);
      layout.setResizing('start', 0, 0);
      layout.setResizing(this._div.style.getPropertyValue('cursor'), CURSOR, CURSOR);
      // const bitmap = UI_ROOT.getBitmap(this._thumb);
      const startX = downEvent.clientX;
      const startY = downEvent.clientY;
      // const width = this.getRealWidth() - bitmap.getWidth();
      // const height = this.getheight() - bitmap.getHeight();
      // const initialPostition = this._position;
      // this.doLeftMouseDown(downEvent.offsetX, downEvent.offsetY);
      
      const handleMove = (moveEvent: MouseEvent) => {
        const newMouseX = moveEvent.clientX;
        const newMouseY = moveEvent.clientY;
        const deltaY = newMouseY - startY;
        const deltaX = newMouseX - startX;
        layout.setResizing('move', deltaX, deltaY);

        // const deltaPercent = this._vertical ? deltaY / height : deltaX / width;
        // const newPercent = this._vertical
        //   ? initialPostition - deltaPercent
        //   : initialPostition + deltaPercent;

        // this._position = clamp(newPercent, 0, 1);
        // this._renderThumbPosition();
        // this.doSetPosition(this.getposition());
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        // console.log('slider.mUp!', upEvent.button)
        if(upEvent.button!=0) return; // only care LeftButton
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleMouseUp);
        // this.doLeftMouseUp(upEvent.offsetX, upEvent.offsetY);
        const newMouseX = upEvent.clientX;
        const newMouseY = upEvent.clientY;
        const deltaY = newMouseY - startY;
        const deltaX = newMouseX - startX;
        layout.setResizing('final', deltaX, deltaY);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
    });
  }
  _unregisterResizingEvents(){

  }

  _movingEventsRegisterd:boolean=false;

  _registerMovingEvents(){
    if(this._movingEventsRegisterd) {
      return;
    }
    this._movingEventsRegisterd = true;
    this._div.addEventListener("mousedown", (downEvent: MouseEvent) => {
      if(downEvent.button!=0) return; // only care LeftButton
      const layout = this.getparentlayout() as Layout;
      // layout.setResizing('constraint', this._resizable, 0);
      layout.setMoving('start', 0, 0);
      // layout.setResizing(this._div.style.getPropertyValue('cursor'), CURSOR, CURSOR);
      // const bitmap = UI_ROOT.getBitmap(this._thumb);
      const startX = downEvent.clientX;
      const startY = downEvent.clientY;
      // const width = this.getRealWidth() - bitmap.getWidth();
      // const height = this.getheight() - bitmap.getHeight();
      // const initialPostition = this._position;
      // this.doLeftMouseDown(downEvent.offsetX, downEvent.offsetY);
      
      const handleMove = (moveEvent: MouseEvent) => {
        const newMouseX = moveEvent.clientX;
        const newMouseY = moveEvent.clientY;
        const deltaY = newMouseY - startY;
        const deltaX = newMouseX - startX;
        layout.setMoving('move', deltaX, deltaY);

        // const deltaPercent = this._vertical ? deltaY / height : deltaX / width;
        // const newPercent = this._vertical
        //   ? initialPostition - deltaPercent
        //   : initialPostition + deltaPercent;

        // this._position = clamp(newPercent, 0, 1);
        // this._renderThumbPosition();
        // this.doSetPosition(this.getposition());
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        // console.log('slider.mUp!', upEvent.button)
        if(upEvent.button!=0) return; // only care LeftButton
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleMouseUp);
        // this.doLeftMouseUp(upEvent.offsetX, upEvent.offsetY);
        const newMouseX = upEvent.clientX;
        const newMouseY = upEvent.clientY;
        const deltaY = newMouseY - startY;
        const deltaX = newMouseX - startX;
        layout.setMoving('final', deltaX, deltaY);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
    });
  }
  _unregisterMovingEvents(){

  }

  // This shadows `getheight()` on GuiObj
  getheight(): number {
    if (this._height) {
      return this._height;
    }
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if(bitmap) return bitmap.getHeight();
    }
    return 0;
    return super.getheight();
  }

  // This shadows `getwidth()` on GuiObj
  getwidth(): number {
    if (this._width) {
      return this._width;
    }
    if (this._image != null) {
      const bitmap = UI_ROOT.getBitmap(this._image);
      if(bitmap) return bitmap.getWidth();
    }
    return 0;
    return super.getwidth();
  }

  _renderBackground() {
    const bitmap = this._image != null ? UI_ROOT.getBitmap(this._image) : null;
    this.setBackgroundImage(bitmap);
  }

  draw() {
    super.draw();
    // this._div.setAttribute("data-obj-name", "Layer");
    // this._div.style.pointerEvents = this._sysregion==-2 || this._ghost? 'none' : 'auto';
    // this._div.style.pointerEvents = this._isMouseTrap? 'auto': 'none';
    // this._div.style.pointerEvents = this._isMouseTrap? 'auto': 'none';
    // this._div.style.pointerEvents = 'auto';
    // this._div.style.display = this._sysregion==-2? 'none' : 'block';
    this._sysregion!=0 && this._div.setAttribute('sysregion', this._sysregion.toString());
    this._div.style.display = 'block';
    // this._div.style.display = this._sysregion < 0 ? 'none' : 'block';
    this._div.style.overflow = "hidden";
    this._div.classList.add("webamp--img");
    this._renderBackground();
  }
  setregionfrommap(regionMap:any, threshold:number, reverse:boolean) {
    //TODO:
  }

  isinvalid():boolean {
    return false;
  }
}
