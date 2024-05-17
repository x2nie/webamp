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
  onWillStart,
  useSubEnv,
} from "@odoo/owl";
import  { WindowManager, createWindowService, useWindowService } from "./WindowManager";
import { Container } from "./Container";
import { SkinLoader } from "./SkinLoader";
import { XmlElement } from "@xml/parse-xml";



// -----------------------------------------------------------------------------
// Window Container
// -----------------------------------------------------------------------------

class WindowContainer extends Component {
  // t-if="w.visible"
  // <t t-component="w.Component"/>
  static template = xml` <div t-name="WindowContainer" class="window-manager">
    <t t-foreach="windowService.getWindows()" t-as="w" t-key="w.id" >
      <Container node="w">
      </Container>
    </t>
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
  bitmaps: {} ,
};

const templates = "";

export class App extends Component {

  // <t t-call="{{ kanban_template }}"  />
  static template = xml`<WindowContainer/>`;
  static components = { WindowContainer, Container };
  windowService!: WindowManager;
  tpl = xml`<span>tpl-goes-here</span>`

  setup() {
    const env = useEnv()
    useSubEnv({ 
      windowService: createWindowService(),
      bitmaps: {}, 
    });
    this.windowService = useWindowService();

    onWillStart( async () => {
      const loader = new SkinLoader()
      // debugger
      loader._bitmap = this.env.bitmaps
      // await loader.loadSkin('skins/WinampModern566.wal')
      // await loader.loadSkin('skins/MMD3.wal')
      // await loader.loadSkin('skins/SimpleTutorial.wal')
      // this.env.bitmaps = loader._bitmap;
      // const tpl = loader._Containers.join('\n')
      // console.log('FINAL-TPL---------------------------\n', tpl)
      // this.tpl = xml`${tpl}`
      await loader.loadSkin(env.options.skin)

      loader._containers.forEach(node => {
        const att = node.attributes
        const x = att['default_x'] || 0; // Number( att['default_x']) : Math.round(Math.random() * (window.innerWidth - 50));
        const y = att['default_y'] || 0; // Number( att['default_y']) : Math.round(Math.random() * (window.innerWidth - 50));
        this.windowService.append({
          id: att.id,
          title: att.name,
          x,y,
          // width: 100,
          // height: 50,
          visible: Number(att.default_visible),
          children: node.children,
          // layouts: node.layouts,
          layout_id: 'normal',
          // Component: Container,
        })
      })
    })

    onMounted(() => {
      // console.log(`${name}:mounted`);
      // for (let i = 0; i < 3; i++) {
      //   this.addWindow('Hello')
      // }
    })
  }

  say(hello:string){
    document.title = hello
  }


  get kanban_template() {
    // return xml`<b>temporay terus boss</b>`
    return this.tpl
  }


  static mount1(parent) {
    owlMount(App, parent, { env, dev: true });
  }
}
