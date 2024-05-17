import {App as OwlApp} from "@odoo/owl";
import { App } from './skin/App';
import './style.css'
import { WebampOptions, webampDefaultOptions } from "./WebampOptions";

export class Webamp {
    private owlApp: OwlApp<any, App, any>;
    private app: App;
    options: WebampOptions;

    constructor(htmlNode:HTMLElement, options:Partial<WebampOptions>={}){
        this.options = {...webampDefaultOptions, ...options}
        this.mount(htmlNode)
    }
    
    private async mount(htmlNode:HTMLElement){
        //TODO: check if this function will be called more than one by switch skin?
        if(this.owlApp) {
            // https://github.com/odoo/owl/blob/master/doc/reference/app.md#api
            this.owlApp.destroy()
        }
        const env = {
            options: this.options,
        };
        const options = {env, dev:true}
        this.owlApp = new OwlApp(App, options) 
        this.app = await this.owlApp.mount(htmlNode)
    }
}