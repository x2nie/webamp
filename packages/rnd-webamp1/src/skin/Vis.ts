import { xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { GuiObject } from "./GuiObject";

export class Vis extends GuiObject {
  static GUID = "ce4f97be4e1977b098d45699276cc933";
  static ID = "{CE4F97BE-77B0-4E19-9956-D49833C96C27}";
  static template = xml`<div class="vis layer dummy" tag="vis" style="style()"/>`;

  
  public setRealtime(onoff: boolean) {}

  public getRealtime(): boolean {}

  public getMode(): number {}

  public setMode(mode: number) {}

  // Browser
  public nextMode() {}

  // events binding ---------------
  
  // onFrame() {}


} // vis

registry.category("component").add("vis", Vis);
