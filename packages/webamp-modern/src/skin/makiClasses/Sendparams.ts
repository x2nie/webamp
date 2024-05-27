import { uiRegistry } from "@lib/registry";
import { Component, onMounted, xml } from "@odoo/owl";

export class Sendparams extends Component {
  static template = xml`<!-- sendparams -->`
  setup() {
    onMounted(() => {
      if(/* !this.att.group || */ !this.att.target)  {
        console.log('sendparam has no valid att.group/.target:', this.props.node)
        return
      }
      const group = this.att.group? this.props.node.parent.findObject(this.att.group) : this.props.node.parent;
      const targets = this.att.target.split(';')
      for(const target_id of targets){
        const targetNode = group.findObject(target_id)
        if(!targetNode){
          console.log('failed to find target:', target_id)
          continue
        }
        for(const [k,v] of Object.entries(this.att)){
          if(!['group', 'target'].includes(k) && v != null){
            // console.log('sendz:', group.id, '@', targetNode.id, '::', k, '=', v)
            targetNode.setXmlParam(k, String(v))
          }
        }
      }
    });
  }

  get att(){
    return this.props.node.attributes;
  }
}

uiRegistry.add('sendparams', Sendparams)