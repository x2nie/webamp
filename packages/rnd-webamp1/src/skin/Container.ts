// -----------------------------------------------------------------------------
// Generic Container Component
// -----------------------------------------------------------------------------

import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { WindowManager, useWindowService } from "./WindowManager";
import { Layout } from "./Layout";

export class Container extends Component {
    static template = xml`
    <div t-att-id="props.node.id" t-name="Container" t-att-class="{window: true, invisible: !props.node.visible}" 
      t-on-mousedown="mouseDown"
      t-att-style="style" 
      t-on-dblclick="toggleLayout" t-ref="root">
      <t t-foreach="layouts()" t-as="l" t-key="l.id">
        <Layout t-if="l.id == props.node.layout_id" node="l"/>
      </t>
    </div>`;
        // <t t-esc="props.node.title"/> - 
    static components = {Layout}
    static nextZIndex = 1;
  
    zIndex = 1;
    windowService: any;
    root: any;
  
    setup() {
      this.windowService = useWindowService();

      
      
      this.root = useRef("root");
      onMounted(()=> {
        this.updateZIndex;
        if(this.props.node){
          this.props.node.el = this.root.el;
        }
      });
    }

    layouts() {
      return this.props.node.children || []
      return this.props.node.layouts || []
    }
    toggleLayout() {
      console.log('toggling layout')
      if(this.props.node.layouts.length <= 1) return
      if(this.props.node.layouts[0].id == this.props.node.layout_id) {
        this.props.node.layout_id = this.props.node.layouts[1].id
      } else {
        this.props.node.layout_id = this.props.node.layouts[0].id
      }
      
    }
  
    get style() {
      if(!this.props.node){
        return 'top:5px; left: 20px;'
      }
      let { width, height, y, x } = this.props.node;
      return `top:${y}px; left:${x}px; z-index:${this.zIndex * (this.props.node.visible || -1)}`;
      // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
      // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
  
    close() {
      this.windowService.close(this.props.node.id);
    }
  
    mouseDown(ev: MouseEvent) {
      this.updateZIndex();
      if(ev.button!=0) return;
      this.windowService.handleMouseDown(this.props.node.id, ev)
    }
  
    updateZIndex() {
      this.zIndex = Container.nextZIndex++;
      this.root.el.style["z-index"] = this.zIndex;
    }
}
  
  // -----------------------------------------------------------------------------
  // Two concrete Container type implementations
  // -----------------------------------------------------------------------------
  
  class HelloWorld extends Component {
    static template = xml`<div t-name="HelloWorld">
      Some content here...
    </div>`;
    static defaultTitle = "Hello Owl!";
    static defaultWidth = 16*10;
    static defaultHeight = 16*4;
  }
  
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
registry.category('containers').add('Hello', HelloWorld);
// console.log('registered:Hello')