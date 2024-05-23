import { uiRegistry, xmlRegistry } from "@lib/registry";
import { XmlElement } from "@lib/xml";
import { Component, markup, xml } from "@odoo/owl";

export class System extends Component {
    static GUID = "d6f50f6449b793fa66baf193983eaeef"; //System
    static template = xml`<t t-out="html()" />`;

    html() {
        return markup(`<!-- script:${this.props.node.attributes.file} -->`);
    }
}
uiRegistry.add('script', System)

export class Script extends XmlElement {

}
xmlRegistry.add('script', Script)