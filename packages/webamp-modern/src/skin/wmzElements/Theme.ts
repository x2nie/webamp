import Container from "../makiClasses/Container";
import PRIVATE_CONFIG from "../PrivateConfig";

const WINDOWS_MEDIA_PLAYER = "WindowsMediaPlayer";

export default class Theme extends Container {
  //

  savePreference(name: string, value: string) {
    //sample: theme.savePreference("videoViewOn","false");

    PRIVATE_CONFIG.setPrivateString(WINDOWS_MEDIA_PLAYER, name, value);
  }

  loadPreference(name: string): string {
    return PRIVATE_CONFIG.getPrivateString(WINDOWS_MEDIA_PLAYER, name, "");
  }
}
