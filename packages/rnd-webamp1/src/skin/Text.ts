import { Component, xml, markup, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { GuiObject } from "./GuiObject";

export class Text extends GuiObject {
  static GUID = "0f08c9404b23af39c4b8f38059bb7e8f";
  static template = xml`<span t-out="att.text" t-att-style="style()" />`;

  style() {
    // let {  w, h } = this.att;
    // debugger
    let style = super.style();
    style +=
      "background:yellow; color:blue;font-size:11px;font-family:monospace;";
    style += "font-size:12px;font-family:monospace;line-height:1;";
    return style;
  }

  get text() {
    debugger;
    return this.att.text;
  }

  setText(value: string) {
    this.att.text = value;
  }
}
registry.category("component").add("text", Text);
