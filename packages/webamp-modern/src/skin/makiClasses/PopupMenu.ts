import BaseObject from "./BaseObject";
import { assume } from "../../utils";
import { MenuItem, IPopupMenu, generatePopupDiv, extractCaption } from "./MenuItem";
import { UIRoot } from "../../UIRoot";
// import { sleep } from 'deasync';
// import { deasync } from '@kaciras/deasync';
// import sp from 'synchronized-promise';

// taken from sp test
// const asyncFunctionBuilder =
//   (success) =>
//   (value, timeouts = 1000) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(function () {
//         if (success) {
//           resolve(value);
//         } else {
//           reject(new TypeError(value));
//         }
//       }, timeouts);
//     });
//   };
// const async_sleep = (timeout) => {
// 	// setTimeout(() => done(null, "wake up!"), timeout);
//   const done = () => {}
//   setTimeout(done, timeout)
// };
// const sleep = sp(async_sleep)
// const sleep = sp(asyncFunctionBuilder(true))



 function waitPopup(popup: IPopupMenu): Promise<number> {
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

export default class PopupMenu extends BaseObject implements IPopupMenu {
  static GUID = "f4787af44ef7b2bb4be7fb9c8da8bea9";
  children: MenuItem[] = [];
  _uiRoot: UIRoot;
  
  constructor(uiRoot: UIRoot) {
    super();
    this._uiRoot = uiRoot;

    // this._div = document.createElement(
    //   this.getElTag().toLowerCase().replace("_", "")
    // );
  }
  addcommand(
    cmdText: string,
    cmd_id: number,
    checked: boolean,
    disabled: boolean
  ) {
    this.children.push({
      type: "menuitem",
      // caption: cmdText,
      ...extractCaption(cmdText),
      id: cmd_id,
      checked,
      disabled,
    });
  }
  addseparator() {
    this.children.push({ type: "separator" });
  }
  addsubmenu(popup: PopupMenu, submenutext: string) {
    // this.children.push({ type: "popup", popup: popup, caption: submenutext });
    this.children.push({ type: "popup", popup: popup, ...extractCaption(submenutext) });
    // // TODO:
    // this.addcommand(submenutext, 0, false, false)
  }
  checkcommand(cmd_id: number, check: boolean) {
    const item = this.children.find((item) => {
      return item.type === "menuitem" && item.id === cmd_id;
    });
    assume(item != null, `Could not find item with id "${cmd_id}"`);
    if (item.type !== "menuitem") {
      throw new Error("Expected item to be an item.");
    }
    item.checked = check;
  }
  disablecommand(cmd_id: number, disable: boolean) {
    for (const item of this.children) {
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
  //   const message = this.children.map((item) => {
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
  //     !this.children.some((item) => item.type === "item" && item.id === choice)
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
    return this.children.length;
  }

  hideMenu(cmd_id: number) {
    for (const item of this.children) {
      if (item.type == "menuitem" && item.id == cmd_id) {
        item.invisible = true;
        break;
      }
    }
  }

}
