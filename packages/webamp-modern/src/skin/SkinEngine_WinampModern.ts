import { XmlElement, parseXml, parseXmlFragment } from "@lib/xml";
import { markRaw } from "@odoo/owl";
//import { FileExtractor, PathFileExtractor, ZipFileExtractor } from "./FileExtractor";
import { ParsedMaki, parse as parseMaki } from "../maki/parser";
import { assert, assume, guid2alias } from "../utils";
import { SkinEngine, registerSkinEngine } from "./SkinEngine";
import { registry, xmlRegistry } from "@lib/registry";
import "./makiClasses/index";
import GuiObj from "./makiClasses/GuiObj";
import { AudioPlayer } from "./AudioPlayer";
import { PlEdit } from "./makiClasses/PlayList";

export class WinampModern extends SkinEngine {
  static supportedFileExt: string[] = ["wal", "zip"];
  static uniqueByFile = "skin.xml";

  // getFileExtractor(skinPath: string): FileExtractor {
  //     if(skinPath.endsWith('/')){
  //       return new PathFileExtractor()
  //     } else {
  //       return new ZipFileExtractor()
  //     }
  // }
  _env: { [key: string]: any };
  _groupdef: { [key: string]: XmlElement } = {};
  _groupBeta: XmlElement[] = []; // children needed. it is group that groupdef may unparsed
  _xuidef: { [key: string]: XmlElement } = {};
  _xuiBeta: XmlElement[] = []; // children needed. it is a wasabi:group that groupdef may unparsed
  _unknownTag: XmlElement[] = []; // may later cast'ed with xuitag
  _image: { [file: string]: { img: HTMLImageElement; url: string } } = {};
  _bitmap: { [key: string]: XmlElement } = {};
  _bitmapFont: { [key: string]: XmlElement } = {};
  _textBeta: XmlElement[] = []; // for later detect it's font-type:
  _script: { [file: string]: ParsedMaki } = {};
  _containers: XmlElement[] = [];

  setEnv(env: { [key: string]: any }) {
    this._env = env;
    // this._audio = env.audio
  }
  containers(): XmlElement[] {
    return this._containers;
  }

  get audio(): AudioPlayer {
    return this._env.audio;
  }
  get playlist(): PlEdit {
    return this._env.playlist;
  }

  async parseSkin() {
    const includedXml = await this.zip.getFileAsString("skin.xml");
    // console.log("skin.xml:", includedXml);
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXml(includedXml);
    // console.log('skin.xml=>', parsed)
    await this.traverseChildren(parsed, parsed);
    console.log("xuidef", this._xuidef);
    console.log("FINAL skin.xml=>", parsed);

    this.resolveTextFont();
    await this.resolveXui();
    await this.loadRes();
    // await this.loadBitmaps();
    // await this.loadScripts();

    // debugger
    this._env.ui.bitmapFonts = markRaw(this._bitmapFont); // ractive not needed
    this._env.ui.bitmaps = markRaw(this._bitmap); // ractive not needed
    this._env.ui.scripts = markRaw(this._script); // do not reactive
    this._env.ui.root = parsed; // reactive please.
    // return parsed
  }
  async loadRes() {
    return await Promise.all([
      this.loadBitmaps(),
      this.loadScripts(),
      this.attachGroupChild(),
    ]);
  }

