import { App as OwlApp } from "@odoo/owl";
import { App } from "./skin/App";
// import "./style.css";
import { WebampOptions, webampDefaultOptions } from "./WebampOptions";
import { createSkinEngineFor } from "./skin/SkinEngine";
import Container from "./skin/makiClasses/Container";

const templates = `<odoo>
  <t t-name="childs" t-foreach="nodeChildren()" t-as="child" t-key="child_index">
      <t t-component="lookupTag(child.tag)" t-props="{node:child}" />
  </t>

  <t t-name="ui">
    <t t-tag="props.node.tag" t-att-id="att.id" t-att-class="getCssClass()" t-att-style="style()" t-ref="gui">
      <!-- <t t-foreach="nodeChildren()" t-as="child" t-key="child_index" t-if="props.node.children.length"> -->
          <!-- <t t-component="lookupTag(child.tag)" node="child" /> -->
      <!-- </t> -->
      <t t-call="childs" />
    </t>
  </t>
</odoo>`;
      // <t t-set="children" t-value="knownChildren()" />

export class Webamp {
  private owlApp: OwlApp<any, App, any>;
  private app: App;
  options: WebampOptions;

  constructor(private htmlNode: HTMLElement, options: Partial<WebampOptions> = {}) {
    this.options = { ...webampDefaultOptions, ...options };
    this.mount(htmlNode);
  }
  
  switchSkin(skinPath: string) {
    this.options.skin = skinPath;
    this.mount(this.htmlNode);
  }

  addSong(path: string, name: string = ""): number {
    return 0;
  }

  playSong(index: number) {}

  private async mount(htmlNode: HTMLElement) {
    //TODO: check if this function will be called more than one by switch skin?
    if (this.owlApp) {
      // https://github.com/odoo/owl/blob/master/doc/reference/app.md#api
      this.owlApp.destroy();
    }
    const env = {
      options: this.options,
      ui: {},
      engine: null,
    };
    const skinPath = env.options.skin;
    const loader = env.engine = await createSkinEngineFor(skinPath);
    loader.setStorage(env.ui);


    await loader.parseSkin();
    // env.ui.containers.
    loader.containers().forEach((node : Container) => {
      // this.getContainers().forEach((node) => {
      const att = node.attributes;
      // node.id = att.id;
      att.visible = Number(
        att.default_visible == null ? 1 : att.default_visible
      );
      
      // att.layout_id = "normal";
      // node.switchToLayout('normal')// failed on boxOr.wal
      const layouts = node.children.filter(e => e.tag == 'layout').map(e => e.id)
      const firstLayout = layouts.includes('normal') ? 'normal' : layouts[0]
      node.switchToLayout(firstLayout)// failed on boxOr.wal

      const x = att["default_x"] || 0; // Number( att['default_x']) : Math.round(Math.random() * (window.innerWidth - 50));
      const y = att["default_y"] || 0; // Number( att['default_y']) : Math.round(Math.random() * (window.innerWidth - 50));
      att.x = x;
      att.y = y;
    });

    const options = { env, templates, dev: true };
    this.owlApp = new OwlApp(App, options);
    this.app = await this.owlApp.mount(htmlNode)
    // this.owlApp.mount(htmlNode);
  }
}
