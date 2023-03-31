import { UIRoot } from "../../UIRoot";
import PopupMenu from "./PopupMenu";
import { IMenuItem, IPopupMenu, MenuItem } from "./MenuItem";

type MenuActionEvent = (menu: MenuItem, uiRoot: UIRoot) => void;
type MenuActionExecution = (uiRoot: UIRoot) => boolean | void;
type MenuAction = {
    onUpdate?: MenuActionEvent;     //? attemp to update disability, checkmark, visiblity, etc
    onExecute?: MenuActionExecution;    //? function to run when menu is clicked
}
const dummyAction: MenuAction = {
    onUpdate: (menu: MenuItem) => { },
    onExecute: (uiRoot: UIRoot) => false,
}

export const actions: { [key: number]: MenuAction } = {};
export const findAction = (menuId:number): MenuAction => {
    const registeredAction = actions[menuId] || {}
    return {...dummyAction, ...registeredAction}
}
export async function updateActions(popup: IPopupMenu, uiRoot: UIRoot) {
    return await Promise.all(
        popup.children.map(async (menuItem) => {
            if (menuItem.type == 'menuitem') {
                const action = findAction(menuItem.id);
                action.onUpdate(menuItem, uiRoot)
            } else if (menuItem.type == 'popup') {
                await updateActions(menuItem.popup, uiRoot)
            }
        })
    );
}

const register = (menuId: number, action: MenuAction) => {
    actions[menuId] = action;
}

register(40037, { //? Time elapsed
    onUpdate: (menu: IMenuItem, uiRoot: UIRoot) => { menu.checked = !uiRoot.audio._timeRemaining },
    onExecute: (uiRoot: UIRoot) => { uiRoot.audio._timeRemaining = false; return true },
})

register(40038, { //? Time remaining
    onUpdate: (menu: IMenuItem, uiRoot: UIRoot) => { menu.checked = uiRoot.audio._timeRemaining },
    onExecute: (uiRoot: UIRoot) => { uiRoot.audio._timeRemaining = true; return true },
})

register(40044, { //? Previous
    onExecute: (uiRoot: UIRoot) => uiRoot.dispatch('prev')
})

register(40045, { //? Play
    onExecute: (uiRoot: UIRoot) => uiRoot.dispatch('play')
})

register(40046, { //? Pause
    onExecute: (uiRoot: UIRoot) => uiRoot.dispatch('pause')
})

register(40047, { //? Stop
    onExecute: (uiRoot: UIRoot) => uiRoot.dispatch('stop')
})

register(40048, { //? Next
    onExecute: (uiRoot: UIRoot) => uiRoot.dispatch('next')
})


register(11111140038, { //? 
    onUpdate: (menu: MenuItem) => { }
})