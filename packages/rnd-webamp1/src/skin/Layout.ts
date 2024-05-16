import { Component, xml, onMounted, useEnv, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { Children } from "./Children";
import './Group'
import './Layer'

export class Layout extends Component {
    static template = xml`
    <div class="layout" t-att-style="style">
    <Children children="props.node.children" />
    </div>`;
    static components = {Children}

    setup() {
        this.env = useEnv()
        console.log(`Layout ${this.att.id} has parent: ${this.props.node.parent.id}`)
    }
    get att(){
        return this.props.node.attributes
    }

    get style() {
        let {  w, h } = this.att;
        // debugger
        let style = ''
        if(this.att.background){
            // const url = this.env.bitmaps[this.att.image].url
            const bitmap = this.env.bitmaps[this.att.background]
            const url = bitmap.url
            style += `background:url(${url});`
            if(!w && bitmap.attributes.w)
                w = bitmap.attributes.w;
            if(!h && bitmap.attributes.h)
                h = bitmap.attributes.h;
        }
        style += `width:${w}px; height:${h}px;`;
        return style
        // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
        // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
}