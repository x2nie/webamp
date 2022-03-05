import Group from "./Group";
import * as Utils from "../../utils";
import Container from "./Container";

// > A layout is a special kind of group, which shown inside a container. Each
// > layout represents an appearance for that window. Layouts give you the ability
// > to design different looks for the same container (or window). However, only
// > one layout can be visible at a time. You must toggle among layouts you
// > defined. An example is the normal mode and windowshade mode in the Default
// > skin.
//
// -- http://wiki.winamp.com/wiki/Modern_Skin:_Container
export default class Layout extends Group {
  static GUID = "60906d4e482e537e94cc04b072568861";
  // _parentContainer: Container | null = null;
  _isLayout:boolean=true;
  _snap = {left:0, top:0, right:0, bottom:0}

  setXmlAttr(key: string, value: string): boolean {
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    switch (key) {
      case "desktopalpha":
        this._desktopAlpha = Utils.toBool(value);
        break;
      default:
        return false;
    }
    return true;
  }

  setParentContainer(container: Container) {
    this._parent = container as unknown as Group;
  }
  getcontainer(): Container {
    return this._parent as unknown as Container;
  }

  gettop(): number {
    return this._parent._y;
  }

  /**
   * Get the X position, in the screen, of the
   * left edge of the object.
   *
   * @ret The left edge's position (in screen coordinates).
   */
  getleft(): number {
    return this._parent._x;
  }

  dispatchAction(
    action: string,
    param: string | null,
    actionTarget: string | null
  ) {
    // TODO: Maybe this should move to the container?
    if (actionTarget != null) {
      const target = this.findobject(actionTarget);
      if (target != null) {
        target.handleAction(action, param, actionTarget);
      }
      return;
    }
    switch (action) {
      default:
        if (this._parent != null) {
          this._parent.dispatchAction(action, param, actionTarget);
        }
    }
  }

  snapadjust(left:number, top:number, right:number, bottom:number){
    this._snap.left=left;
    this._snap.top=top;
    this._snap.right=right;
    this._snap.bottom=bottom;
  }

  draw() {
    super.draw();
    // this._div.setAttribute("data-obj-name", "Layout");
  }
}
