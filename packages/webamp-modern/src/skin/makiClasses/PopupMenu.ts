import BaseObject from "./BaseObject";
import { assume } from "../../utils";

type MenuItem =
  | {
      type: "item";
      text: string;
      id: number;
      checked: boolean;
      disabled: boolean;
    }
  | { type: "separator" };

export default class PopupMenu extends BaseObject {
  static GUID = "f4787af44ef7b2bb4be7fb9c8da8bea9";
  _items: MenuItem[] = [];
  addcommand(
    cmdText: string,
    cmd_id: number,
    checked: boolean,
    disabled: boolean
  ) {
    this._items.push({
      type: "item",
      text: cmdText,
      id: cmd_id,
      checked,
      disabled,
    });
  }
  addseparator() {
    this._items.push({ type: "separator" });
  }
  addsubmenu(submenu: PopupMenu, submenutext: string){
    //TODO:
    this.addcommand(submenutext, 0, false, false)
  }
  checkcommand(cmd_id: number, check: boolean) {
    const item = this._items.find((item) => {
      return item.type === "item" && item.id === cmd_id;
    });
    assume(item != null, `Could not find item with id "${cmd_id}"`);
    if (item.type !== "item") {
      throw new Error("Expected item to be an item.");
    }
    item.checked = check;
  }
  disablecommand(cmd_id:number, disable: boolean){
    for (const item of this._items) {
      if(item.type == 'item' && item.id == cmd_id){
        item.disabled = disable;
        break;
      }
    }
  }
  popatmouse(): number {
    const message = this._items.map((item) => {
      switch (item.type) {
        case "separator":
          return "------";
        case "item":
          return `(${item.id}) ${item.text}${item.checked ? " ✔" : ""}`;
      }
    });
    message.unshift("Pick the number matching your choice:\n");
    let choice: number | null = null;
    while (
      !this._items.some((item) => item.type === "item" && item.id === choice)
    ) {
      choice = Number(window.prompt(message.join("\n")));
      if(choice==0) break;
    }
    // TODO: Validate

    return choice;
  }
  popatxy(x:number, y:number):number{
    return this.popatmouse()
  }
  getnumcommands(){
    return this._items.length;
  }

  /*
extern PopupMenu.addSubMenu(PopupMenu submenu, String submenutext);
extern Int PopupMenu.popAtXY(int x, int y);
extern Int PopupMenu.popAtMouse();
extern Int PopupMenu.getNumCommands();
extern PopupMenu.disableCommand(int cmd_id, boolean disable);
  */
}
