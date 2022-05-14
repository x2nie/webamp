import UI_ROOT from "../../UIRoot";
import { AUDIO_PAUSED, AUDIO_PLAYING, AUDIO_STOPPED } from "../AudioPlayer";
import GuiObj from "../makiClasses/GuiObj";

export default class Player extends GuiObj {
  //

  constructor() {
    super();
    this.setXmlAttr("visible", "0");
    // Within script code, the Player object is accessed through the player global attribute rather than
    // through a name specified by an id attribute, which is not supported by the PLAYER element.
    this.setXmlAttr("id", "player");
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(_key, value)) {
      return true;
    }

    switch (key) {
      case "backgroundcolor":
        break;
      default:
        return false;
    }
    return true;
  }

  //? WMP things ============================
  get playState(): number {
    // taken from QuickSilver.wmz
    switch (UI_ROOT.audio.getState()) {
      // case 0:		//undefined
      case AUDIO_STOPPED:
        return 1;
      case AUDIO_PAUSED:
        return 2;
      case AUDIO_PLAYING:
        return 3;
      // case 6: //buffering
      //   break;
      // case 7: //waiting
      //   break;
      // case 8: //media ended
      //   break;
      // case 9: //Transitioning
      //   break;
      // case 10: //Ready
      //   break;
    }
  }
}
