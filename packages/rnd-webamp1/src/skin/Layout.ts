import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';

export class Layout extends Component {
    static template = xml`
    <div class="layout" t-attf-style="width:#{props.info.w}px; height:#{props.info.h}px;">
    <t t-slot="default"/>
    #L:<t t-out="props.info.id"/>
    </div>`;
    
}