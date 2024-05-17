import {App as OwlApp} from "@odoo/owl";
import { App } from './skin/App';
import './style.css'
import { createWindowService } from "./skin/WindowManager";

export class Webamp {
    private owlApp: OwlApp<any, App, any>;
    private app: App;

    constructor(htmlNode:HTMLElement, options:{[key:string]:any}={}){
        this.mount(htmlNode, options)
    }
    
    private async mount(htmlNode:HTMLElement, options:{[key:string]:any}){
        if(this.owlApp) {
            // https://github.com/odoo/owl/blob/master/doc/reference/app.md#api
            this.owlApp.destroy()
        }
        const env = {
            windowService: createWindowService(),
            bitmaps: {} ,
        };
        options = {...options, env, dev:true}
        this.owlApp = new OwlApp(App, options) 
        this.app = await this.owlApp.mount(htmlNode)
    }
}