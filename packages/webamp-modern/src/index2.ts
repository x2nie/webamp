import { Component, xml, mount , useState, useEnv, onMounted, reactive, useRef, useEffect } from '@odoo/owl';
// import './index2.css'

// -----------------------------------------------------------------------------
// Window manager code
// -----------------------------------------------------------------------------

class WindowManager {
    // contains all components with metadata
    static Windows = {};
    windows = {}; // mapping id => info
    nextId = 1;
  
    add(type:string) {
      const Comp = WindowManager.Windows[type];
      const left = 50 + Math.round(Math.random()*(window.innerWidth - 50 - Comp.defaultWidth));
      const top = 50 + Math.round(Math.random()*(window.innerHeight - 100 - Comp.defaultHeight));
      const id = this.nextId++;
      this.windows[id] = {
        id, 
        title: Comp.defaultTitle,
        width: Comp.defaultWidth,
        height: Comp.defaultHeight,
        left,
        top,
        Component: Comp,
      };
    }
    
    close(id:string) {
      delete this.windows[id];
    }
  
    updatePosition(id, left, top) {
      const w = this.windows[id];
      w.left = left;
      w.top = top;
    }
  
    getWindows() {
      return Object.values(this.windows);
    }
}
  
function createWindowService() {
    return reactive(new WindowManager());
}

function useWindowService() {
    const env = useEnv();
    return useState(env.windowService);
}


// -----------------------------------------------------------------------------
// Generic Window Component
// -----------------------------------------------------------------------------

class Window extends Component {
    static template = xml`<div t-name="Window" class="window" t-att-style="style" t-on-click="updateZIndex" t-ref="root">
    <div class="header">
      <span t-on-mousedown="startDragAndDrop"><t t-esc="props.info.title"/></span>
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
        this.root = useRef('root');
        onMounted(this.updateZIndex);
    }

    get style() {
        let { width, height, top, left } = this.props.info;
        return `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;z-index:${this.zIndex}`;
    }

    close() {
        this.windowService.close(this.props.info.id);
    }

    startDragAndDrop(ev) {
        this.updateZIndex();
        const self = this;
        const root = this.root;

        const el = root.el;
        el.classList.add('dragging');

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
            el.classList.remove('dragging');

            if (top !== undefined && left !== undefined) {
            self.windowService.updatePosition(current.id, left, top);
            }
        }
    }

    updateZIndex() {
        this.zIndex = Window.nextZIndex++;
        this.root.el.style['z-index'] = this.zIndex;
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
    static defaultWidth = 200;
    static defaultHeight = 100;
}

// register window components
WindowManager.Windows['Hello'] = HelloWorld;
// WindowManager.Windows.Counter = Counter;


// -----------------------------------------------------------------------------
// Window Container
// -----------------------------------------------------------------------------

class WindowContainer extends Component {
    static template = xml`<div class="window-manager">
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

export const env = {
    windowService: createWindowService(),
    a: 'b',
};

export class App extends Component {
    static template = xml`<WindowContainer/><div class="menubar">
    <h1 t-on-click="() => this.addWindow('Hello')">Hellow </h1> 
    <button t-on-click="() => this.addWindow('Hello')">Say Hello</button>
    <button t-on-click="() => this.addWindow('Counter')">Counter</button>
  </div>`
    static components = { WindowContainer };
  windowService: any;

    setup() {
        this.windowService = useWindowService();
    }
    
    addWindow(type) {
        this.windowService.add(type);
    }

    // static mount1(parent){
    //   owlMount(App, parent, {env, dev: true})
    // }
}

async function  main(){
    // App.mount1(document.body)
    // static mount1(parent){
      mount(App, document.getElementById('web-amp'), {env, dev: true})
    // }
  }
  
main()