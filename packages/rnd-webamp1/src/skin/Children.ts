import { Component, xml, markup, onMounted, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import './Script'
import './Text'
import './Timer'
import './Map'

export class Children extends Component {
  static template = xml`
    <t t-foreach="mychilds()" t-as="child" t-key="child_index">
      <t t-component="lookup(child.tag)" node="child" t-key="child_index"/>
    </t>`;
  // @<t t-out="child.tag"/> : <t t-out="child.id"/>

  mychilds() {
    const notFound = this.props.children.filter((e) =>
      !registry.category("component").contains(e.tag)
    ).map(e => e.tag);
    if(notFound.length){
      console.log('TAG NOT FOUND:::', [...(new Set(notFound))].join(', '))

    }
    return this.props.children.filter((e) =>
      registry.category("component").contains(e.tag)
    );
  }

  setup() {
    // console.log('children.props=', this.props.children)
    // console.log('children.drens=', this.mychilds())
  }

  lookup(tag: string): typeof Component {
    // console.log('finding component for tag:', tag)
    try {
      //@ts-ignore
      return registry.category("component").get(tag, Nothing) || Nothing;
    } catch {
      console.log("failed to get component:", tag);
      return Nothing;
    }
  }
}

export class Nothing extends Component {
  static template = xml`<t t-out="commented()" />`;

  commented() {
    return markup(`<!-- @${this.props.node.tag} -->`);
    return markup(
      `<!-- @${this.props.node.tag}:${this.props.node.attributes.id} -->`
    );
  }
}

export class Dummy extends Component {
  static template = xml`<span style="color:grey;">
      @<t t-out="props.node.tag"/>#<t t-out="props.node.id"/>
    </span>`;
}
