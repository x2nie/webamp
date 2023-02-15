import { interpret } from "../maki/interpreter";
import { ParsedMaki } from "../maki/parser";
import { Variable } from "../maki/v";
import { UIRoot } from "../UIRoot";
import BaseObject from "./makiClasses/BaseObject";

import { classResolver } from "./resolver";

export default class Vm {
  _uiRoot: UIRoot; // actually only new Klass(uiRoot)
  _scripts: ParsedMaki[] = [];

  constructor(uiRoot: UIRoot) {
    this._uiRoot = uiRoot;
  }

  // This could easily become performance sensitive. We could make this more
  // performant by normalizing some of these things when scripts are added.
  // dispatch(object: BaseObject, event: string, args: Variable[] = []): number {
  async dispatch(object: BaseObject, event: string, args: Variable[] = [], wait: boolean = true): Promise<number> {
    const reversedArgs = [...args].reverse();    
    let executed = 0;
    const promises = []
    for (const script of this._scripts) {
      for (const binding of script.bindings) {
        if (
          script.methods[binding.methodOffset].name === event &&
          script.variables[binding.variableOffset].value === object
        ) {
          const ret = await this.interpret(script, binding.commandOffset, reversedArgs);
          promises.push(ret)
          // return 1;
          executed ++;
        }
      }
    }
    if(wait){
      await Promise.all(promises)
    }
    return executed;
    // return 0;
  }

  addScript(maki: ParsedMaki): number {
    const index = this._scripts.length;
    this._scripts.push(maki);
    return index;
  }

  async interpret(script: ParsedMaki, commandOffset: number, args: Variable[]) {
    await interpret(commandOffset, script, args, classResolver, this._uiRoot);
  }
}
