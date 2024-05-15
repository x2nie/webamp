import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';

export class Layer extends Component {
    static template = xml`
    <div class="layer" t-att-id="att.id" t-att-style="style">
    @<t t-out="att.tag"/> :
      <t t-out="att.id"/>
    <t t-slot="default"/>
    </div>`;

    get att(){
        return this.props.node.attributes
    }
    
    get style() {
        let {  y, x } = this.att;
        return `top:${y}px; left:${x}px; color:fuchsia`;
        // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
        // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
}

registry.category('component').add('layer', Layer)