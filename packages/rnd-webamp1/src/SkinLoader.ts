import { XmlDocument, XmlElement, XmlNode, parseXml } from "@rgrove/parse-xml";
import { FileExtractor, ZipFileExtractor } from "./FileExtractor";
import { assert, /* , getCaseInsensitiveFile, assume */ 
toTitleCase} from "./utils";

export class SkinLoader {
  _path: string[] = [];
  _containers: string[] = [];
  fileExtractor: FileExtractor;
  async loadSkin(skinPath: string) {
    let response: Response;
    this.fileExtractor = new ZipFileExtractor();

    response = await fetch(skinPath);
    await this.fileExtractor.prepare(skinPath, response);
    await this.parseSkin();
    // const tpl = this._containers.join('\n')
    //   console.log('FINAL-TPL---------------------------\n', tpl)
  }

  // async getFileAsString(path):string {
  //   return this.fileExtractor.getFileAsString(path)
  // }

  /**
   * Process
   */
  async parseSkin() {
    const includedXml = await this.fileExtractor.getFileAsString("skin.xml");
    console.log("skin.xml:", includedXml);
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXml(includedXml) as unknown as XmlElement;
    await this.traverseChildren(parsed, parsed);
  }

  async traverseChildren(
    node: XmlElement,
    parent: any = null,
    path: string[] = []
  ) {
    //? NOTE: I am considering to speedup resource loading by Promise.all
    //? But in the same time we need to reduce code complexity
    //? So, we do Promise.all only on resource loading phase.

    if(!node.children) {
      console.log('HAS-NO CHILD:travn', node.toJSON())
      return
    }
    const elements = node.children.filter(el => el instanceof XmlElement)
    node.children = elements;

    // return await Promise.all(
    //   elements.map((child) => this.traverseChild(child as XmlElement, parent, path))
    // );

    // if (this._phase == RESOURCE_PHASE) {
    // return await Promise.all(
    //   node.children.map((child) => {
    //     if (child instanceof XmlElement) {
    //       // console.log('traverse->', parent.name, child.name)
    //       // this._scanRes(child);
    //       return this.traverseChild(child, parent, path);
    //     }
    //   })
    // );
    // } else {
      for (const child of node.children) {
        if (child instanceof XmlElement) {
          // this._scanRes(child);
          await this.traverseChild(child, parent, path);
        }
      }
    // }
  }

  async traverseChilds(nodes: XmlElement[], parent: any, path: string[] = []) {
    const elements = nodes.filter(el => el instanceof XmlElement)

    // return await Promise.all(
    //   elements.map((child) => this.traverseChild(child as XmlElement, parent, path))
    // );

    // if (this._phase == RESOURCE_PHASE) {
    // return await Promise.all(
    //   node.children.map((child) => {
    //     if (child instanceof XmlElement) {
    //       // console.log('traverse->', parent.name, child.name)
    //       // this._scanRes(child);
    //       return this.traverseChild(child, parent, path);
    //     }
    //   })
    // );
    // } else {
      for (const child of elements) {
        // if (child instanceof XmlElement) {
          // this._scanRes(child);
          await this.traverseChild(child, parent, path);
        // }
      }
      return elements
    // }
  }
  async traverseChild(node: XmlElement, parent: any, path: string[] = []) {
    const tag = node.name.toLowerCase();
    switch (tag) {
      case "wasabixml":
      case "elements":
      case "winampabstractionlayer":
        return this.traverseChildren(node, parent, path);
      // case "albumart":
      // return this.albumart(node, parent);
      case "include":
        return this.include(node, parent, path);
      // Note: Included files don't have a single root node, so we add a synthetic one.
      // A different XML parser library might make this unnessesary.
      case "wrapper":
        return this.traverseChildren(node, parent, path);
      case "container":
        return this.container(node, parent, path);
      case "layout":
        return this.layout(node, parent, path);
    }
  }

