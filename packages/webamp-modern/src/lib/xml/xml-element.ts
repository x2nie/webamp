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
  "notfoundImage", // ALbumArt
];

export const value2number = [
  "x",
  "y",
  "w",
  "h",
  "relatex",
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
  //bool
  "ghost",
  "visible",
  "forceuppercase",
  "altbolt",
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
  component: "identifier",
};


/**
 * Element in an XML document.
 */
export class XmlElement {
  /**
   * Name of this element.
   */
  tag: string;

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

  get id(): string {
    return String(this.attributes.id || "");
  }

  // get text(): string{
  //   return
  // }
  // text: string;

  [key: string]: any;

  constructor(
    tag: string = "",
    attributes: { [attrName: string]: string | any } = Object.create(null),
    children: Array<XmlElement> = []
  ) {
    //transform, as needed
    this.attributes = {};
    for (let [k, v] of Object.entries(attributes)) {
      if (k in forbidden_keys) {
        k = forbidden_keys[k];
      }
      if (value2lower.includes(k)) {
        this.attributes[k] = v.toLowerCase();
      } else if (value2number.includes(k)) {
        //@ts-ignore
        this.attributes[k] = Number(v);
      } else {
        this.attributes[k] = v;
      }
    }

    this.tag = tag.toLowerCase();
    // this.attributes = attributes;
    this.children = children;
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

  clone() {
    return structuredClone(this);
  }

  /**
   * Merge with rebase strategy.
   * @param base
   */
  merge(base: XmlElement) {
    this.children = base.children;
    this.children.forEach((c) => (c.parent = this));
    this.attributes = { ...base.attributes, ...this.attributes }; // similar to git merge rebase.
  }

  /** @returns {{[key: string]: any}} */
  toJSON(): { [key: string]: any; } {
    let {parent, children, ...json} = this;
    return Object.assign(json, {
      // name: this.name,
      // attributes: this.attributes,
      children: children.map(child => child.toJSON()),
    });
  }
}
