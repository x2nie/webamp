import { xmlRegistry } from "@lib/registry";
import { UIRoot } from "../../UIRoot";
import BaseObject from "./BaseObject";
// import { CONFIG } from "./Config";
import ConfigItem from "./ConfigItem";

const _items: { [key: string]: ConfigItem } = {};

export default class WinampConfig extends BaseObject {
  static GUID = "b2ad3f2b4e3131ed95e96dbcbb55d51c";
  _uiRoot: UIRoot;
  // _items : {[key:string]: ConfigItem} = {};

  // constructor(uiRoot: UIRoot) {
  //   super();
  //   this._uiRoot = uiRoot;
  // }

  getGroup(config_group_guid: string): WinampConfigGroup {
    const cfg = this._uiRoot.CONFIG.getitembyguid(config_group_guid);
    return new WinampConfigGroup(cfg);
  }
}
xmlRegistry.add('winamp-config', WinampConfig)

export class WinampConfigGroup {
  static GUID = "fc17844e4518c72bf9a868a080baa530";
  _cfg: ConfigItem;
  _uiRoot: UIRoot;

  constructor(cfg: ConfigItem) {
    this._cfg = cfg;
  }

  getString(itemName: string): string {
    return this._cfg.getValue(itemName);
  }

  getBool(itemName: string): boolean {
    return this.getString(itemName) == "1" ? true : false;
  }

  getInt(itemName: string): number {
    return parseInt(this.getString(itemName) || "0");
  }

  setString(itemName: string, itemValue: string) {
    //TODO: integrate with ConfigAttribute, so changing value will trigger onchanged.
    this._cfg.setValue(itemName, itemValue);
  }

  setBool(itemName: string, itemValue: boolean) {
    this._cfg.setValue(itemName, itemValue ? "1" : "0");
  }

  setInt(itemName: string) {
    //WRONG API?
  }
}
xmlRegistry.add('winamp-config-group', WinampConfigGroup)

// Global Singleton
// export const WINAMP_CONFIG: WinampConfig = new WinampConfig();
