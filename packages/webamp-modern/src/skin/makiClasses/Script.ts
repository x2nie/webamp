import { uiRegistry, xmlRegistry } from "@lib/registry";
import { XmlElement } from "@lib/xml";
import {
  Component,
  markup,
  onMounted,
  onWillStart,
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

type eventInfo = {
  node: XmlElement;
  event: string;
  callback: Function;
};

export class SystemUI extends Component {
  static GUID = "d6f50f6449b793fa66baf193983eaeef"; //System
  static template = xml`<t t-out="html()" />`;
  script: ParsedMaki;
  subscription: eventInfo[] = [];

  html() {
    return markup(`<!-- script:${this.props.node.attributes.file} -->`);
  }

  get node():BaseObject {
    return this.props.node;
    // return this;
  }

  setup() {
    this.node.el = this;
    // console.log('SCRIPT.props=', this.props8.node)
    // const script = useSystem()
    this.env = useEnv();
    // console.log("BINDING:", this.script.bindings);
    // const self = this;
    onWillStart(() => {
      // onMounted(() => {
      this.script = structuredClone(
        this.env.ui.scripts[this.props.node.attributes.file]
      );
      // this.script = toRaw(this.props.node.parsedScript);
      // debugger
      //   this.script.variables[0].value = this.props.node;
      this.script.variables[0].value = this.node;
      this.binding(this.script.variables[0] as VariableObject)

      // debugger
    });
    onMounted(() => {
      console.log(`script ${this.script.maki_id} loaded!`);
      //   debugger
      // this.dispatch(this.node, "onScriptLoaded", []);
      this.node.emitter.trigger('onScriptLoaded')
      setTimeout(() => {
        //simulate play
        console.log(`sys.onPlay()`);
        //this.dispatch(this.node, "onPlay", []);
        this.node.emitter.trigger('onPlay')
      }, 3000);
    });
  }

  subscribe(node: BaseObject, event: string, callback: Function) {
    this.subscription.push({ node, event, callback });
    node.emitter.on(event, callback);
  }

  binding(v: VariableObject) {
    // const xmlNode = v.value;
    for (const binding of this.script.bindings) {
      if (binding.variableOffset == v.offset) {
        const eventName = this.script.methods[binding.methodOffset].name;

        const fun = async (...args: any[]) => {
          const info = (fun as any).info;
          this.invoke(info.event, info.start, ...args);
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
      this
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
          this
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

  get group(): Group {
    return this.props.node.parent.el;
  }

  /* Required for Maki */
  getRuntimeVersion(): number {
    return 5.666;
  }

  getSkinName() {
    return "TODO: Get the Real skin name";
  }

  getScriptGroup() {
    return this.group;
  }
  // findObject(id: string): GuiObject {
  //   return this.group.findObject(id);
  // }

  getContainer(container_id: string): Container {
    container_id = container_id.toLowerCase();
    const containers = this.env.root.getContainers() as XmlElement[];
    for (const c of containers) {
      if (c.attributes.id == container_id && c.el) {
        return c.el as Container;
      }
    }
    console.log("failed to get container:", container_id);
    //@ts-ignore
    return null;
  }
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
