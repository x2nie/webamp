import { uiRegistry } from "@lib/registry";
import { Component, markup, xml } from "@odoo/owl";
export { UI } from "./makiClasses/GuiObj";
import { Nothing } from "./makiClasses/GuiObj";

export class Children0 extends Component {
  static template = xml`
    <t t-foreach="mychilds()" t-as="child" t-key="child_index" t-if="props.children.length">
      <t t-component="lookup(child.tag)" node="child" />
    </t>`;

  mychilds() {
    const notFound = this.props.children
      .filter((e) => !uiRegistry.contains(e.tag))
      .map((e) => e.tag);
    if (notFound.length) {
      console.log("TAG NOT FOUND:::", [...new Set(notFound)].join(", "));
    }
    return this.props.children.filter((e) => uiRegistry.contains(e.tag));
  }

  lookup(tag: string): typeof Component {
    // console.log('finding component for tag:', tag)
    try {
      //ts-ignore
      return uiRegistry.get(tag, Nothing) || Nothing;
    } catch {
      console.log("failed to get component:", tag);
      return Nothing;
    }
  }
}
