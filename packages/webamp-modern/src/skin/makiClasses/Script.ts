import { uiRegistry, xmlRegistry } from "@lib/registry";
import { XmlElement } from "@lib/xml";
import {
  Component,
  markup,
  onMounted,
  onWillStart,
  onWillUnmount,
  useEnv,
  xml,
} from "@odoo/owl";
import { ParsedMaki } from "../../maki/parser";
import Container from "./Container";
import Group from "./Group";
import { Variable, VariableObject } from "../../maki/v";
import { interpret } from "../../maki/interpreter";
import { SkinEngine } from "../SkinEngine";
import BaseObject from "./BaseObject";
import SystemObject from "./SystemObject";
import Config from "./Config";
import WinampConfig from "./WinampConfig";

type eventInfo = {
  node: BaseObject;
  event: string;
  callback: Function;
};

export class SystemUI extends Component {
  static GUID = "d6f50f6449b793fa66baf193983eaeef"; //System
  static template = xml`<t t-out="appearance()" />`;
  script: ParsedMaki;
  subscription: eventInfo[] = [];

  appearance() {
    return markup(`<!-- script:${this.props.node.attributes.file} -->`);
  }

  get system(): SystemObject {
    return this.props.node;
    // return this;
  }

  setup() {
    this.system.el = this;
    this.env = useEnv();

    onWillStart(() => {
      this.script = structuredClone(
        this.env.ui.scripts[this.props.node.attributes.file]
      );
      const me = this.script.variables[0] as VariableObject;
      me.value = this.system;
      this.attachBindings(me);

      for (const vari of this.script.variables) {
        if (vari.type == "OBJECT") {
          if (vari.guid == Config.GUID) {
            vari.value = this.env.config;
          } else if (vari.guid == WinampConfig.GUID) {
            vari.value = this.env.wconfig;
          // } else if (vari.guid == Application.GUID) {
          //   vari.value = this._uiRoot.APPLICATION;
          }
        }
      }
    });

    onMounted(() => {
      console.log(`script ${this.script.maki_id} loaded!`);
      this.system.emitter.trigger("onScriptLoaded");
      // setTimeout(() => {
      //   //simulate play
      //   console.log(`sys.onPlay()`);
      //   this.system.emitter.trigger("onPlay");
      // }, 3000);
    });
    onWillUnmount(() => this.unsubscribe());
  }

  subscribe(node: BaseObject, event: string, callback: Function) {
    this.subscription.push({ node, event, callback });
    try{
      node.emitter.on(event, callback);
    } catch (e) {
      console.info(`Failed to attach event: ${event} ${node.id? node.id : node} @${this.script.maki_id}`,e)
    }
  }
  unsubscribe() {
    this.subscription.forEach(({ node, event, callback }) => {
      node.emitter.off(event, callback);
    });
  }

  /**
   * Chance to subscribe the eventListeners of a Variable.
   * @param v Maki.variables member, v.value = GuiObject
   */
  attachBindings(v: VariableObject) {
    // special action listener ---------------------------
    // const fun = async (...args: any[]) => {
    //   const info = (fun as any).info;
    //   const [action, param] = args;
    //   return await this.system.triggerAction(info.sender, action, param);
    // };
    // (fun as any).info = {
    //   sender: v.value,
    // };
    // debugger
    // this.subscribe(v.value, "action", fun);

    // general event listener ---------------------------
    for (const binding of this.script.bindings) {
      if (binding.variableOffset == v.offset) {
        const eventName = this.script.methods[binding.methodOffset].name;

        const fun = async (...args: any[]) => {
          const info = (fun as any).info;
          return await this.invoke(info.event, info.start, ...args);
        };
        (fun as any).info = {
          start: binding.commandOffset,
          event: eventName,
        };

        this.subscribe(v.value, eventName, fun);
      }
    }
  }

  // new version to run script/event
  async invoke(event, start, ...args: any[]) {
    return await interpret(
      start, //? binding.commandOffset,
      this.script, //? program
      args, //? stack: Variable[]
      this.classResolver, //? (guid) => Object_
      event,
      this,
      this.props.node
    );
  }

  // old way to run script/event. slower
  async dispatch(object: any, event: string, args: Variable[] = []) {
    // markRaw(this.script)
    const lower_id = object.id.toLowerCase();
    const script = this.script;
    for (const binding of script.bindings) {
      if (
        script.methods[binding.methodOffset].name.toLowerCase() == lower_id &&
        script.methods[binding.methodOffset].name != object.id
      ) {
        console.log(
          `iterate expected "${event}", found: '${
            script.methods[binding.methodOffset].name
          }'`
        );
      }
      if (
        script.methods[binding.methodOffset].name === event &&
        script.variables[binding.variableOffset].value === object
      ) {
        // debugger
        return await interpret(
          binding.commandOffset, //? start
          this.script, //? program
          args, //? stack: Variable[]
          this.classResolver, //? (guid) => Object_
          event,
          this, //sytemui
          this.props.node, //parent
        );
      }
    }
  }

  classResolver(guid: string): any {
    for (const Klass of xmlRegistry.getAll()) {
      if (Klass.GUID == guid) {
        return Klass;
      }
    }
  }

  getEngine(): SkinEngine {
    return this.env.engine;
  }

  // get group(): Group {
  //   return this.props.node.parent.el;
  // }

  /* Required for Maki */
  getRuntimeVersion(): number {
    return 5.666;
  }

  getSkinName() {
    return "TODO: Get the Real skin name";
  }

  getScriptGroup() {
    return this.props.node.parent;
  }
  // findObject(id: string): GuiObject {
  //   return this.group.findObject(id);
  // }

  // getContainer(container_id: string): Container {
  //   container_id = container_id.toLowerCase();
  //   const containers = this.env.root.getContainers() as XmlElement[];
  //   for (const c of containers) {
  //     if (c.attributes.id == container_id && c.el) {
  //       return c.el as Container;
  //     }
  //   }
  //   console.log("failed to get container:", container_id);
  //   //@ts-ignore
  //   return null;
  // }
  //   pause() {
  //     // this.dispatch(this, 'onPaused')
  //   }
  //   getPosition(): number {
  //     return 3.1;
  //   }
  //   integerToString(i: number): string {
  //     return String(i);
  //   }
}
uiRegistry.add("script", SystemUI);

// export class Script extends XmlElement {

// }
// xmlRegistry.add('script', Script)
