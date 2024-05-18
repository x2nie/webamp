import { onMounted, onWillUnmount, useComponent } from "@odoo/owl";
import { Group } from "./Group";

export function useSystem() {
    // debugger
    const me = useComponent();
    const group:Group = me.props.node.parent.el;
    const name = `${me.props.node.attributes.file}@${group.att.id}`

    //* do whatever, it is inside component.setup()
    onMounted(() => console.log(`${name}:mounted`));
    onWillUnmount(() => console.log(`${name}:willUnmount`));
}