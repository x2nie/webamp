import { xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Object_ } from "./Object";

function api(a,b){/** */}

export class Map extends Object_ {
  static GUID = "3860366542a7461b3fd875aa73bf6766";
  static ID_ = "{38603665461B42A7AA75D83F6667BF73}";
  static ID = "{38603665-461B-42A7-AA75-D83F6667BF73}";
  static template = xml`<div class="map layer dummy" tag="map" style="style()"/>`;

  getValue(x: number, y: number): number {
    return 0
  }

  public getARGBValue(x: number, y: number, channel: number): number {}

  public inRegion(x: number, y: number): boolean {}

  public loadMap(bitmapid: string) {}

  public getWidth(): number {}

  public getHeight(): number {}

  // PopupMenu
  public getRegion(): Region {}

  // events binding ---------------
  

} // map

registry.category("component").add("map", Map);
