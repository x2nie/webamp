import Group from "./Group";

export default abstract class XuiElement extends Group {
  __inited: boolean = false;

  _unhandledXuiParams: { key: string; value: string }[] = []; //https://github.com/captbaritone/webamp/pull/1161#discussion_r830527754

  getElTag(): string {
    return "group";
  }

  setXmlAttr(_key: string, value: string): boolean {
    const lowerkey = _key.toLowerCase();
    if (super.setXmlAttr(lowerkey, value)) {
      return true;
    }

    if (this.__inited) {
      for (const systemObject of this._systemObjects) {
        this._uiRoot.vm.dispatch(systemObject, "onsetxuiparam", [
          { type: "STRING", value: _key },
          { type: "STRING", value: value },
        ]);
      }
    } else {
      this._unhandledXuiParams.push({ key: lowerkey, value });
    }
    return true;
  }

  setup() {
    if (this.__inited) return;
    this.__inited = true;

    super.setup();

    for (const systemObject of this._systemObjects) {
      this._unhandledXuiParams.forEach(({ key, value }) => {
        this._uiRoot.vm.dispatch(systemObject, "onsetxuiparam", [
          { type: "STRING", value: key },
          { type: "STRING", value: value },
        ]);
      });
    }
    this._unhandledXuiParams = [];
  }
}
