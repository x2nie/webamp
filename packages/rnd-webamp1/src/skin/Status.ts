import { xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { GuiObject } from "./GuiObject";

export class Status extends GuiObject {
  static GUID = "0f08c9404b23af39c4b8f38059bb7e8f";
  static ID = "{0F08C940-AF39-4B23-80F3-B8C48F7EBB59}";
  static template = xml`<div class="status layer dummy" tag="status" style="style()"/>`;

  
  // events binding ---------------
  

} // status

registry.category("component").add("status", Status);
