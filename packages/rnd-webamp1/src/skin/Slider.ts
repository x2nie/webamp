import { xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { GuiObject } from "./GuiObject";

export class Slider extends GuiObject {
  static GUID = "62b65e3f408d375e8176ea8d771bb94a";
  static ID = "{62B65E3F-375E-408D-8DEA-76814AB91B77}";
  static template = xml`<div class="slider layer dummy" tag="slider" style="style()"/>`;

  
  public setPosition(pos: number) {}

  public getPosition(): number { return 0}

  // locks descendant core collbacks
  public lock() {}

  // unloads them
  public unlock() {}

  // events binding ---------------
  
  // onSetPosition(newpos: number) {}

  // onPostedPosition(newpos: number) {}

  // onSetFinalPosition(pos: number) {}


} // slider

registry.category("component").add("slider", Slider);
