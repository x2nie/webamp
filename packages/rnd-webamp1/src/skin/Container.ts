// -----------------------------------------------------------------------------
// Generic Container Component
// -----------------------------------------------------------------------------

import { Component, xml, onMounted, useRef, useSubEnv } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { WindowManager, useWindowService } from "./WindowManager";
import { Layout } from "./Layout";
import { Object_ } from "./Object";

export class Container extends Object_ {
  static GUID = "e90dc47b4ae7840d0b042cb0fcf775d2";
  static template = xml`
    <div t-att-id="att.id" t-name="Container" t-att-class="{window: true, invisible: !att.visible}" 
      t-on-mousedown="mouseDown"
      t-att-style="style" 
      t-on-dblclick="toggleLayout" t-ref="root">
      <t t-foreach="layouts()" t-as="l" t-key="l.attributes.id">
        <Layout active="l.attributes.id == att.layout_id" node="l"/>
      </t>
    </div>`;
  // <t t-esc="props.node.title"/> -
  static components = { Layout };
  static nextZIndex = 1;

  zIndex = 1;
  // windowService: any;
  root: any;

  setup() {
    // console.log('container.node==', this.props.node)
    // this.windowService = useWindowService();
    this.props.node.el = this;

    useSubEnv({
      //? additional env, isolated for this instance and children
      container: this, //? usefull for later System calls
    });

    this.root = useRef("root");
    onMounted(() => {
      this.updateZIndex;
      if (this.props.node) {
        this.props.node.el = this.root.el;
      }
    });
  }
  get att() {
    return this.props.node.attributes;
  }

  layouts() {
    return this.props.node.children || [];
    return this.props.node.layouts || [];
  }
  toggleLayout() {
    console.log("toggling layout");
    if (this.props.node.layouts.length <= 1) return;
    if (this.props.node.layouts[0].id == this.props.node.layout_id) {
      this.props.node.layout_id = this.props.node.layouts[1].id;
    } else {
      this.props.node.layout_id = this.props.node.layouts[0].id;
    }
  }
  getLayout(layout_id: string): Layout {
    layout_id = layout_id.toLowerCase();
    for (const l of this.layouts()) {
      if (l.attributes.id == layout_id && l.el) {
        return l.el;
      }
    }
  }

  get style() {
    if (!this.props.node) {
      return "top:5px; left: 20px;";
    }
    let { y, x } = this.att;
    return `top:${y}px; left:${x}px; z-index:${
      this.zIndex * (this.props.node.visible || -1)
    }`;
    // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
    // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
  }

  close() {
    this.windowService.close(this.att.id);
  }

  mouseDown(ev: MouseEvent) {
    this.updateZIndex();
    if (ev.button != 0) return;
    // this.windowService.handleMouseDown(this.att.id, ev)
  }

  updateZIndex() {
    this.zIndex = Container.nextZIndex++;
    // this.root.el.style["z-index"] = this.zIndex;
  }
}
registry.category("component").add("container", Container);
// -----------------------------------------------------------------------------
// Two concrete Container type implementations
// -----------------------------------------------------------------------------

// class HelloWorld extends Component {
//   static template = xml`<div t-name="HelloWorld">
//     Some content here...
//   </div>`;
//   static defaultTitle = "Hello Owl!";
//   static defaultWidth = 16*10;
//   static defaultHeight = 16*4;
// }

// class Counter extends Component {
//     static template = "Counter";
//     static defaultTitle = "Click Counter";
//     static defaultWidth = 300;
//     static defaultHeight = 120;

//     state = useState({ value: 0 });

//     inc() {
//     this.state.value++;
//     }
// }

// register window components
//   WindowManager.Windows["Hello"] = HelloWorld;
// WindowManager.Windows.Counter = Counter;
// registry.category('containers').add('Hello', HelloWorld);
// console.log('registered:Hello')
