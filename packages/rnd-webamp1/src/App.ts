import {
  Component,
  xml,
  mount as owlMount,
  useState,
  useEnv,
  onMounted,
  reactive,
  useRef,
  useEffect,
} from "@odoo/owl";
import  { WindowManager } from "./WindowManager";

// -----------------------------------------------------------------------------
// Window manager code
// -----------------------------------------------------------------------------


function createWindowService():WindowManager {
  return reactive(new WindowManager());
}

function useWindowService():WindowManager {
  const env = useEnv();
  return useState(env.windowService);
}

// -----------------------------------------------------------------------------
// Generic Window Component
// -----------------------------------------------------------------------------

class Window extends Component {
  static template = xml`  <div t-name="Window" class="window" t-att-style="style" t-on-click="updateZIndex" t-ref="root">
    <div class="header">
      <span t-on-mousedown="startDragAndDrop"><t t-esc="props.info.title"/> #<t t-out="props.info.id"/></span>
      <span class="close" t-on-click.stop="close">×</span>
    </div>
    <t t-slot="default"/>
    </div>`;
  static nextZIndex = 1;

  zIndex = 0;
  windowService: any;
  root: any;

  setup() {
    this.windowService = useWindowService();
    this.root = useRef("root");
    onMounted(()=> {
      this.updateZIndex;
      this.props.info.el = this.root.el;
    });
  }

  get style() {
    let { width, height, y, x } = this.props.info;
    return `width:${width}px; height:${height}px; top:${y}px; left:${x}px; z-index:${this.zIndex}`;
    // return `width: ${width}px;height: ${height}px;transform:translate(${x}px;left:${x}px;z-index:${this.zIndex}`;
  }

  close() {
    this.windowService.close(this.props.info.id);
  }

  startDragAndDrop(ev: MouseEvent) {
    this.updateZIndex();
    if(ev.button!=0) return;
    this.windowService.handleMouseDown(this.props.info.id, ev)
    return;
    const self = this;
    const root = this.root;

    const el = root.el;
    el.classList.add("dragging");

    const current = this.props.info;
    const offsetX = current.left - ev.pageX;
    const offsetY = current.top - ev.pageY;
    let left, top;

    window.addEventListener("mousemove", moveWindow);
    window.addEventListener("mouseup", stopDnD, { once: true });

    function moveWindow(ev) {
      left = Math.max(offsetX + ev.pageX, 0);
      top = Math.max(offsetY + ev.pageY, 0);
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    }
    function stopDnD() {
      window.removeEventListener("mousemove", moveWindow);
      el.classList.remove("dragging");

      if (top !== undefined && left !== undefined) {
        self.windowService.updatePosition(current.id, left, top);
      }
    }
  }

  updateZIndex() {
    this.zIndex = Window.nextZIndex++;
    this.root.el.style["z-index"] = this.zIndex;
  }
}

// -----------------------------------------------------------------------------
// Two concrete Window type implementations
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
WindowManager.Windows["Hello"] = HelloWorld;
// WindowManager.Windows.Counter = Counter;

// -----------------------------------------------------------------------------
// Window Container
// -----------------------------------------------------------------------------

class WindowContainer extends Component {
  static template = xml` <div t-name="WindowContainer" class="window-manager">
    <Window t-foreach="windowService.getWindows()" t-as="w" t-key="w.id" info="w">
      <t t-component="w.Component"/>
    </Window>
  </div>`;
  static components = { Window };
  windowService: any;

  setup() {
    this.windowService = useWindowService();
  }
}

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const env = {
  windowService: createWindowService(),
};

const templates = "";

export class App extends Component {
  static template = xml`<WindowContainer/><div class="menubar">
  <h1 t-on-click="() => this.addWindow('Hello')">Hellow </h1> 
  <button t-on-click="() => this.addWindow('Hello')">Say Hello</button>
  <button t-on-click="() => this.addWindow('Counter')">Counter</button>
</div>`;
  static components = { WindowContainer };
  windowService!: WindowManager;

  setup() {
    this.windowService = useWindowService();
    onMounted(() => {
      // console.log(`${name}:mounted`);
      for (let i = 0; i < 3; i++) {
        this.addWindow('Hello')
        
      }
    })
  }

  addWindow(type) {
    this.windowService.add(type);
  }

  static mount1(parent) {
    owlMount(App, parent, { env, dev: true });
  }
}
