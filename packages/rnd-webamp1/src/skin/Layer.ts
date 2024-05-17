import { Component, xml, onMounted, useEnv, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { GuiObject } from "./GuiObject";

export class Layer extends GuiObject {
    // @<t t-out="att.tag"/> :
    //   <t t-out="att.id"/>
    // <t t-slot="default"/>
    static template = xml`
    <div class="layer" t-att-id="att.id" t-att-style="style()">
    </div>`;

    // setup() {
    //     this.env = useEnv()
    // }
    // get att(){
    //     return this.props.node.attributes
    // }
    
    style() {
        let style = super.style()
        // let { image } = this.att;
        if(this.att.image){
            // const url = this.env.bitmaps[this.att.image].url
            const bitmap = this.env.ui.bitmaps[this.att.image]
            const url = bitmap.url
            style += `background:url(${url});`
            if(bitmap.attributes.w)
                style += `width:${bitmap.attributes.w}px;`;
            if(bitmap.attributes.h)
                style += `height:${bitmap.attributes.h}px;`;
            
        }
        return style
        // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
        // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
}

registry.category('component').add('layer', Layer)
registry.category('component').add('button', Layer)