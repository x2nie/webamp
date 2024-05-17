// -----------------------------------------------------------------------------
// Skin Engine
// -----------------------------------------------------------------------------

import { XmlElement } from "@xml/parse-xml";
import {
  FileExtractor,
  PathFileExtractor,
  ZipFileExtractor,
} from "./FileExtractor";

export class SkinEngine {
  /**
   * Useful for quick detect by file extension
   * @param filePath full file address or URL
   * @returns True if this skin engine can parse the skin
   */
  static supportedFileExt: string[] = [];

  /**
   * In case the skin can't be detected by file extension,
   * let detect by whether one file name is found
   * @param filePath file name url
   * @returns file name or file extension
   */
  static uniqueByFile = "";


  /**
   * Provide your custom (binary-file) skin format extractor.
   * * keep it to return null if your skin is zip-like file.
   * @returns An instance of custom FileExtractor
   */
  // getFileExtractor(skinPath: string): FileExtractor {
  //   //@ts-ignore
  //   return null;
  //   // if(skinPath.endsWith('/')){
  //   //   this.zip = new PathFileExtractor()
  //   // } else {
  //   //   this.zip = new ZipFileExtractor()
  //   // }
  // }

  constructor(protected skinPath: string) {}
  protected zip : FileExtractor;

  /**
   * Check Wether this skin-engine can continue working with skin/filePath
   * @returns
   */
  public async init(): Promise<boolean> {
    const mustExistFileName = (this.constructor as SkinEngineClass)
      .uniqueByFile;
    this.zip = await this.initSkinExtractor();
    return (
      this.zip &&
      (!mustExistFileName ||
        !!(await this.zip.getFileAsBytes(mustExistFileName)).byteLength)
    );
  }

  async initSkinExtractor(): Promise<FileExtractor> {
    let zip: FileExtractor;
    if (this.skinPath.endsWith("/")) {
      zip = new PathFileExtractor();
    } else {
      zip = new ZipFileExtractor();
    }
    await zip.prepare(this.skinPath);
    return zip;
  }

  public async parseSkin() {
    // return new XmlElement();
  }

  public containers(): XmlElement[] {
    return [];
  }
  bitmaps(): {[key:string]: XmlElement} {
    return {}
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
    return await this.traverseChilds(node.children, parent, path);
  }

  async traverseChilds(nodes: XmlElement[], parent: any, path: string[] = []) {
    // const elements = nodes.filter(el => el instanceof XmlElement)
    //? we need to copy the array, to avoid conflicting when they are added to parent
    const elements = [...nodes]
    // const elements = [...nodes.filter(el => el instanceof XmlElement)]

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
    // }
    // return elements.filter(e => !!e.parent)
  }
  async traverseChild(node: XmlElement, parent: any, path: string[] = []) {
    const tag = node.tag;
    switch (tag) {
      case "wrapper":
        return this.traverseChildren(node, parent, path);
      default:
        break;
    }
  }

}

// -----------------------------------------------------------------------------
// Skin Engines Managements
// -----------------------------------------------------------------------------

export type SkinEngineClass = typeof SkinEngine;
const SKIN_ENGINES: SkinEngineClass[] = [];

export const registerSkinEngine = (Engine: SkinEngineClass) => {
  // if(SKIN_ENGINES.includes(Engine)){
  //   delete SKIN_ENGINES[Engine]
  // }
  SKIN_ENGINES.push(Engine);
};

export async function getSkinEngineClassesFor(
  filePath: string
): Promise<SkinEngineClass[]> {
  const result: SkinEngineClass[] = [];

  //? #1 take care of path/dirlist: ask if a file exists
  if (filePath.endsWith("/")) {
    for (const Engine of SKIN_ENGINES) {
      const mustExistFileName = Engine.uniqueByFile;
      if (mustExistFileName) {
        //may return null
        const response = await fetch(filePath + mustExistFileName);
        if (response.status == 200) {
          return [Engine];
        }
      }
    }
  }

  //? #2 ask by filename extension
  const ext = filePath.split(".").pop() || "";
  for (const Engine of SKIN_ENGINES) {
    if (Engine.supportedFileExt.includes(ext)) {
      result.push(Engine);
    }
  }
  return result;
}

export async function createSkinEngineFor(
  skinPath: string
): Promise<SkinEngine> {
  const classes: SkinEngineClass[] = await getSkinEngineClassesFor(skinPath);

  for (let i = 0; i < classes.length; i++) {
    const EngineClass = classes[i];
    try {
      const engine = new EngineClass(skinPath);
      if (await engine.init()) return engine;
    } catch {}
  }
  return new SkinEngine(skinPath); // default
}

/* export async function getSkinEngineClassFor0(
  filePath: string
): Promise<SkinEngine> {
  const result: SkinEngineClass[] = [];

  //? #1 take care of path/dirlist: ask if a file exists
  if (filePath.endsWith("/")) {
    for (const Engine of SKIN_ENGINES) {
      const aFileName = Engine.uniqueByFile;
      if (aFileName) {
        //may return null
        const response = await fetch(filePath + aFileName);
        if (response.status == 200) {
          return [Engine];
        }
      }
    }
  }

  //? #2 ask by filename extension
  const ext = filePath.split('.').pop() || ''
  for (const Engine of SKIN_ENGINES) {
    if (Engine.supportedFileExt.includes(ext)) {
      result.push(Engine);
    }
  }
  return result;
} */