  async loadBitmaps() {
    //? register unique files
    Object.values(this._bitmapFont).forEach((bitmapfont) => {
      if (this._bitmap[bitmapfont.attributes.file]) {
        bitmapfont.attributes.file =
          this._bitmap[bitmapfont.attributes.file].attributes.file;
      }
      //@ts-ignore
      this._image[bitmapfont.attributes.file] = {};
    });
    Object.values(this._bitmap).forEach(
      //@ts-ignore
      (bitmap) => (this._image[bitmap.attributes.file] = {})
    );
    //? load png as Image
    await Promise.all(
      Object.keys(this._image).map(async (filepath: string) => {
        try {
          const imgBlob = await this.zip.getFileAsBlob(filepath);
          const url = URL.createObjectURL(imgBlob);

          const img = new Image();
          // Dapatkan dimensi PNG dengan menunggu img.onload dalam sebuah Promise
          await new Promise<void>((resolve, reject) => {
            img.src = url;
            img.onload = () => {
              resolve();
            };
            img.onerror = reject;
          });
          this._image[filepath] = { img, url };
        } catch {
          console.log("failed to download bitmap:", filepath);
        }
      })
    );
    // console.log(this._image)
    //? put img url
    Object.values(this._bitmap).forEach((bitmap) => {
      const att = bitmap.attributes;
      const img = this._image[att.file];
      att.url = img.url;
      att.width = img.img?.width;
      att.height = img.img?.height;
      // console.log(`bmp:${att.id} = "${att.url}"`)
    });
    Object.values(this._bitmapFont).forEach((bitmap) => {
      const att = bitmap.attributes;
      const img = this._image[att.file];
      att.url = img.url;
      att.width = img.img?.width;
      att.height = img.img?.height;
      // console.log(`bmp:${att.id} = "${att.url}"`)
    });
  }
  async loadScripts() {
    const loadScript = async (file: string) => {
      const scriptContents = await this.zip.getFileAsBytes(file);
      assert(
        scriptContents.byteLength > 0,
        `ScriptFile file not found at path ${file}`
      );
      const parsedScript = parseMaki(scriptContents, file);
      this._script[file] = parsedScript;
    };
    return await Promise.all(Object.keys(this._script).map(loadScript));
  }

  resolveTextFont() {
    //? detect font mode here
    this._textBeta.forEach(
      //@ts-ignore
      (text) => {
        const bitmap = this._bitmapFont[text.attributes.font];
        text.attributes.fontmode = bitmap ? "bitmap" : "truetype";
      }
    );
  }
  async resolveXui() {
    const Xui = xmlRegistry.get("xui", XmlElement);
    /*
    this._xuiBeta.forEach((el) => {
      const groupdef = this._xuidef[el.tag];
      if (groupdef) {
        // debugger
        el.attributes.xuitag = el.tag
        el.tag = "xui";
        el = el.cast(Xui);
        //? don't do populate here, 
        //? it may have another unresolved xui as children/ grandchild
        // if (!el.attributes.content) {
          // el.merge(groupdef.clone());
        // }
        // el.attributes.instance_id = el.id
        // el.attributes.id = groupdef.id
        // this._groupBeta.push(el)
      }
    });
    */

    const scanXui = (el: XmlElement) => {
      //recursive, child first
      for (const child of el.children) {
        scanXui(child);
      }
      if (this._xuidef[el.tag]) {
        loadXui(el);
      }
    };
    const loadXui = (el: XmlElement) => {
      // if(el.attributes.resolved == true){
      //   return
      // }
      const groupdef = this._xuidef[el.tag];
      if (groupdef) {
        // debugger
        el.attributes.xuitag = el.tag;
        el.tag = "xui";
        el = el.cast(Xui);
        //? don't do populate here,
        //? it may have another unresolved xui as children/ grandchild
        // if (!el.attributes.content) {
        // el.merge(groupdef.clone());
        // }

        //lets load its childrens first.
        // debugger
        scanXui(groupdef);
        el.merge(groupdef.clone());
        if (el.id) {
          this._groupBeta.push(el);
        }
        // el.attributes.resolved = true
        // el.attributes.instance_id = el.id
        // el.attributes.id = groupdef.id
        // this._groupBeta.push(el)
      }
    };
    this._xuiBeta.forEach(loadXui);
  }

