import { Component, xml, onMounted, useEnv, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Children } from "./Children";
import "./Layer";
import "./AnimatedLayer";
import "./Slider";
import "./Vis";
import "./Status";
import { Group } from "./Group";

export class Layout extends Group {
  static GUID = "60906d4e482e537e94cc04b072568861";
  static template = xml`
    <div class="layout" t-att-style="style()">
     <Children children="props.node.children" />
    </div>`;
  // static components = {Children}

  setup() {
    super.setup();
    this.props.node.el = this;
    // console.log(`Layout ${this.att.id} has parent: ${this.props.node.parent.id}`)
  }

  style() {
    let style = super.style();
    if(!this.props.active){
      style += 'display:none;'
    }
    // let { w, h } = this.att;
    // // debugger
    // if (this.att.background) {
    //   // const url = this.env.bitmaps[this.att.image].url
    //   const bitmap = this.env.ui.bitmaps[this.att.background];
    //   const url = bitmap.url;
    //   style += `background:url(${url});`;
    //   if (!w && bitmap.attributes.w) w = bitmap.attributes.w;
    //   if (!h && bitmap.attributes.h) h = bitmap.attributes.h;
    // }
    // style += `width:${w}px; height:${h}px;`;
    return style;
    // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
    // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
  }
}
registry.category("component").add("layout", Layout);
