import { XmlElement } from "@lib/xml";
import { Component } from "@odoo/owl";

/**
 * This is the base class from which all other classes inherit.
 */
export default class BaseObject extends XmlElement {
  static GUID = "516549714a510d87b5a6e391e7f33532";

  el : Component;

  /**
   * Returns the class name for the object.
   *
   * @ret The class name.
   */
  getClassName(): string {
    return this.tag;
  }

  getId() {
    return this.attributes.id;
  }

  /**
   * @ret
   * @param  command
   * @param  param
   * @param  a
   * @param  b
   */
  onNotify(command: string, param: string, a: number, b: number): number {
    // this.trigger('Notify', )
  }

  dispose() {
    // Pass
  }
}
