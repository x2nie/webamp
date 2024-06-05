import BaseObject from "./makiClasses/BaseObject";

export default class XmlObj extends BaseObject {
  setXmlAttributes(attributes: { [attrName: string]: string }) {
    for (const [key, value] of Object.entries(attributes)) {
      this.setXmlAttr(key, value);
    }
  }

  setXmlAttr(_key: string, _value: string): boolean {
    return false;
  }

  // setxmlparam(key: string, value: string) {
  //   this.setXmlAttr(key, value);
  // }

  // style() {
  //   debugger
  //   let { x, y, w, h, alpha, visible } = this.attributes;
  //   let style = ""; //`top:${y}px; left:${x}px; color:fuchsia;`;
  //   if (x != null) style += `left:${x}px;`;
  //   if (y != null) style += `top:${y}px;`;
  //   if (w != null) style += `width:${w}px;`;
  //   if (h != null) style += `height:${h}px;`;
  //   if (alpha != null && alpha < 255) style += `opacity:${alpha / 255};`;
  //   if (visible != null && !visible) style += `display:none;`;
  //   return style;
  // }
}
