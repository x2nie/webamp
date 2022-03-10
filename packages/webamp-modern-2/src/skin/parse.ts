import parseXml, { XmlDocument, XmlElement } from "@rgrove/parse-xml";
import { assert, getCaseInsensitiveFile, assume } from "../utils";
import Bitmap from "./Bitmap";
import ImageManager from "./ImageManager";
import Layout from "./makiClasses/Layout";
import Group from "./makiClasses/Group";
import Container from "./makiClasses/Container";
import Layer from "./makiClasses/Layer";
import Slider from "./makiClasses/Slider";
import Button from "./makiClasses/Button";
import WasabiButton from "./makiClasses/WasabiButton";
import Text from "./makiClasses/Text";
import Status from "./makiClasses/Status";
import { parse as parseMaki } from "../maki/parser";
import SystemObject from "./makiClasses/SystemObject";
import ToggleButton from "./makiClasses/ToggleButton";
import TrueTypeFont from "./TrueTypeFont";
import GuiObj from "./makiClasses/GuiObj";
import AnimatedLayer from "./makiClasses/AnimatedLayer";
import Vis from "./makiClasses/Vis";
import BitmapFont from "./BitmapFont";
import Color from "./Color";
import GammaGroup from "./GammaGroup";
import ColorThemesList from "./ColorThemesList";
import UI_ROOT, { UIRoot } from "../UIRoot";
import { getBitmap_system_elements } from "./defaultResource";
import AlbumArt from "./makiClasses/AlbumArt";
import WindowHolder from "./makiClasses/WindowHolder";
import WasabiFrame from "./makiClasses/WasabiFrame";
import Grid from "./makiClasses/Grid";
import { clone, cloneAttribute } from "./clone";
import ProgressGrid from "./makiClasses/ProgressGrid";

class ParserContext {
  container: Container | null = null;
  parentGroup: Group | /* Group includes Layout | */ null = null;
}

// let _CURRENT_PARSER: SkinParser;

export default class SkinParser {
  _imageManager: ImageManager;
  _path: string[] = [];
  // _context: ParserContext = new ParserContext();
  // _gammaSet: GammaGroup[] = [];
  _uiRoot: UIRoot;
  _res = {
    bitmaps: {
      // 'studio.basetexture': false,
      'studio.button': false,
      'studio.button.pressed': false,
      'studio.scrollbar.vertical.background': false,
      'studio.scrollbar.vertical.left': false,
      'studio.scrollbar.vertical.right': false,
      'studio.scrollbar.vertical.button': false,
      'studio.scrollbar.horizontal.background': false,
      'studio.scrollbar.horizontal.left': false,
      'studio.scrollbar.horizontal.right': false,
      'studio.scrollbar.horizontal.button': false,
    }, 
    colors: {} }; //requested by skin, later compared with UiRoot._bitmaps
  

  constructor(
    uiRoot: UIRoot /* Once UI_ROOT is not a singleton, we can create that objet in the constructor */
  ) {
    this._uiRoot = uiRoot;
    this._imageManager = new ImageManager(this._uiRoot._zip);
    // _CURRENT_PARSER = this;
  }

  // public static getCurrentParser(): SkinParser {
  //   return _CURRENT_PARSER;
  // }

  async parse(): Promise<UIRoot> {
    // Load built-in xui elements
    // await this.parseFromUrl("assets/xml/xui/standardframe.xml");
    const includedXml = await this._uiRoot.getFileAsString("skin.xml");

    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXml(includedXml) as unknown as  XmlElement;

    await this.traverseChildren(parsed) ;
    await this._resolveRes()

    return this._uiRoot;
  }

  // Some XML files are built-in, so we want to be able to
  async parseFromUrl(url: string): Promise<void> {
    const response = await fetch(url);
    const xml = await response.text();
    const parsed = parseXmlFragment(xml);
    await this.traverseChildren(parsed);
  }

  _scanRes(node: XmlElement){
    // if(node.attributes.background!=null && !!!this._res.bitmaps[node.attributes.background]){
    if(node.attributes.background){
      this._res.bitmaps[node.attributes.background] = false; // just add, dont need to check
      // console.log(node.name, 'bg:', node.attributes.background)
    } 
  }

