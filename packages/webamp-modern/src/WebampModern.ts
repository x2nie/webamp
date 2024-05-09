// This module is imported early here in order to avoid a circular dependency.
import JSZip from "jszip";
import {
  FileExtractor,
  PathFileExtractor,
  ZipFileExtractor,
} from "./skin/FileExtractor";
// import { classResolver } from "./skin/resolver";
import {
  getSkinEngineClass,
  getSkinEngineClassByContent,
  SkinEngine,
} from "./skin/SkinEngine";
import { Skin, UIRoot } from "./UIRoot";
import { IWebampModern, Options, WebAmpModern } from "./WebampModernInteface";

// function hack() {
//   // Without this Snowpack will try to treeshake out resolver causing a circular
//   // dependency.
//   classResolver("A funny joke about why this is needed.");
// }

const DEFAULT_OPTIONS: Options = {
  skin: "assets/WinampModern566.wal",
  tracks: [],
};

let DIV_UNIQUER = 0; // for CSS unique, avoid interferer with other webamp instance

export class Webamp5 extends WebAmpModern {
  _options: Options;
  _parent: HTMLElement;
  _uiRoot: UIRoot;

  constructor(parent: HTMLElement, options: Options = {}) {
    super(parent, options);
    this._parent = parent || document.body;
    this._options = { ...DEFAULT_OPTIONS, ...options };
    DIV_UNIQUER++;
    this._uiRoot = new UIRoot(`ui-root-${DIV_UNIQUER}`);
    parent.appendChild(this._uiRoot.getRootDiv());
    this.switchSkin(this._options.skin);
    for (const song of this._options.tracks) {
      this._uiRoot.playlist.enqueuefile(song);
    }
  }

  setSkins(skins: Skin[]){
    this._uiRoot._skins = skins
  }
  addSkins(skin: Skin){
    this._uiRoot._skins.push(skin)
  }

  async switchSkin(skinPath: string) {
    await this._uiRoot.switchSkin(skinPath)
    // this._parent.appendChild(this._uiRoot.getRootDiv());
  }

  playSong(songurl: string /* or track */): void {}

  onLogMessage(callback: (message: string) => void) {
    this._uiRoot.on("onlogmessage", callback);
  }
}

declare global {
  interface Window {
    WebampModern: typeof WebAmpModern;
  }
}

// just copied from webamp classic
async function main() {
  window.WebampModern = Webamp5;
}
main();
