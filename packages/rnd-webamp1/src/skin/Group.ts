import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { Children } from "./Children";
import { GuiObject } from "./GuiObject";
import { Script } from "./Script";
import { Text } from "./Text";

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
    static components = { Children, Script, Text}

    // get att(){
    //     return this.props.node.attributes
    // }
    
    // get style() {
    //     let { width, height, y, x } = this.att;
    //     return `top:${y}px; left:${x}px;`;
    //     // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
    //     // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    // }

    findObject(objectId: string): GuiObject | null {
        const lower = objectId.toLowerCase();
        for (const obj of this.children) {
          if (obj.id === lower) {
            return obj.el;
          }
          if (obj.el instanceof Group) {
            const found = obj.el.findobject(objectId);
            if (found != null) {
              return found;
            }
          }
        }
        return null;
    }
}

registry.category('component').add('group', Group)