  async _resolveRes(){
    //? checkmark the already availble
    // this._uiRoot._bitmaps.forEach(function (bitmap) {
    //   self._res.bitmaps[bitmap._id.toLowerCase()] = true;
    // });
    for(const bitmap of this._uiRoot._bitmaps){
      this._res.bitmaps[bitmap._id.toLowerCase()] = true;
    };
    // console.log(this._res.bitmaps)
    //? build not available bitmap
    for (const [key, available] of Object.entries<boolean>(this._res.bitmaps)) {
      // console.log('trial bitmap:', key, available, typeof available)
      if(!!!available){
        const lowercaseId = key.toLowerCase();
        const dict = getBitmap_system_elements(lowercaseId);
        if(dict!=null){
          const bitmapEl = new XmlElement('bitmap', {...dict})
        //   // parser.traverseChild(bitmapEl);
          await this.bitmap(bitmapEl);
          console.log('solving bitmap:', lowercaseId)
          // return findLast(
          //   this._bitmaps,
          //   (bitmap) => bitmap._id.toLowerCase() === lowercaseId
          // );
        }
      }
    }
    // this._uiRoot._bitmaps.forEach(function (bitmap) {
    //   this._res.bitmaps[bitmap._id.toLowerCase()] = true;
    // });
  }

  async traverseChildren(node: XmlElement, parent: any = null) {
    for (const child of node.children) {
      if (child instanceof XmlElement) {
        // console.log('traverse->', parent.name, child.name)
        this._scanRes(child);
        await this.traverseChild(child, parent);
      }
    }
  }

  async traverseChildren0(node: XmlElement, parent: any = null) {
    return Promise.all(
      node.children.map( (child) => {
        if (child instanceof XmlElement) {
          // console.log('traverse->', parent.name, child.name)
          this._scanRes(child);
          return this.traverseChild(child, parent);
        }
      })
    )
  }
  async traverseChild(node: XmlElement, parent: any) {
    switch (node.name.toLowerCase()) {
      case "albumart":
        return this.albumart(node, parent);
      case "wasabixml":
        return this.wasabiXml(node, parent);
      case "winampabstractionlayer":
        return this.winampAbstractionLayer(node, parent);
      case "include":
        return await this.include(node, parent);
      case "skininfo":
        return this.skininfo(node, parent);
      case "elements":
        return this.elements(node, parent);
      case "bitmap":
        return this.bitmap(node);
      case "bitmapfont":
        return this.bitmapFont(node);
      case "color":
        return this.color(node, parent);
      case "groupdef":
        return this.groupdef(node, parent);
      case "animatedlayer":
        return this.animatedLayer(node, parent);
      case "layer":
        return this.layer(node, parent);
      case "container":
        return this.container(node, parent);
      case "layoutstatus":
        return this.layoutStatus(node, parent);
      case "grid":
        return this.grid(node, parent);
      case "hideobject":
        return this.hideobject(node, parent);
      case "button":
        return this.button(node, parent);
      case "togglebutton":
        return this.toggleButton(node, parent);
      case "progressgrid":
        return this.progressGrid(node, parent);
      case "rect":
      case "layoutstatus":
      case "groupxfade":
      case "group":
        return await this.group(node, parent);
      case "layout":
        return this.layout(node, parent);
      case "windowholder":
        return this.windowholder(node, parent);
      case "component":
        return this.component(node, parent);
      case "gammaset":
        return this.gammaset(node, parent);
      case "gammagroup":
        return this.gammagroup(node, parent);
      case "slider":
        return this.slider(node, parent);
      case "script":
        return await this.script(node, parent);
      case "scripts":
        return this.scripts(node, parent);
      case "text":
          return this.text(node, parent);
      case "songticker":
        return this.songticker(node, parent);
      case "sendparams":
        return this.sendparams(node, parent);
      case "wasabi:titlebar":
        return await this.wasabiTitleBar(node, parent);
      case "wasabi:button":
        // return this.toggleButton(node, parent);
        return this.wasabiButton(node, parent);
      case "truetypefont":
        return this.trueTypeFont(node, parent);
      case "eqvis":
        return this.eqvis(node, parent);
      case "colorthemes:mgr":
      case "colorthemes:list":
        return this.colorThemesList(node, parent);
      case "status":
        return this.status(node, parent);
      case "wasabi:mainframe:nostatus":
      case "wasabi:medialibraryframe:nostatus":
      case "wasabi:playlistframe:nostatus":
      case "wasabi:standardframe:nostatus":
      case "wasabi:standardframe:status":
      case "wasabi:visframe:nostatus":
        return await this.wasabiFrame(node, parent);
      case "nstatesbutton":
      case "componentbucket":
      case "playlisteditor":
      case "wasabi:tabsheet":
      case "snappoint":
      case "accelerators":
      case "elementalias":
      case "browser":
      case "syscmds":
        // TODO
        return;
      // TODO: This should be the default fall through
      // return this.xuiElement(node, parent);
      case "vis":
        return this.vis(node, parent);
      // Note: Included files don't have a single root node, so we add a synthetic one.
      // A different XML parser library might make this unnessesary.
      case "wrapper":
        return this.traverseChildren(node, parent);
      default:
        console.warn(`Unhandled XML node type: ${node.name}`);
        return;
    }
  }

