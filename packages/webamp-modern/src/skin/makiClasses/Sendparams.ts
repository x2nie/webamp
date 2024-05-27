import { uiRegistry } from "@lib/registry";
import { Component, onMounted, xml } from "@odoo/owl";

export class Sendparams extends Component {
  static template = xml`<!-- sendparams -->`
  setup() {
    onMounted(() => {
      const group = this.props.node.parent.findObject(this.att.group)
      const target = group.findObject(this.att.target)
      for(const [k,v] of Object.entries(this.att)){
        if(!['group', 'target'].includes(k)){
          console.log('sendz:', group.id, '@', target.id, '::', k, '=', v)
          target.setXmlParam(k,v)
        }
      }
    });
  }

  get att(){
    return this.props.node.attributes;
  }
}

uiRegistry.add('sendparams', Sendparams)