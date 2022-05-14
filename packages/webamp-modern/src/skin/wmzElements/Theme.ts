import UI_ROOT from "../../UIRoot";
import Container from "../makiClasses/Container";
import PRIVATE_CONFIG from "../PrivateConfig";
import MediaCenter from "./MediaCenter";

const WINDOWS_MEDIA_PLAYER = "WindowsMediaPlayer";

// https://docs.microsoft.com/en-us/windows/win32/wmp/theme-element
/**
 * The global singleton object as root component in WindowsMediaPlayer skin
 */
export default class Theme extends Container {
  // I don't know where to put this element
  // For now I put as Container to be easy load/unload during skin switching
  _mediaCenter: MediaCenter;

  constructor(){
      super()
      this._mediaCenter = new MediaCenter()
  }

  get mediaCenter(): MediaCenter {
      return this._mediaCenter;
  }

  savePreference(name: string, value: string) {
    PRIVATE_CONFIG.setPrivateString(WINDOWS_MEDIA_PLAYER, name, value);
  }

  loadPreference(name: string): string {
    return PRIVATE_CONFIG.getPrivateString(WINDOWS_MEDIA_PLAYER, name, "--");
  }
  loadpreference(name: string): string {
      return this.loadPreference(name)
  }

  openView(containerId: string){
      const container= UI_ROOT.findContainer(containerId);
      container.show()
  }
  closeView(containerId: string){
      const container= UI_ROOT.findContainer(containerId);
      container.hide()
  }
}