  addToGroup(obj: GuiObj, parent: Group) {
    parent.addChild(obj);
  }


  async newGui<Type>(Type, node: XmlElement, parent: any): Promise<Awaited<Type>> {
    const gui = new Type();
    // const previousParent = this._context.parentGroup;
    // await this.maybeApplyGroupDef(group, node);
    gui.setXmlAttributes(node.attributes);
    // this._context.parentGroup = group;
    // await this.traverseChildren(node, parent);
    // this._context.parentGroup = previousParent;
    this.addToGroup(gui, parent);
    return gui;
  }

  async newGroup<Type>(Type, node: XmlElement, parent: any): Promise<Awaited<Type>> {
    const group = new Type();
    // const previousParent = this._context.parentGroup;
    await this.maybeApplyGroupDef(group, node);
    group.setXmlAttributes(node.attributes);
    // this._context.parentGroup = group;
    await this.traverseChildren(node, group);
    // this._context.parentGroup = previousParent;
    this.addToGroup(group, parent);
    if(node.attributes.instanceid) group.setxmlparam('id',node.attributes.instanceid )
    return group;
  }

  /* Individual Element Parsers */

  async wasabiXml(node: XmlElement, parent: any) {
    await this.traverseChildren(node, parent);
  }

  async winampAbstractionLayer(node: XmlElement, parent: any) {
    await this.traverseChildren(node, parent);
  }

  async elements(node: XmlElement, parent: any) {
    await this.traverseChildren(node, parent);
  }

  async windowholder(node: XmlElement, parent: any) {
    return this.newGroup(WindowHolder, node, parent)
    // const group = new WindowHolder();
    // const previousParent = this._context.parentGroup;
    // await this.maybeApplyGroupDef(group, node);
    // group.setXmlAttributes(node.attributes);
    // this._context.parentGroup = group;
    // await this.traverseChildren(node, parent);
    // this._context.parentGroup = previousParent;
    // this.addToGroup(group);
  }

  async group(node: XmlElement, parent: any): Promise<Group> {
    return await this.newGroup(Group, node, parent)
    // const group = new Group();
    // const previousParent = this._context.parentGroup;
    // await this.maybeApplyGroupDef(group, node);
    // group.setXmlAttributes(node.attributes);
    // this._context.parentGroup = group;
    // await this.traverseChildren(node, parent);
    // this._context.parentGroup = previousParent;
    // this.addToGroup(group);
    // return group
  }

  async bitmap(node: XmlElement) {
    assume(
      node.children.length === 0,
      "Unexpected children in <bitmap> XML node."
    );
    const bitmap = new Bitmap();
    bitmap.setXmlAttributes(node.attributes);
    await bitmap.ensureImageLoaded(this._imageManager);

    this._uiRoot.addBitmap(bitmap);
    this._res.bitmaps[node.attributes.id] = true;
  }

  async bitmapFont(node: XmlElement) {
    assume(
      node.children.length === 0,
      "Unexpected children in <bitmapFont> XML node."
    );
    const font = new BitmapFont();
    font.setXmlAttributes(node.attributes);
    // hold on, it is happen that some bitmapfont indirectly refer to other bitmap
    // <bitmap id="bitmapfont.player.BIGNUM" file="../Winamp Modern/player/numfont.png" x="0" y="0" h="60" w="300" gammagroup="DisplayElements"/>
    // <bitmapfont id="player.BIGNUM" file="bitmapfont.player.BIGNUM" charwidth="13" charheight="20" hspacing="-1" vspacing="0"/>
    const found = this._uiRoot.getFileIsExist(node.attributes.file);
    if(!found){
      const bitmap = this._uiRoot.getBitmap(node.attributes.file)
      if(bitmap){
        font.setXmlAttr('file', bitmap._file);
      }
      else console.warn('BitmapFont file not found:', node.attributes.file)
    }

    await font.ensureFontLoaded(this._imageManager);

    this._uiRoot.addFont(font);
  }

