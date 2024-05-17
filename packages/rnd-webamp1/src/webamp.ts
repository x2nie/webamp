import {App as OwlApp} from "@odoo/owl";
import { App } from './skin/App';
import './style.css'
import { createWindowService } from "./skin/WindowManager";

export class Webamp {
    owlApp: OwlApp<any, App, any>;
    app: App;

    constructor(htmlNode:HTMLElement, options:{[key:string]:any}={}){
        const env = {
            windowService: createWindowService(),
            bitmaps: {} ,
        };
        options = {...options, env, dev:true}
        this.mount(htmlNode, options)
    }
    
    private async mount(htmlNode:HTMLElement, options:{[key:string]:any}){
        this.owlApp = new OwlApp(App, options) 
        this.app = await this.owlApp.mount(htmlNode)

    }
}