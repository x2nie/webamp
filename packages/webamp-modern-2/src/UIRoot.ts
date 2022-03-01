import Bitmap from "./skin/Bitmap";
import { XmlElement } from "@rgrove/parse-xml";
import TrueTypeFont from "./skin/TrueTypeFont";
import { assert, assume, findLast } from "./utils";
import BitmapFont from "./skin/BitmapFont";
import Color from "./skin/Color";
import GammaGroup from "./skin/GammaGroup";
import Container from "./skin/makiClasses/Container";
import Vm from "./skin/VM";
import BaseObject from "./skin/makiClasses/BaseObject";
import AUDIO_PLAYER, { AudioPlayer } from "./skin/AudioPlayer";

export class UIRoot {
  _div: HTMLDivElement = document.createElement("div");
  // Just a temporary place to stash things
  _bitmaps: Bitmap[] = [];
  _fonts: (TrueTypeFont | BitmapFont)[] = [];
  _colors: Color[] = [];
  _groupDefs: XmlElement[] = [];
  _gammaSets: Map<string, GammaGroup[]> = new Map();
  _xuiElements: XmlElement[] = [];
  _activeGammaSet: GammaGroup[] | null = null;
  _activeGammaSetName : string = null;
  _containers: Container[] = [];

  // A list of all objects created for this skin.
  _objects: BaseObject[] = [];

  vm: Vm = new Vm();
  audio: AudioPlayer = AUDIO_PLAYER;

  reset() {
    this.dispose();
    this._bitmaps = [];
    this._fonts = [];
    this._colors = [];
    this._groupDefs = [];
    this._gammaSets = new Map();
    this._xuiElements = [];
    this._activeGammaSet = null;
    this._containers = [];

    // A list of all objects created for this skin.
    this._objects = [];
  }

  getRootDiv() {
    return this._div;
  }

  addObject(obj: BaseObject) {
    this._objects.push(obj);
  }

  addBitmap(bitmap: Bitmap) {
    this._bitmaps.push(bitmap);
  }

  // TODO: Maybe return a default bitmap?
  getBitmap(id: string): Bitmap {
    const lowercaseId = id.toLowerCase();
    const found = findLast(
      this._bitmaps,
      (bitmap) => bitmap._id.toLowerCase() === lowercaseId
    );

    if(found == null) console.warn(`Could not find bitmap with id ${id}.`);
    // assert(found != null, `Could not find bitmap with id ${id}.`);
    return found;
  }

  addFont(font: TrueTypeFont | BitmapFont) {
    this._fonts.push(font);
  }

  addColor(color: Color) {
    this._colors.push(color);
  }

  getColor(id: string): Color {
    const lowercaseId = id.toLowerCase();
    const found = findLast(
      this._colors,
      (color) => color._id.toLowerCase() === lowercaseId
    );

    //assert(found != null, `Could not find color with id ${id}.`);
    if(found == null) console.warn(`Could not find color with id ${id}.`);
    return found;
  }

  getFont(id: string): TrueTypeFont | BitmapFont | null {
    const found = findLast(
      this._fonts,
      (font) => font.getId().toLowerCase() === id.toLowerCase()
    );

    if (found == null) {
      console.warn(`Could not find true type font with id ${id}.`);
    }
    return found ?? null;
  }

  addGroupDef(groupDef: XmlElement) {
    this._groupDefs.push(groupDef);
    if (groupDef.attributes.xuitag) {
      this._xuiElements.push(groupDef);
    }
  }

  getGroupDef(id: string): XmlElement | null {
    const lowercaseId = id.toLowerCase();
    const found = findLast(
      this._groupDefs,
      (def) => def.attributes.id.toLowerCase() === lowercaseId
    );

    return found ?? null;
  }

  addContainers(container: Container) {
    this._containers.push(container);
  }

  getContainers(): Container[] {
    return this._containers;
  }

  addGammaSet(id: string, gammaSet: GammaGroup[]) {
    this._gammaSets.set(id.toLowerCase(), gammaSet);
  }

  enableGammaSet(id: string) {
    const found = this._gammaSets.get(id.toLowerCase());
    assume(
      found != null,
      `Could not find gammaset for id "${id}" from set of ${Array.from(
        this._gammaSets.keys()
      ).join(", ")}`
    );
    this._activeGammaSetName = id;
    this._activeGammaSet = found;
    this._setCssVars();
  }

  enableDefaultGammaSet() {
    // this._activeGammaSet = Array.from(this._gammaSets.values())[0] ?? null;
    // this._setCssVars();
    // TODO: Get latest picked color scheme
    const [firstName] = this._gammaSets.keys();
    // this._activeGammaSetName = firstName;
    this.enableGammaSet(firstName)
  }

  _getGammaGroup(id: string): GammaGroup | null {
    const lower = id.toLowerCase();
    const found = findLast(this._activeGammaSet, (gammaGroup) => {
      return gammaGroup.getId().toLowerCase() === lower;
    });
    return found ?? null;
  }

