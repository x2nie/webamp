// This module is imported early here in order to avoid a circular dependency.
import JSZip from "jszip";
import { classResolver } from "./skin/resolver";
import {
  getSkinEngineClass,
  getSkinEngineClassByContent,
  SkinEngine,
} from "./skin/SkinEngine";
import { loadSkin } from "./skin/skinLoader";
import UI_ROOT, { UIRoot } from "./UIRoot";
import { IWebampModern, Options, WebAmpModern } from "./WebampModernInteface";

function hack() {
  // Without this Snowpack will try to treeshake out resolver causing a circular
  // dependency.
  classResolver("A funny joke about why this is needed.");
}

const DEFAULT_OPTIONS: Options = {
  skin: "assets/WinampModern566.wal",
  tracks: [],
};

export class Webamp5 extends WebAmpModern {
  _options: Options;
  _parent: HTMLElement;
  _uiRoot: UIRoot;

  constructor(parent: HTMLElement, options: Options = {}) {
    super(parent, options);
    this._parent = parent || document.body;
    this._options = { ...DEFAULT_OPTIONS, ...options };
    this._uiRoot = new UIRoot();
    this.switchSkin(this._options.skin);
    for (const song of this._options.tracks) {
      UI_ROOT.playlist.enqueuefile(song);
    }
  }

  async switchSkin(skinPath: string) {
    //* getting skin engine is complicated:
    //* SkinEngine is not instanciate during getting skinEngine.
    //* If file extension is know then we loop for registered Engines
    //* But sometime (if its a `.zip` or a path `/`), we need to detect by
    //* if a file exist, with a name is expected by skinEngine

    let skinFetched = false;
    let SkinEngineClass = getSkinEngineClass(skinPath);
    if (SkinEngineClass == null) {
      await this._loadSkinPathToUiroot(skinPath, this._uiRoot);
      SkinEngineClass = getSkinEngineClassByContent(skinPath, this._uiRoot);
    }
    if (SkinEngineClass == null) {
      throw new Error(`Skin not supported`);
    }

    //? success found a skin-engine
    const parser: SkinEngine = new SkinEngineClass();

    // loadSkin(this._parent, skinPath);
  }

  private async _loadSkinPathToUiroot(skinPath: string, uiRoot: UIRoot) {
    const response = await fetch(skinPath);
    // if(response.status != 200){
    //   throw new Error(`Skin not supported`);
    // }
    if (response.headers.get("content-type") == "application/octet-stream") {
      // const response = await fetch(skinPath);
      const skinZipBlob = await response.blob();

      const zip = await JSZip.loadAsync(skinZipBlob);
      uiRoot.setZip(zip);
    } else {
      uiRoot.setZip(null);
      const slash = skinPath.endsWith("/") ? "" : "/";
      uiRoot.setSkinDir(skinPath + slash);
    }
  }

  playSong(songurl: string /* or track */): void {}

  onLogMessage(callback: (message: string) => void) {
    UI_ROOT.on("onlogmessage", callback);
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