  async text(node: XmlElement, parent: any): Promise<Text> {
    return this.newGui(Text, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <text> XML node."
    // );

    // const text = new Text();
    // text.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Text id="${text._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return text;
    // }
    // parentGroup.addChild(text);
    // return text;
  }

  async songticker(node: XmlElement, parent: any): Promise<Text> {
    const text = await this.text(node, parent);
    text.setxmlparam('display', 'songtitle')
    return text
  }

  async wasabiTitleBar(node: XmlElement, parent: any) {
    const group = await this.group(node, parent);
    let text = null;
    
    //? Search Wasabi Inheritace
    const xuitag : string = node.name; //Wasabi:MainFrame:NoStatus
    const xuiEl : XmlElement = UI_ROOT.getXuiElement(xuitag);
    if(xuiEl && node.attributes.id != xuiEl.attributes.id){
      const xuiFrame = new XmlElement('groupdev',{id: xuiEl.attributes.id });
      await this.maybeApplyGroupDef(group, xuiFrame);
      text = group.findobject(xuiEl.attributes.embed_xui)
    } else {
      text = group.findobject('window.titlebar.title')
    }
    
    // const text = await this.text(node, parent);
    if(text){
      text.setxmlparam('text', ':componentname') // or display:componentname?
    }
    
    return text  
  }

  async script(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <script> XML node."
    );

    let { file, id, param } = node.attributes;
    assert(file != null, "Script element missing `file` attribute");
    if(file.startsWith('../Winamp Modern/')){
      file = file.replace('../Winamp Modern/','')
    }
    // assert(id != null, "Script element missing `id` attribute");

    const scriptContents: ArrayBuffer = await this._uiRoot.getFileAsBytes(file);
    assert(scriptContents != null, `ScriptFile file not found at path ${file}`);

    // TODO: Try catch?
    const parsedScript = parseMaki(scriptContents);

    const systemObj = new SystemObject(id, parsedScript, param);
    // systemObj.___id = id;

    // TODO: Need to investigate how scripts find their group. In corneramp, the
    // script itself is not in any group. `xml/player.xml:8
    if (parent instanceof Group) {
      parent.addSystemObject(systemObj);
    } else {
      // Script archives can also live in <groupdef /> but we don't know how to do that.
    }
  }

  async scripts(node: XmlElement, parent: any) {
    await this.traverseChildren(node, parent);
  }

  async sendparams(node: XmlElement, parent: Group) {
    assume(
      node.children.length === 0,
      "Unexpected children in <sendparams> XML node."
    );

    // TODO: Parse sendparams
    let el = parent;
    if(node.attributes.group) {
      el = parent.findobject(node.attributes.group) as Group;
    }
    const targets = node.attributes.target.split(';')
    for(const target of targets){
      const gui= el.findobject(target);
      for (let attribute in node.attributes) {
        if(gui && attribute!='target'){
          gui.setxmlparam(attribute, node.attributes[attribute])
        }
      }
    }
  }