  populateGroupDef(def: XmlElement) {
    //recursive, child first
    for (const child of def.children) {
      this.populateGroupDef(child);
    }
    if (def.tag == "group" && !def.attributes.populated) {
      this.populateGroup(def);
    }
  }
  populateGroup(group: XmlElement) {
    if (group.attributes.populated == true) return;

    const groupdef = this._groupdef[group.id];
    // const groupdef = this._groupdef[group.id] || this._xuidef[group.id];
    if (!groupdef) {
      console.log("failed to get groupdef:", group.id);
    } else {
      if (!groupdef.attributes.populated) {
        this.populateGroupDef(groupdef);
        groupdef.attributes.populated = true;
      }
      group.merge(groupdef.clone());
      group.attributes.populated = true;

      if (group.attributes.instanceid) {
        group.attributes.id = group.attributes.instanceid;
        delete group.attributes.instanceid;
      }
    }
  }

  async attachGroupChild() {
    const loadGroup = async (group: XmlElement) => {
      this.populateGroup(group);
      // const groupdef = this._groupdef[group.id];
      // // const groupdef = this._groupdef[group.id] || this._xuidef[group.id];
      // if (!groupdef) {
      //   console.log("failed to get groupdef:", group.id);
      // } else {
      //   group.merge(groupdef.clone());
      //   if(group.attributes.instanceid){
      //     group.attributes.id = group.attributes.instanceid
      //   }
      // }
    };
    await Promise.all(this._groupBeta.map(loadGroup));
    this._groupBeta = [];
  }

  async attachXuiChild() {
    const loadGroup = async (group: XmlElement) => {
      this.populateGroup(group);
    };
    await Promise.all(this._groupBeta.map(loadGroup));
    this._groupBeta = [];
  }

  async traverseChild(node: XmlElement, parent: any, path: string[] = []) {
    const tag = node.tag;
    switch (tag) {
      case "wasabixml":
      case "winampabstractionlayer":
      case "scripts":
        return this.traverseChilds_Detach(node, parent.parent || parent, path);

      case "elements":
      case "skininfo":
      // Note: Included files don't have a single root node, so we add a synthetic one.
      // A different XML parser library might make this unnessesary.
      case "wrapper":
        return this.traverseChildren(node, parent, path);
      // case "script":
      //   return node
      case "include":
        return this.include(node, parent, path);
      // case "albumart":
      // return this.albumart(node, parent);
      case "container":
        return this.container(node, parent, path);
      case "layout":
        return this.layout(node, parent, path);
      // case "groupdef":
      //   return this.groupdef(node, parent, path);
      case "groupdef":
        return this.groupdef(node, parent, path);
      case "group":
        return this.group(node, parent, path);
      case "script":
        return this.script(node, parent, path);
      case "component":
        return this.component(node, parent, path);

      case "bitmap":
        return this.bitmap(node, parent, path);
      case "bitmapfont":
        return await this.bitmapFont(node);
      // case "color":
      //   return await this.color(node, parent);
      case "gammaset":
        node.detach(); //? trial to cleanup, to see what the rest
        break;
      case "text":
        this._textBeta.push(node);
        break;
      case "email":
        // debugger;
        break;
      default:
        if (tag.startsWith("wasabi:")) {
          this._xuiBeta.push(node);
        } else {
          this._unknownTag.push(node);
        }
    }
  }

