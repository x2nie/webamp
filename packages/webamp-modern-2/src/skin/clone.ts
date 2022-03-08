import Group from "./makiClasses/Group";
import GuiObj from "./makiClasses/GuiObj";
import SystemObject from "./makiClasses/SystemObject";

export function clone(src:any, parent: GuiObj): GuiObj {
    // const dst = new (src.constructor() as any);
    const dst = new src.constructor();
    // const dst = Object.create(src);
    cloneAttribute(src, dst, parent);
    return dst;
}
export function cloneAttribute(src:any, dst: GuiObj, parent: GuiObj) {
    // const dst = new (src.constructor() as any);
    for (var attribut in src) {
        const value = src[attribut];

        if (value === null) {
            // dst[attribut] = this[attribut].clone();
        } else 
        if (typeof value === "object") {
            switch (attribut) {
                case "_children":
                    cloneChildren(value, dst);
                    break;
                case "_systemObjects":
                    cloneScripts(value, dst);
                    break;
                case "_parent":
                    dst._parent = parent;
                    break
                case "_backgroundBitmap":
                    dst._backgroundBitmap = value;
                    break
                case "_div":
                case "_others":
                    // skip
                    break;
                default:
                    console.log('unhandled att:', attribut, 'val:',value)
            }
            // dst[attribut] = this[attribut].clone();
        } else {
            dst[attribut] = value;
        }
    }
}


function cloneChildren(src:GuiObj[], parent: GuiObj) {
    for (const child of src) {
        parent.addChild( clone(child, parent) )
        // const clonned = clone(child, parent)
    }
}

function cloneScripts(src:SystemObject[], parent: GuiObj) {
    for (const script of src) {
        const systemObj = new SystemObject(script._id, script._parsedScript, script._param);
        (parent as Group).addSystemObject(systemObj);
    }
}

