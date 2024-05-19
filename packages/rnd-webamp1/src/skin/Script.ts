import {
  Component,
  xml,
  markup,
  onMounted,
  useRef,
  useEnv,
  onWillStart,
  markRaw,
  toRaw,
  onRendered,
} from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useSystem } from "./System";
import { ParsedMaki } from "src/maki/parser";
import { Group } from "./Group";
import { GuiObject } from "./GuiObject";
import { Object_ } from "./Object";
import { Variable } from "src/maki/v";
import { interpret } from "../maki/interpreter";
import "./Timer";
import { Container } from "./Container";
import { XmlElement } from "@xml/parse-xml";

export class Script extends Component {
  static GUID = "d6f50f6449b793fa66baf193983eaeef";
  static template = xml`<t t-out="commented()" />`;
  script: ParsedMaki;

  commented() {
    return markup(`<!-- script -->`);
    // return markup(`<!-- script:${this.props.node.attributes.file} -->`);
  }

  setup() {
    // const script = useSystem()
    this.env = useEnv();
    this.script = toRaw(this.props.node.parsedScript);
    this.script.variables[0].value = this;
    console.log("BINDING:", this.script.bindings);
    const self = this;
    // onWillStart(() => {
      // onMounted(() => {
      onRendered(() => {
      // debugger
      setTimeout(() => {
        self.dispatch(screenLeft, "onScriptLoaded", []);
          //simulate play
          console.log(`sys.onPlay()`);
          // self.dispatch(self, "onPlay", []);
      }, 3000);
    });
  }

  dispatch(object: Object_, event: string, args: Variable[] = []) {
    // debugger
    // markRaw(this.script)
    const script = this.script;
    for (const binding of script.bindings) {
      if (
        script.methods[binding.methodOffset].name === event &&
        script.variables[binding.variableOffset].value === object
      ) {
        // debugger
        return interpret(
          binding.commandOffset,
          this.script,
          args,
          this.classResolver
        );
      }
    }
  }

  classResolver(guid: string): any {
    for (const Klass of registry.category("component").getAll()) {
      if (Klass.GUID == guid) {
        return Klass;
      }
    }
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
  findObject(id: string): GuiObject {
    return this.group.findObject(id);
  }

  getContainer(container_id: string): Container{
    debugger
    const containers = this.env.root.getContainers() as XmlElement[]
    for(const c of containers){
      if(c.attributes.id == container_id){
        return c.el as Container
      }
    }
    //@ts-ignore
    return null
  }
  pause (){
    // this.dispatch(this, 'onPaused')
  }
  getPosition():number {
    return 3.1
  }
  integerToString(i:number):string {
    return String(i)
  }
}
registry.category("component").add("script", Script);
// registry.category("component").add("SystemObject", Script);
