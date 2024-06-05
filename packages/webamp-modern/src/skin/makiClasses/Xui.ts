import { uiRegistry, xmlRegistry } from "@lib/registry";
import { UI } from "../Children";
import Group, { GroupUI } from "./Group";
import { onMounted, onWillStart } from "@odoo/owl";

export class XuiUi extends GroupUI {
  setup(): void {
    super.setup();
    // onWillStart(()=>{
    //   const engine = this.env.engine
    //   engine.populateGroup(this.props.node)
    // })

    onMounted(() => {
      for (const [k, v] of Object.entries(this.props.node.attributes)) {
        if (["id" , "_xuitag", "embed_xui"].includes(k)) continue;
        if (typeof v == "string") {
          console.log(`setting XuiParam: "${k}" : "${v}"`);
          // if(k=='content'){
          //   debugger
          // }
          // this.props.node.sendXuiParam(k, v);
          try{
            this.props.node.sendXuiParam(k, v);
          } catch(err){
            console.warn('failed to sendXuiParam:', err)
          }
        }
      }
    
    });
  }
}
uiRegistry.add("xui", XuiUi);

export default class Xui extends Group {
  //
}
xmlRegistry.add("xui", Xui);
