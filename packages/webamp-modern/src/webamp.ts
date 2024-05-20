import { App as OwlApp } from "@odoo/owl";
import { App } from "./skin/App";
// import "./style.css";
import { WebampOptions, webampDefaultOptions } from "./WebampOptions";
import { createSkinEngineFor } from "./skin/SkinEngine";

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
    };
    const skinPath = env.options.skin;
    const loader = await createSkinEngineFor(skinPath);
    loader.setStorage(env.ui);

    await loader.parseSkin();
    // env.ui.containers.
    loader.containers().forEach((node) => {
      // this.getContainers().forEach((node) => {
      const att = node.attributes;
      // node.id = att.id;
      att.visible = Number(
        att.default_visible == null ? 1 : att.default_visible
      );
      att.layout_id = "normal";
      const x = att["default_x"] || 0; // Number( att['default_x']) : Math.round(Math.random() * (window.innerWidth - 50));
      const y = att["default_y"] || 0; // Number( att['default_y']) : Math.round(Math.random() * (window.innerWidth - 50));
      att.x = x;
      att.y = y;
    });

    const options = { env, dev: true };
    this.owlApp = new OwlApp(App, options);
    this.app = await this.owlApp.mount(htmlNode)
    // this.owlApp.mount(htmlNode);
  }
}
