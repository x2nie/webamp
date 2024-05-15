import { Component, xml, onMounted, useRef } from "@odoo/owl";
import { registry } from '@web/core/registry';
import { Children } from "./Children";
import './Group'
import './Layer'

export class Layout extends Component {
    static template = xml`
    <div class="layout" t-attf-style="width:#{props.node.attributes.w}px; height:#{props.node.attributes.h}px;">
    <Children children="props.node.children" />
    </div>`;
    static components = {Children}
}