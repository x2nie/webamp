import BaseObject from "./BaseObject";
import { assume } from "../../utils";
// import { sleep } from 'deasync';
// import { deasync } from '@kaciras/deasync';
// import sp from 'synchronized-promise';

// taken from sp test
const asyncFunctionBuilder =
  (success) =>
  (value, timeouts = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        if (success) {
          resolve(value);
        } else {
          reject(new TypeError(value));
        }
      }, timeouts);
    });
  };
// const async_sleep = (timeout) => {
// 	// setTimeout(() => done(null, "wake up!"), timeout);
//   const done = () => {}
//   setTimeout(done, timeout)
// };
// const sleep = sp(async_sleep)
// const sleep = sp(asyncFunctionBuilder(true))

export type MenuItem =
  | {
      type: "menuitem";
      caption: string;
      id: number;
      checked: boolean;
      disabled?: boolean;
    }
    | { type: "separator" }
    | {
      type: "popup";
      caption: string;
      popup: PopupMenu;
      disabled?: boolean;
      children?: MenuItem[];
    };

 function waitPopup(popup: PopupMenu): Promise<number> {
   // const closePopup = () => div.remove();
   
   // https://stackoverflow.com/questions/54916739/wait-for-click-event-inside-a-for-loop-similar-to-prompt
   return new Promise(acc => {
    // let result: number = -1;
    const itemClick = (id: number) => {
      closePopup()
      // result = id;
      acc(id);
    };
    const div = generatePopupDiv(popup, itemClick);
    document.getElementById("web-amp").appendChild(div);
    const closePopup = () => div.remove()

    function handleClick() {
      document.removeEventListener('click', handleClick);
      closePopup()
      acc(-1);
    }
    document.addEventListener('click', handleClick);
  });
  // return 1;
}

function generatePopupDiv(popup: PopupMenu, callback: Function): HTMLElement {
  const root = document.createElement("ul");
  root.className = 'popup-menu-container'
  root.style.zIndex = "1000";
  for (const menu of popup._items) {
    // const menuitem = document.createElement("li");
    let item;
    // root.appendChild(item);
    if (menu.type == "menuitem") {
      item = document.createElement("li");
      item.textContent = `${menu.checked? '✓' : ' '} ${menu.caption}`;
      item.onclick = (e) => callback(menu.id);
    } else if (menu.type == "popup") {
      item = document.createElement("li");
      item.textContent = menu.caption;
    } else if (menu.type == "separator") {
      item = document.createElement("hr");
      // item.textContent = "-----";
      // item.appendChild(document.createElement("hr")) ;
    }
    root.appendChild(item);
  }
  return root;
}

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
      type: "menuitem",
      caption: cmdText,
      id: cmd_id,
      checked,
      disabled,
    });
  }
  addseparator() {
    this._items.push({ type: "separator" });
  }
  addsubmenu(popup: PopupMenu, submenutext: string) {
    this._items.push({ type: "popup", popup: popup, caption: submenutext });
    // // TODO:
    // this.addcommand(submenutext, 0, false, false)
  }
  checkcommand(cmd_id: number, check: boolean) {
    const item = this._items.find((item) => {
      return item.type === "menuitem" && item.id === cmd_id;
    });
    assume(item != null, `Could not find item with id "${cmd_id}"`);
    if (item.type !== "menuitem") {
      throw new Error("Expected item to be an item.");
    }
    item.checked = check;
  }
  disablecommand(cmd_id: number, disable: boolean) {
    for (const item of this._items) {
      if (item.type == "menuitem" && item.id == cmd_id) {
        item.disabled = disable;
        break;
      }
    }
  }
  async popatmouse(): Promise<number> {
    console.log('popAtMouse.start...:')
    const result = await waitPopup(this)
    console.log('popAtMouse.return:', result)
    return result;
  }
  async popatxy(x:number, y:number):Promise<number>{
    return await waitPopup(this)
  }

  // popatmouse(): number {
  //   const message = this._items.map((item) => {
  //     switch (item.type) {
  //       case "separator":
  //         return "------";
  //       case "item":
  //         return `(${item.id}) ${item.text}${item.checked ? " ✔" : ""}`;
  //     }
  //   });
  //   message.unshift("Pick the number matching your choice:\n");
  //   let choice: number | null = null;
  //   while (
  //     !this._items.some((item) => item.type === "item" && item.id === choice)
  //   ) {
  //     choice = Number(window.prompt(message.join("\n")));
  //     if (choice == 0) break;
  //   }
  //   // TODO: Validate

  //   return choice;
  // }
  // popatxy(x: number, y: number): number {
  //   return this.popatmouse();
  // }
  getnumcommands() {
    return this._items.length;
  }
}
