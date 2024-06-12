export const value2lower = [
  // identity
  "id",
  "xuitag",
  "instanceid",
  "group",
  "content",
  "linkwidth",
  "shade",
  "inherit_group",
  "action",
  "action_target",
  "autowidthsource",
  "droptarget",
  "color",
  // event
  "dblclickaction",
  // enum
  "resize",
  "scale",
  "background",
  "image",
  "downimage",
  "activeimage",
  "thumb",
  "downthumb",
  "notfoundimage", // ALbumArt
  "gammagroup", // <color>
  "next prev normal hover down".split(' '),  // <menu>
];

export const value2number = [
  "x",
  "y",
  "w",
  "h",
  "relatx",
  "relaty",
  "relatw",
  "relath",
  "bg",
  "default_x",
  "default_y",
  "minimum_w",
  "minimum_h",
  "maximum_w",
  "maximum_h",
  "shadowx",
  "shadowy",
  "fontsize",
  "altfontsize",
  "timecolonwidth",
  "sysregion",
  "snapadjustbottom",
  "activealpha",
  "inactivealpha",
  //bitmapfont
  "charwidth",
  "charheight",
  "hspacing",
  "vspacing",
  "timecolonwidth",
  "padtitleright", "padtitleleft", // wasabi:titlebar
  //bool
  "ghost",
  "move",
  "visible",
  "forceuppercase",
  "bold",
  "altbold",
  "rectrgn",
];

const value_kept = [
  "default", //send: parame, default
  "tooltip",
  "font",
  "altfont",
  //colors
  "color",
  "colorband0~16",
];

const forbidden_keys = {
  // component: "identifier",
  // default_x: 'x',
  // default_y: 'y',
  // default_w: 'w',
  // default_h: 'h',
};

const preseved_id_tag = [
  'gammaset', // let id as is:: `<gammaset id="Debian" ...`
]

let seq_id = 1;

/**
 * Element in an XML document.
 */
export class XmlElement {
  /**
   * Name of this element.
   */
  tag: string;

  oid: number; //for render/rerender identify

  /**
   * Attributes on this element.
   */
  // attributes: {[attrName: string]: string | number};
  attributes: { [attrName: string]: string | any };

  /**
   * Child nodes of this element.
   */
  children: XmlElement[];

  /**
   * Parent node of this node, or `null` if this node has no parent.
   */
  parent: XmlElement | null;

  get root(): XmlElement {
    let root:XmlElement = this.parent
    while (root && root.parent){
      root = root.parent
    }
    return root
  }

  // * get nearest parent with tag
  nearest(tag:string): XmlElement {
    let node:XmlElement = this;
    while (true){
      if(node.tag == tag)
        return node;

      if(!node.parent)
        return null;
      
      node = node.parent
    }
  }

  get id(): string {
    return String(this.attributes.id || "");
  }

  // get text(): string{
  //   return
  // }
  // text: string;

  //? support custom property
  // [key: string]: any;

  constructor(
    tag: string = "",
    attributes: { [attrName: string]: string | any } = Object.create(null),
    children: Array<XmlElement> = []
  ) {
    this.oid= ++seq_id;
    // super()
    this.tag = tag.toLowerCase();
    //transform, as needed
    this.attributes = {};
    for (let [k, v] of Object.entries(attributes)) {
      this.setXmlParam(k, v)
      // if (k in forbidden_keys) {
      //   k = forbidden_keys[k];
      // }
      // if (value2lower.includes(k)) {
      //   this.attributes[k] = v.toLowerCase();
      // } else if (value2number.includes(k)) {
      //   //@ts-ignore
      //   this.attributes[k] = Number(v);
      // } else {
      //   this.attributes[k] = v;
      // }
    }
    if(preseved_id_tag.includes(this.tag)){
      this.attributes.id = attributes.id
    }

    // this.attributes = attributes;
    this.children = children.map((c) => {
      // c.detach().parent = this;
      c.parent = this;
      return c;
    });
  }
  setXmlParam(key:string, value:string|any){
    // console.log('receiving XmlParam:',key, '=', value)
    // this.attributes[key] = value
    if (forbidden_keys[key]) {
      key = forbidden_keys[key];
    }
    if (value2lower.includes(key)) {
      this.attributes[key] = value.toLowerCase();
    } else if (value2number.includes(key)) {
      //@ts-ignore
      this.attributes[key] = Number(value);
    } else {
      this.attributes[key] = value;
    }
  }