  async include(node: XmlElement, parent: any, path: string[] = []) {
    const { file } = node.attributes;
    // console.log('loading incl:', file, '@', path)
    assert(file != null, "Include element missing `file` attribute");

    // debugger
    const directories = file.split("/");
    const fileName = directories.pop();

    // for (const dir of directories) {
    //   this._path.push(dir);
    // }

    const filepath = [...path, ...directories, fileName].join("/");

    // if (zipFile == null) {
    //   console.warn(`Zip file not found: ${path} out of: `);
    //   return;
    // }
    const includedXml = await this.fileExtractor.getFileAsString(filepath);
    // console.log(filepath, ":", (includedXml || "").length, "chars");

    // console.log('include #2', fileName)
    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXmlFragment(includedXml)//.children[0] as XmlElement;
    // debugger
    // console.log('include #3', fileName)
    
    
    // await this.traverseChildren(parsed, parent, [...path, ...directories]);
    // console.log('include #4>', fileName, parsed)
    // debugger
    const childs = await this.traverseChilds(parsed.children[0].children, parent, [...path, ...directories]);
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
    
    let replaced = false;
    childs.forEach(child => {
      // console.log('include #5~', fileName, child.name, '#', child.toJSON())
      if(!replaced){
        node.name = child.name
        node.attributes = child.attributes;
        node.children = child.children;
        replaced = true;
      } else {
        if(parent.children)
          parent.children.push(child)
      }
      child.parent = parent
    });
    // for (const _dir of directories) {
    //   this._path.pop();
    // }
    // return node
  }

  async container(node: XmlElement, parent: any, path: string[] = []) {
    node.name = toTitleCase(node.name)
    // this._containers.push(node);
    await this.traverseChildren(node, node, path);
    console.log(node.attributes.name,node.toJSON())
    // return node
    // if(!node.children) 
    //   console.log('HAS-NO CHILD:', node.toJSON())
    const layouts = node.children.filter(el => el.name == 'layout').map(
    // const layouts = getLayouts(node).map(
      l => `<${l.name} ${atts(l.attributes)}/>`
      // l => `<${l.name} ${atts(l.attributes)}></${l.name}>`
    )
    const tpl = `<Container ${info(node.attributes)}>\n\t${layouts.join('\n\t')}</Container>`
    // console.log(node.attributes.name,tpl)
    this._containers.push(tpl);
  }
  
  async layout(node: XmlElement, parent: any, path: string[] = []) {
    // node.name = toTitleCase(node.name)
    await this.traverseChildren(node, node, path);
    // return node;
  }
}

function parseXmlFragment(xml: string): XmlElement {
  // Note: Included files don't have a single root node, so we add a synthetic one.
  // A different XML parser library might make this unnessesary.
  return parseXml(`<wrapper>${xml}</wrapper>`) as unknown as XmlElement;
}

function info(attributes:{[attrName: string]: string}):string{
  const def = {
    id: attributes.id,
    x: attributes['default_x'] || Math.round(Math.random() * (window.innerWidth - 50)),
    y: attributes['default_y'] || Math.round(Math.random() * (window.innerWidth - 50)),
    width: 150,
    height: 50,
  }
  return `info="${JSON.stringify(def).replaceAll('"', "'")}"`
}
function atts(attributes:{[attrName: string]: string}):string{
  // return `id="'${attributes.id}'" info=`
  const result:string[] = []
  for(const [k,v] of Object.entries(attributes)){
    if(k=='component') continue
    result.push(`${k}="${v}"`)
  }
  return result.join(' ')
}

function getLayouts(node:XmlElement): XmlElement[] {
  const ret = []
  const recursive = (n:XmlElement) =>{
    if(n.name=='layout') {
      ret.push(n)
    } else if(n.children) {
      n.children.forEach(c => recursive(c))
    }
  }
  recursive(node)
  return ret
}