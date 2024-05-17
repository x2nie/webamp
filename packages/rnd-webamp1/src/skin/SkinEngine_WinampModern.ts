import { XmlElement, parseXml, parseXmlFragment } from "@xml/parse-xml";
import { FileExtractor, PathFileExtractor, ZipFileExtractor } from "./FileExtractor";
import { assert, getPngSize, /* assume */ 
    toTitleCase} from "./utils";
import { SkinEngine, registerSkinEngine } from "./SkinEngine";


export class WinampModern extends SkinEngine {
    static supportedFileExt: string[] = ['wal','zip'];
    static uniqueByFile = 'skin.xml'

    // getFileExtractor(skinPath: string): FileExtractor {
    //     if(skinPath.endsWith('/')){
    //       return new PathFileExtractor()
    //     } else {
    //       return new ZipFileExtractor()
    //     }
    // }
    _groupdef: {[key:string]: XmlElement} = {};
    _xuidef: {[key:string]: XmlElement} = {};
    _bitmap: {[key:string]: XmlElement} = {};
    _containers: XmlElement[] = [];

    containers(): XmlElement[] {
        return this._containers
    }

    bitmaps(): {[key:string]: XmlElement} {
        return this._bitmap
    }
  

    async parseSkin() {
        const includedXml = await this.zip.getFileAsString("skin.xml");
        // console.log("skin.xml:", includedXml);
        // Note: Included files don't have a single root node, so we add a synthetic one.
        // A different XML parser library might make this unnessesary.
        const parsed = parseXml(includedXml);
        // console.log('skin.xml=>', parsed)
        await this.traverseChildren(parsed, parsed);
        console.log('FINAL skin.xml=>', parsed)
        await this.loadBitmaps()
    }

    async loadBitmaps(){
        const loadBitmap = async (bitmap:XmlElement) =>{
          const filepath = bitmap.attributes.file;
          const imgBlob = await this.zip.getFileAsBlob(filepath);
          const imgUrl = URL.createObjectURL(imgBlob);
          bitmap.url = imgUrl;
          if(!bitmap.attributes.w || !bitmap.attributes.h){
            const {w,h} = await getPngSize(imgBlob)
            //@ts-ignore
            bitmap.attributes.w = w; bitmap.attributes.h = h;
          }
        }
        return await Promise.all(
          Object.values(this._bitmap).map(loadBitmap)
        );
      }
    
    async traverseChild(node: XmlElement, parent: any, path: string[] = []) {
        const tag = node.tag;
        switch (tag) {
          case "wasabixml":
          case "winampabstractionlayer":
            // return this.traverseChildren(node, parent.parent || parent, path);
    
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
    
          case "bitmap":
            return this.bitmap(node, parent, path);
          case "gammaset":
          
            node.detach(); //? trial to cleanup, to see what the rest
            break
          case "email":
            // debugger;
            break;
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
    const parsed = parseXmlFragment(includedXml).children[0]//.children[0] as XmlElement;
    // debugger
    // console.log('include #3', fileName)
    
    
    // await this.traverseChildren(parsed, parent, [...path, ...directories]);
    // console.log('include #4>', fileName, parsed)
    // debugger
    // const childs = await this.traverseChilds(parsed.children, parent, [...path, ...directories]);
    await this.traverseChilds(parsed.children, parent, [...path, ...directories]);
    const childs = parsed.children.filter(e => !!e.parent)
    // console.log('include #4<', fileName, parsed)
    
    // if(!parsed.children) {
    //   console.log('parsed-HAS-NO CHILD:', parsed.toJSON())
    //   return
    // }
    // console.log('include #4 ==>>', fileName, childs)
    if(!parent || !parent.children) {
      console.log('parent-HAS-NO CHILD:', parent.toJSON())
      return
    }
    // debugger
    // let childrens = parsed  ? parsed.children : 
    
    //? INCLUDE = attach children to parent from other xml file
    if(childs.length == 0) {
      node.detach()
      return;
    };
    let first = true;
    childs.forEach(child => {
      if(!child.parent ) return;//TODO: keep back this. 
      if(child.tag=='include' && child.children.length==0) {
        node.detach()
        return;
      }
      // console.log('include #5~', fileName, child.name, '#', child.toJSON())
      //? replace the <include> with first child
      if(first){
        node.tag = child.tag
        node.attributes = child.attributes;
        node.children = child.children;
        first = false;
      } else {
        if(parent.children)
          parent.children.push(child)
        child.parent = parent
      }
    });
    // for (const _dir of directories) {
    //   this._path.pop();
    // }
    // return node
  }

  async container(node: XmlElement, parent: any, path: string[] = []) {
    node.tag = toTitleCase(node.tag)
    // this._containers.push(node);
    await this.traverseChildren(node, node, path);
    // return node
    // if(!node.children) 
      //   console.log('HAS-NO CHILD:', node.toJSON())
    const layouts = node.children.filter(el => el.tag == 'layout')
    console.log(node.attributes.id, '/', node.attributes.name,node.toJSON(), layouts)
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
    this._bitmap[node.id] = node.detach()
  }
  
  async groupdef(node: XmlElement, parent: any, path: string[] = []) {
    // node.name = toTitleCase(node.name)
    // await this.traverseChildren(node, node, path);
    const id = node.id
    // if(this._groupdef.includes(id)) {
    //   throw new Error("groupdef already registered:"+ id);
    // }
    this._groupdef[id] = node
    if (node.attributes.xuitag) {
      this._xuidef[node.attributes.xuitag] = node;
    }
    node.detach()
    // return node;
  }

  async group(node: XmlElement, parent: any, path: string[] = []) {
    const groupdef = this._groupdef[node.id]
    node.merge(groupdef.clone())
  }
}

registerSkinEngine(WinampModern);