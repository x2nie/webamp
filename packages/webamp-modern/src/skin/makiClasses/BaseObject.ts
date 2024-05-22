import { XmlElement } from "@lib/xml";

/**
 * This is the base class from which all other classes inherit.
 */
export default class BaseObject extends XmlElement {
  static GUID = "516549714a510d87b5a6e391e7f33532";

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

  dispose() {
    // Pass
  }
}
