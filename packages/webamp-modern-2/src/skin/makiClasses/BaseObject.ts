import UI_ROOT from "../../UIRoot";

/**
 * This is the base class from which all other classes inherit.
 */
export default class BaseObject {
  //             516549710d874a5191e3a6b53235f3e7
  static GUID = "516549710D874a5191E3A6B53235F3E7";
  constructor() {
    UI_ROOT.addObject(this);
  }
  /**
   * Returns the class name for the object.
   *
   * @ret The class name.
   */
  getclassname(): string {
    return 'this.constructor.name';
    throw new Error("Unimplemented");
  }

  getId() {
    throw new Error("Unimplemented");
  }

  dispose() {
    // Pass
  }
}
