import { useEnv } from "@odoo/owl";
import { Object_ } from "./Object";
import { value2number } from "@xml/parse-xml";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#GuiObject_.28Global_params.29
export class GuiObject extends Object_{
    static GUID = "4ee3e1994becc636bc78cd97b028869c";

    setup() {
        this.env = useEnv()
    }
    get att(){
        return this.props.node.attributes
    }
    setXmlParam(param :string, value :string){
        if(value2number.includes(param)){
            //@ts-ignore
            value = Number(value)
        }
        this.att[param] = value
    }
    getXmlParam(param :string) :string{
        return String(this.att[param])
    }
}