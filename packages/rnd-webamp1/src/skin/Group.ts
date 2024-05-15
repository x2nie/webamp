import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { Children } from "./Children";

export class Group extends Component {
    static template = xml`
    <div class="group" t-att-id="att.id" t-att-style="style">
        <Children children="props.node.children" />
    </div>`;
    // @<t t-out="att.tag"/> :
    //   <t t-out="att.id"/>
    // <t t-slot="default"/>
    static components = { Children}

    get att(){
        return this.props.node.attributes
    }
    
    get style() {
        let { width, height, y, x } = this.att;
        return `top:${y}px; left:${x}px;`;
        // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
        // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
}

registry.category('component').add('group', Group)