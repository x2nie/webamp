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
import  { WindowManager, createWindowService, useWindowService } from "./WindowManager";
import { Container } from "./Container";



// -----------------------------------------------------------------------------
// Window Container
// -----------------------------------------------------------------------------

class WindowContainer extends Component {
  static template = xml` <div t-name="WindowContainer" class="window-manager">
    <Container t-foreach="windowService.getWindows()" t-as="w" t-key="w.id" info="w">
      <t t-component="w.Component"/>
    </Container>
  </div>`;
  static components = { Container };
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
