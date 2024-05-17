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
// import { SkinLoader } from "./SkinLoader";
import { XmlElement } from "@xml/parse-xml";
import { createSkinEngineFor } from "./SkinEngine";



// -----------------------------------------------------------------------------
// Window Container
// -----------------------------------------------------------------------------

export class App extends Component {
  static template = xml` <div class="window-manager">
    <t t-foreach="windowService.getWindows()" t-as="w" t-key="w.id" >
      <Container node="w"/>
    </t>
  </div>`;
  static components = { Container };
  windowService!: WindowManager;

  setup() {
    const env = useEnv()  //? global env
    
    useSubEnv({ //? additional env, isolated for this instance and children
      windowService: createWindowService(),
      bitmaps: {}, 
      ui: {},
      root: this, //? usefull for later System calls
    });
    this.windowService = useWindowService();

    onWillStart( async () => {
      if(env.options.skin)
        await this.switchSkin(env.options.skin)
    })

    onMounted(() => {
      // console.log(`${name}:mounted`);
      // for (let i = 0; i < 3; i++) {
      //   this.addWindow('Hello')
      // }
    })
  }

  async switchSkin(skinPath:string){
    const loader = await createSkinEngineFor(skinPath)

      // debugger
      // loader._bitmap = this.env.bitmaps
      // await loader.loadSkin('skins/WinampModern566.wal')
    // await loader.loadSkin('skins/MMD3.wal')
    // await loader.loadSkin('skins/SimpleTutorial.wal')
    // this.env.bitmaps = loader._bitmap;
    // const tpl = loader._Containers.join('\n')
    // console.log('FINAL-TPL---------------------------\n', tpl)
    // this.tpl = xml`${tpl}`
    await loader.parseSkin()

    this.env.ui.bitmaps = loader.bitmaps()

    
    loader.containers().forEach(node => {
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
  }


  /* async switchSkin0(skinPath:string){
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
    await loader.loadSkin(skinPath)

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
  } */


  say(hello:string){
    document.title = hello
  }

}
