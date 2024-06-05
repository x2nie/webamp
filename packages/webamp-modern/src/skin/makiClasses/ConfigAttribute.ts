import { Emitter } from "@lib/Emitter";
import BaseObject from "./BaseObject";
import ConfigItem from "./ConfigItem";
import { xmlRegistry } from "@lib/registry";

export default class ConfigAttribute extends BaseObject {
  static GUID = "24dec2834a36b76e249ecc8c736c6bc4";
  _configItem: ConfigItem;
  _eventListener: Emitter;

  constructor(configItem: ConfigItem, name: string) {
    super();
    this._configItem = configItem;
    this.tag = name;
    this._eventListener = new Emitter();
    // this.on('datachanged', this.ondatachanged.bind(this))
    // this.on('datachanged', this.ondatachanged.bind(this))
  }

  getparentitem(): ConfigItem {
    return this._configItem;
  }
  getAttributeName(): string {
    return this.tag;
  }

  // shortcut of this.Emitter
  on(event: string, callback: Function): Function {
    return this._eventListener.on(event, callback);
  }
  trigger(event: string, ...args: any[]) {
    this._eventListener.trigger(event, ...args);
  }
  off(event: string, callback: Function) {
    this._eventListener.off(event, callback);
  }

  getData(): string {
    // console.log('getData:',this._id, '=',this._configItem.getValue(this._id))
    return this._configItem.getValue(this.tag);
  }
  setData(value: string) {
    // console.log('setData:',this._id, '=',value)
    this._configItem.setValue(this.tag, value);
    this.trigger("onDataChanged");
    // this.ondatachanged();
  }
  onDataChanged() {
    // console.log(' -- triggering onDataChanged...'+ this._id, this._configItem.getValue(this._id))
    // this._configItem._uiRoot.vm.dispatch(this, "ondatachanged");
    this.trigger("onDataChanged");
    // console.log('triggered: onDataChanged.')
  }
}

xmlRegistry.add('config-attribute', ConfigAttribute)