import { uiRegistry } from "@lib/registry";
import { Component, markup, xml } from "@odoo/owl";

export default class Children extends Component {
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

export class UI extends Component {
  static template = "ui";
  // static template0 = xml`
  // <t t-tag="props.node.tag" t-att-id="props.node.getId()" t-att-class="getCssClass()" t-att-style="style()">
  //  <Children children="props.node.children" />
  // </t>`;
  static components = { Children };

  setup() {
    this.props.node.el = this;
  }
  get att() {
    return this.props.node.attributes;
  }
  nodeChildren() {
    const notFound = this.props.node.children
      .filter((e) => !uiRegistry.contains(e.tag))
      .map((e) => e.tag);
    if (notFound.length) {
      console.log("TAG NOT FOUND:::", [...new Set(notFound)].join(", "));
    }
    return this.props.node.children.filter((e) => uiRegistry.contains(e.tag));
  }

  lookupTag(tag: string): typeof Component {
    // console.log('finding component for tag:', tag)
    try {
      //ts-ignore
      return uiRegistry.get(tag, Nothing) || Nothing;
    } catch {
      console.log("failed to get component:", tag);
      return Nothing;
    }
  }

  getCssClass() {
    return this.props.node ? this.props.node.tag : "unknown-tag";
  }
  style() {
    let { x, y, w, h, alpha, visible } = this.att;
    let style = ""; //`top:${y}px; left:${x}px; color:fuchsia;`;
    if (x != null) style += `left:${x}px;`;
    if (y != null) style += `top:${y}px;`;
    if (w != null) style += `width:${w}px;`;
    if (h != null) style += `height:${h}px;`;
    if (alpha != null && alpha < 255) style += `opacity:${alpha / 255};`;
    // if (visible != null && !visible) style += `display:none;`;
    return style;
  }
}

export class Nothing extends Component {
  static template = xml`<t t-out="commented()" />`;

  commented() {
    return markup(`<!-- @ -->`);
    return markup(`<!-- @${this.props.node.tag} -->`);
    return markup(
      `<!-- @${this.props.node.tag}:${this.props.node.attributes.id} -->`
    );
  }
}
