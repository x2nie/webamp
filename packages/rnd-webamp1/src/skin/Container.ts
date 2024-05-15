// -----------------------------------------------------------------------------
// Generic Container Component
// -----------------------------------------------------------------------------

import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { WindowManager, useWindowService } from "./WindowManager";

export class Container extends Component {
    static template = xml`
    <div t-att-id="props.info.id" t-name="Container" t-att-class="{window: true, invisible: !props.info.visible}" 
      t-on-mousedown="mouseDown"
      t-att-style="style" 
      t-on-dblclick="toggleLayout" t-ref="root">
      <t t-foreach="layouts()" t-as="l" t-key="l.id">
        <div class="layout" t-if="l.id == props.info.layout_id" t-attf-style="width:#{l.w}px; height:#{l.h}px;">
        <t t-esc="props.info.title"/> - <t t-out="l.id"/>
        </div>
      </t>
      <t t-slot="default"/>
      </div>`;
    static nextZIndex = 1;
  
    zIndex = 1;
    windowService: any;
    root: any;
  
    setup() {
      this.windowService = useWindowService();

      
      
      this.root = useRef("root");
      onMounted(()=> {
        this.updateZIndex;
        if(this.props.info){
          this.props.info.el = this.root.el;
        }
      });
    }

    layouts() {
      return this.props.info.layouts || []
    }
    toggleLayout() {
      console.log('toggling layout')
      if(this.props.info.layouts.length <= 1) return
      if(this.props.info.layouts[0].id == this.props.info.layout_id) {
        this.props.info.layout_id = this.props.info.layouts[1].id
      } else {
        this.props.info.layout_id = this.props.info.layouts[0].id
      }
      
    }
  
    get style() {
      if(!this.props.info){
        return 'top:5px; left: 20px;'
      }
      let { width, height, y, x } = this.props.info;
      return `top:${y}px; left:${x}px; z-index:${this.zIndex * (this.props.info.visible || -1)}`;
      // return `min-width:${width}px; min-height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
      // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
    }
  
    close() {
      this.windowService.close(this.props.info.id);
    }
  
    mouseDown(ev: MouseEvent) {
      this.updateZIndex();
      if(ev.button!=0) return;
      this.windowService.handleMouseDown(this.props.info.id, ev)
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