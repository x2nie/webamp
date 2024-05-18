import { Component, xml, markup, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useSystem } from "./System";

export class Script extends Component {
  static template = xml`<t t-out="commented()" />`;

  setup(){
    const script = useSystem()
  }

  commented() {
    return markup(`<!-- script:${this.props.node.attributes.file} -->`);
  }
}
registry.category("component").add("script", Script);