  /**
   * @api
   */
  init(parent:XmlElement){
    parent.children.push(this)
    this.parent = parent;
  }

  /**
   * delete this from parent
   */
  detach(): XmlElement {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index > -1) {
        // only splice array when item is found
        this.parent.children.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.parent = null;
    }
    return this;
  }
  attachTo(parent:XmlElement){
    this.detach()
    this.parent = parent;
    parent.children.push(this)
  }

  clone() {
    // return structuredClone(this); //* this will transform XMLElement class into an Object
    // Mengkloning atribut secara mendalam
    const attributesClone = { ...this.attributes };
    
    // Membuat instance baru dari constructor yang sama dengan yang asli
    const Klass = this.constructor as typeof XmlElement;
    const cloning =  new Klass(this.tag, attributesClone);


    // Mengkloning anak-anak secara rekursif jika mereka juga merupakan instansi dari XMLElement
    const childrenClone : XmlElement[] = this.children.map(child => {
      const twin = child.clone() 
      twin.attachTo(cloning)

      return twin
    });


    // return new XmlElement(this.name, attributesClone, childrenClone);
    // Membuat instance baru dari constructor yang sama dengan yang asli
    // const Klass = this.constructor as typeof XmlElement;
    // const cloning =  new Klass(this.tag, attributesClone, childrenClone);
    // cloning.oid = ++seq_id
    return cloning;
  }

  /**
   * Merge with rebase strategy: incoming first, than my values.
   * @param incoming
   */
  merge(incoming: XmlElement) {
    this.children = incoming.children;
    try {
      this.children.forEach((c) => (c./* detach(). */parent = this));
    } catch (error) {
      debugger;
    }
    this.attributes = { ...incoming.attributes, ...this.attributes }; // similar to git merge rebase.
  }

  replace(incoming: XmlElement){
    if(this.parent){
      const index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children[index] = incoming;
        incoming.parent = this.parent
      }
      this.parent = null;
    }
    // this.detach()
    return incoming
  }

  /**
   * Change the type of this class, inplace.
   * Useful to have new methods from new class
   * @param klass XMLElement class
   */
  cast(klass: typeof XmlElement) {
    const x = new klass(this.tag, this.attributes, this.children);
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index > -1) {
        this.parent.children[index] = x;
        x.parent = this.parent;
      }
      this.parent = null;
    }
    this.children = []
    this.attributes = {}
    return x;
  }

  /** @returns {{[key: string]: any}} */
  toJSON(): { [key: string]: any } {
    let { parent, children, ...json } = this;
    return Object.assign(json, {
      // name: this.name,
      // attributes: this.attributes,
      children: children.map((child) => child.toJSON()),
    });
  }

  _findObject(id: string): XmlElement {
    // too complex to consol.log here
    const lower = id.toLowerCase();
    if(this.id == lower){
      return this
    }
    let result: XmlElement = null;
    // find in direct children first
    for (const obj of this.children) {
      // if ((obj.id || "").toLowerCase() === lower) {
      if (obj.id  == lower) {
        return obj;
      }
      // result = obj._findObject(lower)
      // if(result) {
      //   return result
      // }
    }
    // find in grand child
    for (const obj of this.children) {
      const found = obj._findObject(id);
      if (found != null) {
        return found;
      }
    }
    return null;
  }
}
