import { Component, xml, markup, onMounted, useRef, useEnv, onWillStart, markRaw, toRaw } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useSystem } from "./System";
import { ParsedMaki } from "src/maki/parser";
import { Group } from "./Group";
import { GuiObject } from "./GuiObject";
import { Object_ } from "./Object";
import { Variable } from "src/maki/v";
import { interpret } from "../maki/interpreter";

export class Script extends Component {
  static GUID = "d6f50f6449b793fa66baf193983eaeef"
  static template = xml`<t t-out="html()" />`;
  script: ParsedMaki;

  html() {
    return markup(`<!-- script:${this.props.node.attributes.file} -->`);
  }


  setup(){
    // const script = useSystem()
    this.env = useEnv()
    this.script = toRaw(this.props.node.parsedScript);
    this.script.variables[0].value = this;
    console.log('BINDING:', this.script.bindings)
    // onWillStart(() => {
    onMounted(() => {
      // debugger
      this.dispatch(this, 'onScriptLoaded',[])
    });
  }

  dispatch(object: Object_, event: string, args: Variable[] = []) {
    // markRaw(this.script)
    const script = this.script
    for (const binding of script.bindings) {
      if (
        script.methods[binding.methodOffset].name === event &&
        script.variables[binding.variableOffset].value === object
      ) {
        // debugger
        return interpret(binding.commandOffset, this.script, args, this.classResolver);
      }
    }
  }

  classResolver(guid:string): any {
    for (const Klass of registry.category('component').getAll()) {
      if(Klass.GUID == guid){
        return Klass
      }
    }
  }

  get group():Group{
    return this.props.node.parent.el
  }

    /* Required for Maki */
    getRuntimeVersion(): number {
      return 5.666;
    }
  
    getSkinName() {
      return "TODO: Get the Real skin name";
    }
  

  getScriptGroup() {
    return this.group
  }
  findObject(id: string): GuiObject {
    return this.group.findObject(id);
  }

}
registry.category("component").add("script", Script);
// registry.category("component").add("SystemObject", Script);