  _setCssVars() {
    const map = new Map();
    for (const bitmap of this._bitmaps) {
      const img = bitmap.getImg();
      const groupId = bitmap.getGammaGroup();
      // if (!map.has(img)) {
      //   map.set(img, new Map());
      // }
      // const imgCache = map.get(img);
      // if (!imgCache.has(groupId)) {
        const gammaGroup =
          groupId != null ? this._getGammaGroup(groupId) : null;
        const url =
          gammaGroup == null ? img.src : gammaGroup.transformImage(
            img,
            bitmap._x,
            bitmap._y,
            bitmap._width,
            bitmap._height
            );
        // imgCache.set(groupId, url);
      // }
      // const url = imgCache.get(groupId);
      // TODO: Techincally we only need one per image/gammagroup.
      this._div.style.setProperty(bitmap.getCSSVar(), `url(${url})`);
    }
    this._setScrollbarsCss()
  }

  _setScrollbarsCss() {
    const self = this;
    function _bitmapVar(id: string){
      const bitmap = self.getBitmap(id);
      if(!bitmap){
        return `none /* not found bitmap: ${id} */`
      }
      return `var(${bitmap.getCSSVar()})`
    }
    function _color(id: string){
      const color = self.getColor('studio.list.text');
      if(!color){
        return `inherit /* not found color: ${id} */`
      }
      return color.getRgb()
    }
    const scrollbarCss = `
    /* Let's get this party started */
    ::-webkit-scrollbar {
        width: 13px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background-image: ${_bitmapVar('studio.scrollbar.vertical.background')};
    }
    ::-webkit-scrollbar-button {
        background-image: ${_bitmapVar('studio.scrollbar.vertical.left')};
      }
    ::-webkit-scrollbar-button:vertical {
        height: 18px;
    }
    ::-webkit-scrollbar-button:vertical:increment {
      background-image: ${_bitmapVar('studio.scrollbar.vertical.right')};
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background-image: ${_bitmapVar('studio.scrollbar.vertical.button')};
        /*background-repeat: repeat;*/
    }
    ::-webkit-scrollbar-thumb {
        max-height: 42px;
        min-height: 42px;
        transform: scaleY(3);
        position: relative;
        display: block;
        z-index: 1;
    }
    ::-webkit-scrollbar-thumb::after {
        content: 'HALO';
        position: absolute;
        display: block;
        inset: 0;
        background: rgba(255, 230, 0, 1);
        z-index: 100;
    }
    /* ::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(255,0,0,0.4); 
    } */

    /*? HORIZONTAL */
    ::-webkit-scrollbar:horizontal {
        height: 13px;
    }
    /* Track */
    ::-webkit-scrollbar-track:horizontal {
        background-image: ${_bitmapVar('studio.scrollbar.horizontal.background')};
    }
    /* Handle */
    ::-webkit-scrollbar-thumb:horizontal {
        background-image: ${_bitmapVar('studio.scrollbar.horizontal.button')};
        
    }
    ::-webkit-scrollbar-button:horizontal {
        background-image: ${_bitmapVar('studio.scrollbar.horizontal.left')};
        width: 17px;
    }
    ::-webkit-scrollbar-button:horizontal:increment {
        background-image: ${_bitmapVar('studio.scrollbar.horizontal.right')};
    }
    ::-webkit-scrollbar-corner {
        background: transparent;
    }
    /* ---------- EOF SCROLLBAR ------------ */

    select option {
      color: ${_color('studio.list.text')};
    }

    `
    const scrollbarCssEl = document.getElementById('scrollbar-css');
    scrollbarCssEl.textContent = scrollbarCss;
  }

  getXuiElement(name: string): XmlElement | null {
    const lowercaseName = name.toLowerCase();
    const found = findLast(
      this._xuiElements,
      (def) => def.attributes.xuitag.toLowerCase() === lowercaseName
    );

    return found ?? null;
  }

  dispatch(
    action: string,
    param: string | null | number,
    actionTarget: string | null
  ) {
    switch (action.toLowerCase()) {
      case "play":
        this.audio.play();
        break;
      case "pause":
        this.audio.pause();
        break;
      case "stop":
        this.audio.stop();
        break;
      case "next":
        this.audio.next();
        break;
      case "prev":
        this.audio.previous();
        break;
      case "eject":
        this.audio.eject();
        break;
      case "toggle":
        if(param=='guid:pl') param='pledit';
        const container = findLast(this.getContainers(), ct => ct._id == param);
        // console.log(container._id, container._layouts)
        // container._defaultVisible = true;
        // container.setLayout(container._layouts[0]._id);
        container.toggle()
        // this._div.appendChild(container.getDiv())
        // this.audio.eject();
        break;
      default:
        assume(false, `Unknown global action: ${action} ,param: ${param}, actionTarget: ${actionTarget}`);
    }
  }
  draw() {
    this._div.style.imageRendering = "pixelated";
    for (const container of this.getContainers()) {
      container.draw();
      this._div.appendChild(container.getDiv());
    }
  }

  dispose() {
    this._div.remove();
    for (const obj of this._objects) {
      obj.dispose();
    }
  }
}

// Global Singleton for now
let UI_ROOT = new UIRoot();
export default UI_ROOT;
