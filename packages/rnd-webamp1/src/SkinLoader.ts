import { XmlDocument, XmlElement, XmlNode, parseXml } from "@rgrove/parse-xml";
import { FileExtractor, ZipFileExtractor } from "./FileExtractor";
import { assert, /* , getCaseInsensitiveFile, assume */ 
toTitleCase} from "./utils";

export class SkinLoader {
  _path: string[] = [];
  _containers: XmlElement[] = [];
  fileExtractor: FileExtractor;
  async loadSkin(skinPath: string) {
    let response: Response;
    this.fileExtractor = new ZipFileExtractor();

    response = await fetch(skinPath);
    await this.fileExtractor.prepare(skinPath, response);
    await this.parseSkin();
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
    await this.traverseChildren(parsed);
  }

  async traverseChildren(
    node: XmlElement,
    parent: any = null,
    path: string[] = []
  ) {
    //? NOTE: I am considering to speedup resource loading by Promise.all
    //? But in the same time we need to reduce code complexity
    //? So, we do Promise.all only on resource loading phase.

    // if (this._phase == RESOURCE_PHASE) {
    return await Promise.all(
      node.children.map((child) => {
        if (child instanceof XmlElement) {
          // console.log('traverse->', parent.name, child.name)
          // this._scanRes(child);
          return this.traverseChild(child, parent, path);
        }
      })
    );
    // } else {
    //   for (const child of node.children) {
    //     if (child instanceof XmlElement) {
    //       this._scanRes(child);
    //       await this.traverseChild(child, parent);
    //     }
    //   }
    // }
  }

  async traverseChild(node: XmlElement, parent: any, path: string[] = []) {
    const tag = node.name.toLowerCase();
    switch (tag) {
      case "wasabixml":
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
    console.log(filepath, ":", (includedXml || "").length, "chars");

    // Note: Included files don't have a single root node, so we add a synthetic one.
    // A different XML parser library might make this unnessesary.
    const parsed = parseXmlFragment(includedXml);

    await this.traverseChildren(parsed, parent, [...path, ...directories]);

    // for (const _dir of directories) {
    //   this._path.pop();
    // }
  }

  async container(node: XmlElement, parent: any, path: string[] = []) {
    node.name = toTitleCase(node.name)
    this._containers.push(node);
    await this.traverseChildren(node, node, path);
    console.log(node.toJSON())
  }

  async layout(node: XmlElement, parent: any, path: string[] = []) {
    node.name = toTitleCase(node.name)
    // this._containers.push(node);
    // await this.traverseChildren(node, node, path);
  }
}

function parseXmlFragment(xml: string): XmlElement {
  // Note: Included files don't have a single root node, so we add a synthetic one.
  // A different XML parser library might make this unnessesary.
  return parseXml(`<wrapper>${xml}</wrapper>`) as unknown as XmlElement;
}
