import GuiObj from "./GuiObj";

export default class Vis extends GuiObj {
  static GUID = "ce4f97be4e1977b098d45699276cc933";
  setmode(mode: number) {
    // TODO
  }
  setxmlparam(key: string, value: string) {
    this.setXmlAttr(key, value);
  }

  /*extern Vis.onFrame();
extern Vis.setRealtime(Boolean onoff);
extern Boolean Vis.getRealtime();
extern Int Vis.getMode();
extern Vis.nextMode();*/
}