  async include(node: XmlElement, parent: any, path: string[] = []) {
    const { file } = node.attributes;
    // console.log('loading incl:', file, '@', path)
    assert(file != null, "Include element missing `file` attribute");

    // debugger
    const directories = (file as String).split("/");
    const fileName = directories.pop();

    // for (const dir of directories) {
    //   this._path.push(dir);
    // }

    const filepath = [...path, ...directories, fileName].join("/");

    // if (zipFile == null) {
    //   console.warn(`Zip file not found: ${path} out of: `);
    //   return;
    // }
    const includedXml = await this.zip.getFileAsString(filepath);
    // console.log(filepath, ":", (includedXml || "").length, "chars");

    // console.log('include #2', fileName)
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXmlFragment(includedXml).children[0]; //.children[0] as XmlElement;
    // debugger
    // console.log('include #3', fileName)

    // await this.traverseChildren(parsed, parent, [...path, ...directories]);
    // console.log('include #4>', fileName, parsed)
    // debugger
    // const childs = await this.traverseChilds(parsed.children, parent, [...path, ...directories]);
    await this.traverseChilds(parsed.children, parent, [
      ...path,
      ...directories,
    ]);
    const childs = parsed.children.filter((e) => !!e.parent);
    // console.log('include #4<', fileName, parsed)

    // if(!parsed.children) {
    //   console.log('parsed-HAS-NO CHILD:', parsed.toJSON())
    //   return
    // }
    // console.log('include #4 ==>>', fileName, childs)
    if (!parent || !parent.children) {
      console.log("parent-HAS-NO CHILD:", parent.toJSON());
      return;
    }
    // debugger
    // let childrens = parsed  ? parsed.children :

    //? INCLUDE = attach children to parent from other xml file
    if (childs.length == 0) {
      node.detach();
      return;
    }
    let first = true;
    let putIndex = 0;
    childs.forEach((child) => {
      if (!child.parent) return; //TODO: keep back this.
      if (child.tag == "include" && child.children.length == 0) {
        node.detach();
        return;
      }
      // console.log('include #5~', fileName, child.name, '#', child.toJSON())
      //? replace the <include> with first child
      if (first) {
        // node.tag = child.tag;
        // node.attributes = child.attributes;
        // node.children = child.children;
        // node.cast(child.constructor)
        putIndex = node.parent.children.indexOf(node);
        node.replace(child);
        first = false;
      } else {
        if (parent.children) {
          //parent.children.push(child);
          parent.children.splice(++putIndex, 0, child);
        }
        child.parent = parent;
      }
    });
    // for (const _dir of directories) {
    //   this._path.pop();
    // }
    // return node
  }

  async traverseChilds_Detach(
    node: XmlElement,
    parent: any,
    path: string[] = []
  ) {
    await this.traverseChilds(node.children, parent, path);
    const childs = node.children.filter((e) => !!e.parent);
    // console.log('include #4<', fileName, parsed)

    // if(!parsed.children) {
    //   console.log('parsed-HAS-NO CHILD:', parsed.toJSON())
    //   return
    // }
    // console.log('include #4 ==>>', fileName, childs)
    if (!parent || !parent.children) {
      console.log("parent-HAS-NO CHILD:", parent.toJSON());
      return;
    }
    // debugger
    // let childrens = parsed  ? parsed.children :

    //? INCLUDE = attach children to parent from other xml file
    if (childs.length == 0) {
      node.detach();
      return;
    }
    let first = true;
    let putIndex = 0;
    childs.forEach((child) => {
      if (!child.parent) return; //TODO: keep back this.
      if (child.tag == "include" && child.children.length == 0) {
        node.detach();
        return;
      }
      // console.log('include #5~', fileName, child.name, '#', child.toJSON())
      //? replace the <include> with first child
      if (first) {
        node.tag = child.tag;
        node.attributes = child.attributes;
        node.children = child.children;
        first = false;
      } else {
        if (parent.children) parent.children.push(child);
        child.parent = parent;
      }
    });
  }

  async container(node: XmlElement, parent: any, path: string[] = []) {
    // node.tag = toTitleCase(node.tag)
    // this._containers.push(node);
    await this.traverseChildren(node, node, path);
    // return node
    // if(!node.children)
    //   console.log('HAS-NO CHILD:', node.toJSON())
    // const layouts = node.children.filter(el => el.tag == 'layout')
    // console.log(node.attributes.id, '/', node.attributes.name,node.toJSON(), layouts)
    // node.layouts = layouts
    // node.layouts = layouts.map(l => l.attributes)
    // const elLayouts= layouts.map(
    // // const layouts = getLayouts(node).map(
    //   l => `<${l.tag} ${atts(l.attributes)}/>`
    //   // l => `<${l.tag} ${atts(l.attributes)}></${l.tag}>`
    // )
    // const tpl = `<Container ${info(node.attributes)}>\n\t${elLayouts.join('\n\t')}</Container>`
    // console.log(node.attributes.name,tpl)
    // this._Containers.push(tpl);
    this._containers.push(node);
  }

