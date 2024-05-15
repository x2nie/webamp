import { Component, xml, markup, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class Children extends Component {
  static template = xml`
    <t t-foreach="props.children" t-as="child" t-key="child_index">
      <t t-component="lookup(child.tag)" node="child"/>
    </t>`;
  // @<t t-out="child.tag"/> : <t t-out="child.id"/>

  lookup(tag: string): Component {
    //@ts-ignore
    return registry.category("component").get(tag, Nothing) || Dummy;
  }
}

export class Nothing extends Component {
  static template = xml`<t t-out="commented()" />`;

  commented() {
    return markup(`<!-- @${this.props.node.tag}:${this.props.node.attributes.id} -->`)
  }
}

export class Dummy extends Component {
  static template = xml`<span style="color:grey;">
      @<t t-out="props.node.tag"/>#<t t-out="props.node.id"/>
    </span>`;
}
