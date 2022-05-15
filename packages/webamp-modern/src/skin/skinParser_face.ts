import JSZip from "jszip";
import UI_ROOT, { UIRoot } from "../UIRoot";
import SkinParser, { GROUP_PHASE, RESOURCE_PHASE } from "./parse";

export default class AudionFaceSkinParser extends SkinParser {
  _config: {};

  constructor(uiRoot: UIRoot) {
    super(uiRoot);
  }

  async parse(): Promise<UIRoot> {
    console.log("RESOURCE_PHASE #################");
    this._phase = RESOURCE_PHASE;

    const configContent = await this._uiRoot.getFileAsString("index.json");

    this._config = JSON.parse(configContent);

    // await this.traverseChildren(parsed);
    await this.loadKnowBitmaps();

    await this._loadBitmaps();

    console.log("GROUP_PHASE #################");
    this._phase = GROUP_PHASE;
    // await this.traverseChildren(parsed);


    return this._uiRoot;
  }

  

  async loadKnowBitmaps() {
    await this._loadBitmap('playButton')
  }

  async _loadBitmap(name:string) {
    const rect = this._config[`${name}Rect`]

  }
}

/*
timeDigit4FirstPICTID
*/