  async layout(node: XmlElement, parent: any, path: string[] = []) {
    await this.traverseChildren(node, node, path);
  }

  async bitmap(node: XmlElement, parent: any, path: string[] = []) {
    this._bitmap[node.id] = node.detach();
  }
  async bitmapFont(node: XmlElement) {
    this._bitmapFont[node.id] = node.detach();
  }

  async component(node: XmlElement) {
    // this._bitmapFont[node.id] = node.detach();
    const alias = guid2alias(node.attributes.param.toLowerCase());
    switch (alias) {
      case "vis":
        // const gui = new Avs(this._uiRoot);
        // // const spec = new XmlElement("dummy", { fitparent: '1' });
        // gui.setXmlAttributes(spec.attributes)
        // this.addChild(gui);
        // this._heldObj = gui;
        // return this.newGui(Avs, node, parent);
        break;
      case "pl":
        node.tag = alias; //PlayListGui
        break;
    }
    //TODO: parse dynamic element by guid value
    // if (
    //   node.attributes.param == "guid:{45F3F7C1-A6F3-4ee6-A15E-125E92FC3F8D}"
    // ) {
    //   await this.buildWasabiButtonFace();
    //   return this.newGui(PlayListGui, node, parent);
    // }
  }

  async script(node: XmlElement, parent: any, path: string[] = []) {
    const { file, id } = node.attributes;
    assert(file != null, "Script element missing `file` attribute");
    if (!this._script[file]) {
      // assert(id != null, "Script element missing `id` attribute");
      // const scriptContents = await this.zip.getFileAsBytes(file);
      // assert(
      //   scriptContents.byteLength > 0,
      //   `ScriptFile file not found at path ${file}`
      // );
      // // TODO: Try catch?
      // const parsedScript = parseMaki(scriptContents, file);
      // this._script[file] = parsedScript;
      this._script[file] = null;
      // console.log('SCRIPT:',file, JSON.stringify(parsedScript))
      // console.log("SCRIPT:", file, parsedScript);
      // node.parsedScript = parsedScript
    } else {
      // const parsedScript = this._script[file];
      // node.parsedScript = structuredClone(parsedScript)
    }
  }

  async groupdef(node: XmlElement, parent: any, path: string[] = []) {
    // node.name = toTitleCase(node.name)
    // await this.traverseChildren(node, node, path);
    const id = node.id;
    // if(this._groupdef.includes(id)) {
    //   throw new Error("groupdef already registered:"+ id);
    // }
    this._groupdef[id] = node;
    if (node.attributes.xuitag) {
      this._xuidef[node.attributes.xuitag] = node;
    }
    node.detach();

    //? find script, etc
    await this.traverseChildren(node, node, path);
  }

  async group(node: XmlElement, parent: any, path: string[] = []) {
    // const groupdef = this._groupdef[node.id];
    // if (!groupdef) {
    //   console.log("failed to get groupdef:", node.id);
    // } else {
    //   node.merge(groupdef.clone());
    // }
    // sometime, group is defined before the groupdef. eg WinampModern566/player.normal.drawer
    this._groupBeta.push(node);
  }

  async triggerAction(sender: GuiObj, action: string, param: string) {
    console.log("WModern: action Triggered:", action, param);
    switch (action) {
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
        this.playlist.next();
        break;
      case "prev":
        this.playlist.previous();
        break;
    }
  }
}

registerSkinEngine(WinampModern);
