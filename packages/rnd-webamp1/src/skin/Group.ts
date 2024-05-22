import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Children } from "./Children";
import { GuiObject } from "./GuiObject";
// import { Script } from "./Script";
// import { Text } from "./Text";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Cgroup.2F.3E
export class Group extends GuiObject {
  static GUID = "45be95e5419120725fbb5c93fd17f1f9";
  static template = xml`
    <div class="group" t-att-id="att.id" t-att-style="style()">
        <Children children="props.node.children" />
    </div>`;
  // @<t t-out="att.tag"/> :
  //   <t t-out="att.id"/>
  // <t t-slot="default"/>
  static components = { Children };

  // get att(){
  //     return this.props.node.attributes
  // }

  style() {
    let style = super.style();
    if (this.att.background) {
      // const url = this.env.bitmaps[this.att.image].url
      const bitmap = this.env.ui.bitmaps[this.att.background];
      const url = bitmap.url;
      style += `background:url(${url});`;
      if(this.att.w==null || this.att.h==null){
        if(bitmap.attributes.w==null || bitmap.attributes.h==null){
          const img = new Image();
          img.addEventListener("load", () => {
            this.att.w = img.width
            this.att.h = img.height
          });
          img.addEventListener("error", () => {
            console.warn(`cant load empty image: ${this.att.image}. ::`, url);
            
          });
          // img.src = `url(${url})`
          img.src = url
        }

        
        if (bitmap.attributes.w) style += `width:${bitmap.attributes.w}px;`;
        if (bitmap.attributes.h) style += `height:${bitmap.attributes.h}px;`;
      }
      if (bitmap.attributes.x)
        style += `background-position-x:${bitmap.attributes.x}px;`;
      if (bitmap.attributes.y)
        style += `background-position-y:${bitmap.attributes.y}px;`;
    }
    return style
  //     let { width, height, y, x } = this.att;
  //     return `top:${y}px; left:${x}px;`;
  //     // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
  //     // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
  }

  getObject(object_id: string): GuiObject {
    return this.findObject(object_id)!
  }

  findObject(objectId: string): GuiObject | null {
    const lower = objectId.toLowerCase();
    for (const obj of this.children) {
      if (obj.attributes.id === lower) {
        return obj.el;
      }
      if (obj.el instanceof Group) {
        const found = obj.el.findObject(objectId);
        if (found != null) {
          return found;
        }
      }
    }
    return null;
  }
}

registry.category("component").add("group", Group);