  async button(node: XmlElement, parent: any) {
    return this.newGui(Button, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <button> XML node."
    // );

    // const button = new Button();
    // button.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Button id="${button._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(button);
  }

  async wasabiButton(node: XmlElement, parent: any) {
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <button> XML node."
    // );

    // const button = new WasabiButton();
    // button.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Button id="${button._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(button);

    // assure backgrounds are loaded:
    this._res.bitmaps["studio.button"] = false;
    this._res.bitmaps["studio.button.pressed"] = false;

    this._res.bitmaps["studio.button.upperLeft"] = false;
    this._res.bitmaps["studio.button.top"] = false;
    this._res.bitmaps["studio.button.upperRight"] = false;
    this._res.bitmaps["studio.button.left"] = false;
    this._res.bitmaps["studio.button.middle"] = false;
    this._res.bitmaps["studio.button.right"] = false;
    this._res.bitmaps["studio.button.lowerLeft"] = false;
    this._res.bitmaps["studio.button.bottom"] = false;
    this._res.bitmaps["studio.button.lowerRight"] = false;

    this._res.bitmaps["studio.button.pressed.upperLeft"] = false;
    this._res.bitmaps["studio.button.pressed.top"] = false;
    this._res.bitmaps["studio.button.pressed.upperRight"] = false;
    this._res.bitmaps["studio.button.pressed.left"] = false;
    this._res.bitmaps["studio.button.pressed.middle"] = false;
    this._res.bitmaps["studio.button.pressed.right"] = false;
    this._res.bitmaps["studio.button.pressed.lowerLeft"] = false;
    this._res.bitmaps["studio.button.pressed.bottom"] = false;
    this._res.bitmaps["studio.button.pressed.lowerRight"] = false;

    // console.log('wasabi.btn', this._res.bitmaps)
    return this.newGui(Button, node, parent)

  }


  async toggleButton(node: XmlElement, parent: any) {
    return this.newGui(ToggleButton, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <button> XML node."
    // );

    // const button = new ToggleButton();
    // button.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <ToggleButton id="${button._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(button);
  }

  async color(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <color> XML node."
    );

    const color = new Color();
    color.setXmlAttributes(node.attributes);

    this._uiRoot.addColor(color);
  }

  async slider(node: XmlElement, parent: any) {
    return this.newGui(Slider, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <slider> XML node."
    // );

    // const slider = new Slider();
    // slider.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Slider id="${slider._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(slider);
  }

  async groupdef(node: XmlElement, parent: any) {
    this._uiRoot.addGroupDef(node);
    
    // // lets make a clonnable
    // const group = new Group();
    // const previousParent = this._context.parentGroup;
    // // await this.maybeApplyGroupDef(group, node);
    // group.setXmlAttributes(node.attributes);
    // this._context.parentGroup = group;
    // await this.traverseChildren(node, parent);
    // this._context.parentGroup = previousParent;
    // // this.addToGroup(group);

    // this._uiRoot._clonnableGroup[node.attributes.id] = group;
  }

  async albumart(node: XmlElement, parent: any) {
    return this.newGui(AlbumArt, node, parent)
    // const group = new AlbumArt();
    // const previousParent = this._context.parentGroup;
    // // await this.maybeApplyGroupDef(group, node);
    // group.setXmlAttributes(node.attributes);
    // // this._context.parentGroup = group;
    // // await this.traverseChildren(node);
    // this._context.parentGroup = previousParent;
    // this.addToGroup(group);
  }

  async layer(node: XmlElement, parent: any) {
    return this.newGui(Layer, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <layer> XML node."
    // );

    // const layer = new Layer();
    // layer.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Layer id="${layer._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(layer);
  }

  async grid(node: XmlElement, parent: any) {
    return this.newGui(Grid, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <layer> XML node."
    // );

    // const layer = new Grid();
    // layer.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Layer id="${layer._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(layer);
  }

  async progressGrid(node: XmlElement, parent: any) {
    return this.newGui(ProgressGrid, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <layer> XML node."
    // );

    // const layer = new ProgressGrid();
    // layer.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Layer id="${layer._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(layer);
  }

  async animatedLayer(node: XmlElement, parent: any) {
    return this.newGui(AnimatedLayer, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <animatedlayer> XML node."
    // );

    // const layer = new AnimatedLayer();
    // layer.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <animatedlayer id="${layer._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(layer);
  }

  async maybeApplyGroupDef(group: GuiObj, node: XmlElement) {
    const id = node.attributes.id;
    await this.maybeApplyGroupDefId(group, id)
  }

  // async maybeApplyGroupDefId1(group: GuiObj, groupdef_id: string) {
  //   const groupDef = this._uiRoot._clonnableGroup[groupdef_id];
  //   if (groupDef != null) {
  //     cloneAttribute(groupDef, group, group._parent);
  //   }
  // }

  async maybeApplyGroupDefId(group: GuiObj, groupdef_id: string) {
    const groupDef = this._uiRoot.getGroupDef(groupdef_id);
    if (groupDef != null) {
      group.setXmlAttributes(groupDef.attributes);
      // const previousParentGroup = this._context.parentGroup;
      // this._context.parentGroup = group as Group;
      await this.traverseChildren(groupDef, group);
      // this._context.parentGroup = previousParentGroup;
      // TODO: Maybe traverse groupDef's children?
    }
  }

  async layout(node: XmlElement, parent: any) {
    return this.newGroup(Layout, node, parent)
    // const layout = new Layout();
    // await this.maybeApplyGroupDef(layout, node);
    // layout.setXmlAttributes(node.attributes);

    // const { container } = this._context;
    // assume(container != null, "Expected <Layout> to be in a <container>");
    // container.addLayout(layout);

    // this._context.parentGroup = layout;
    // await this.traverseChildren(node, parent);
  }

  async gammaset(node: XmlElement, parent: any) {
    const gammaSet = [];
    await this.traverseChildren(node, gammaSet);
    this._uiRoot.addGammaSet(node.attributes.id, gammaSet);
  }

  async gammagroup(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <gammagroup> XML node."
    );
    const gammaGroup = new GammaGroup();
    gammaGroup.setXmlAttributes(node.attributes);
    parent.push(gammaGroup);
  }

  async component(node: XmlElement, parent: any) {
    // await this.traverseChildren(node, parent);
    //x2nie
    return this.newGui(ColorThemesList, node, parent)
    // ColorThemesList
    // const previousParent = this._context.parentGroup;
    
    // const list = new ColorThemesList();
    // list.setXmlAttributes(node.attributes);
    // this._context.parentGroup = list;
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <ColorThemes:List id="${list.getId()}"> to be within a <Layout> | <Group>`
    //     );
    //     return;
    // }
    // await this.traverseChildren(node, parent);
    // parentGroup.addChild(list);
    // this._context.parentGroup = previousParent;

  }

  async container(node: XmlElement, parent: any) {
    const container = new Container();
    container.setXmlAttributes(node.attributes);
    // this._context.container = container;
    this._uiRoot.addContainers(container);
    await this.traverseChildren(node, container);
  }

  async colorThemesList(node: XmlElement, parent: any) {
    return this.newGui(ColorThemesList, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <ColorThemes:List> XML node."
    // );

    // const list = new ColorThemesList();
    // list.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <ColorThemes:List id="${list.getId()}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(list);
  }

  /** taken from Winamp Modern skin */
  _getWasabiGroupDef(xmlTag: string): string{
    switch (xmlTag) {
      case "Wasabi:MainFrame:NoStatus":
        return 'wasabi.mainframe.nostatusbar';
      case "Wasabi:PlaylistFrame:NoStatus":
        return 'wasabi.playlistframe.nostatusbar';

      case "Wasabi:MediaLibraryFrame:NoStatus":
        return 'wasabi.medialibraryframe.nostatusbar';
      case "Wasabi:VISFrame:NoStatus":
        return 'wasabi.visframe.nostatusbar';

      case "Wasabi:StandardFrame:Status":
        return 'wasabi.standardframe.statusbar';

            // Wasabi:Standardframe:NoStatus
      case "Wasabi:Standardframe:NoStatus":
      case "Wasabi:StandardFrame:NoStatus":
        return 'wasabi.standardframe.nostatusbar';

      case "Wasabi:StandardFrame:Modal":
        return 'wasabi.standardframe.modal';
      case "Wasabi:StandardFrame:Static":
        return 'wasabi.standardframe.static';
      default:
        console.warn(`Unhandled <Wasabi:Frame:Tag>: ${xmlTag}`);
        return;
    }
  

  }
  async wasabiFrame(node: XmlElement, parent: any) {
    // const frame = new Group();
    const frame = new WasabiFrame();
    // this._context.parentGroup.addChild(frame);
    this.addToGroup(frame, parent);
    
    // const previousParentGroup1 = this._context.parentGroup;
    // this._context.parentGroup = frame;

    //? Search Wasabi Inheritace
    const xuitag : string = node.name; //Wasabi:MainFrame:NoStatus
    const xuiEl : XmlElement = UI_ROOT.getXuiElement(xuitag);
    if(xuiEl){
        const xuiFrame = new XmlElement('groupdev',{id: xuiEl.attributes.id });
        await this.maybeApplyGroupDef(frame, xuiFrame);
    }
    else {
      const groupdef_id = this._getWasabiGroupDef(node.name)
      // const nodeFrame = new XmlElement('nodeFrameStateus',{
      //   'id':groupdef_id, //? 'wasabi.standardframe.statusbar',
      //   w:'0',
      //   h:'0',
      //   relatw:'1',
      //   relath:'1',
      // });
      const groupDef = this._uiRoot.getGroupDef(groupdef_id);
      await this.maybeApplyGroupDef(frame, groupDef);
    }
    frame.setXmlAttributes(node.attributes);

    //?content
    if(node.attributes.content){
      const content = await this.group(new XmlElement(
        'group', 
        {
          id:node.attributes.content,
          w:'0',
          h:'0',
          relatw:'1',
          relath:'1',
        }
      ), frame)
      frame.addChild(content)
    }
      
    // this._context.parentGroup = previousParentGroup1;

  }

  async layoutStatus(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <layoutStatus> XML node."
    );
  }

  async xuiElement(node: XmlElement, parent: any) {
  //   assume(node.children.length === 0, "Unexpected children in XUI XML node.");
  //   const xuiElement = this._uiRoot.getXuiElement(node.name);
  //   assume(
  //     xuiElement != null,
  //     `Expected to find xui element with name "${node.name}".`
  //   );

  //   const group = new Group();
  //   group.setXmlAttributes(xuiElement.attributes);
  //   const previousParentGroup = this._context.parentGroup;
  //   this._context.parentGroup = group;

  //   await this.traverseChildren(xuiElement);
  //   group.setXmlAttributes(node.attributes);
  //   await this.traverseChildren(node, parent);

  //   this._context.parentGroup = previousParentGroup;

  //   this._context.parentGroup.addChild(group);
  }

  async status(node: XmlElement, parent: any) {
    return this.newGui(Status, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <status> XML node."
    // );

    // const status = new Status();
    // status.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Status id="${status._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(status);
  }
  async eqvis(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <eqvis> XML node."
    );
  }

  async vis(node: XmlElement, parent: any) {
    return this.newGui(Vis, node, parent)
    // assume(
    //   node.children.length === 0,
    //   "Unexpected children in <vis> XML node."
    // );

    // const vis = new Vis();
    // vis.setXmlAttributes(node.attributes);
    // const { parentGroup } = this._context;
    // if (parentGroup == null) {
    //   console.warn(
    //     `FIXME: Expected <Vis id="${vis._id}"> to be within a <Layout> | <Group>`
    //   );
    //   return;
    // }
    // parentGroup.addChild(vis);
  }

  async hideobject(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <hideobject> XML node."
    );
  }

  async trueTypeFont(node: XmlElement, parent: any) {
    assume(
      node.children.length === 0,
      "Unexpected children in <truetypefont> XML node."
    );
    const font = new TrueTypeFont();
    font.setXmlAttributes(node.attributes);
    await font.ensureFontLoaded(this._imageManager);

    this._uiRoot.addFont(font);
  }

  async include(node: XmlElement, parent: any) {
    const { file, parent_path } = node.attributes;
    assert(file != null, "Include element missing `file` attribute");

    const parent_dir = parent_path? parent_path.split("/"): [];

    const directories = file.replace('@DEFAULTSKINPATH@','').split("/");
    const fileName = directories.pop();

    const path = [...parent_dir, ...directories, fileName].join("/");
    // console.log('build-path.', `parentdir:${parent_dir}; curdir:${directories}; file:${fileName}`)

    const includedXml = await this._uiRoot.getFileAsString(path);
    if (includedXml == null) {
      console.warn(`Zip file not found: ${path} out of: `);
      return;
    }

    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXmlFragment(includedXml);

    const current_dir = directories.join('/')

    const nonGroupDefs = [];
    for(const element of parsed.children)
    {
      if(element instanceof XmlElement)
      {
        const lower = element.name.toLowerCase();
        if(lower=='groupdef')
        {
          this._uiRoot.addGroupDef(element);
          continue;
        } 
        else if(lower=='include')
        {
          element.attributes.parent_path = current_dir;
        }
        nonGroupDefs.push(element)
      } 
    }
    //replace children
    parsed.children.splice(0, parsed.children.length, ...nonGroupDefs);

    // await this.traverseChildren({children:}, parent);
    await this.traverseChildren(parsed, parent);

  }

  skininfo(node: XmlElement, parent: any) {
    // Ignore this metadata for now
  }

}

function parseXmlFragment(xml: string): XmlElement {
  // Note: Included files don't have a single root node, so we add a synthetic one.
  // A different XML parser library might make this unnessesary.
  return parseXml(`<wrapper>${xml}</wrapper>`) as unknown as XmlElement;
}
