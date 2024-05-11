// import { ReactNode, useCallback, useEffect, useState } from "react";

import { toRaw } from "@odoo/owl";
import * as SnapUtils from "./snapUtils";
// import * as Selectors from "../selectors";
// import * as Actions from "../actionCreators";
import { WindowInfo, WindowId, Box, Point, WindowPositions } from "./types";
// import { useTypedSelector, useActionCreator } from "../hooks";
import * as Utils from "./utils";

const abuts = (a: Box, b: Box) => {
  // TODO: This is kinda a hack. They should really be touching, not just within snapping distance.
  // Also, overlapping should not count.
  const wouldMoveTo = SnapUtils.snap(a, b);
  return wouldMoveTo.x !== undefined || wouldMoveTo.y !== undefined;
};

interface Props {
  windows: { [windowId: string]: WindowInfo };
}

type DraggingState = {
  moving: WindowInfo[];
  stationary: WindowInfo[];
  boundingBox: Box;
  mouseStart: Point;
};

interface MovingWindow extends WindowInfo {
  //? original pos
  ox?: number;
  oy?: number;
  //? final pos
  fx?: number;
  fy?: number;
}

// -----------------------------------------------------------------------------
// Window manager code
// -----------------------------------------------------------------------------

export class WindowManager {
  // contains all components with metadata
  static Windows = {};
  windows = {}; // mapping id => info
  nextId = 1;

  add(type) {
    const Comp = WindowManager.Windows[type];
    const x =
      50 +
      Math.round(Math.random() * (window.innerWidth - 50 - Comp.defaultWidth));
    const y =
      50 +
      Math.round(
        Math.random() * (window.innerHeight - 100 - Comp.defaultHeight)
      );
    const id = this.nextId++;
    this.windows[id] = {
      id,
      title: Comp.defaultTitle,
      width: Comp.defaultWidth,
      height: Comp.defaultHeight,
      x,
      y,
      Component: Comp,
    };
  }

  setElement(id:number, el: HTMLElement){
    this.windows[id].el = el;
  }

  close(id) {
    delete this.windows[id];
  }

  updatePosition(id, left, top) {
    const w = this.windows[id];
    w.x = left;
    w.y = top;
  }

  getWindows(): WindowInfo[] {
    return Object.values(this.windows);
    // return toRaw(Object.values(this.windows));
  }
  handleMouseDown(id:number, ev: MouseEvent){
    // const windows = toRaw(this.getWindows().filter(
    //   (w) => w.id != null //&& !getWindowHidden(w.key)
    // ));
    const windows: MovingWindow[] = this.getWindows().map(w => toRaw(w))
    // const current = toRaw(this.windows[id]);
    const current = windows.filter(w => w.id == id)[0];
    if (current == null) {
      throw new Error(`Tried to move a node that does not exist: ${id}`);
    }
    
    let movingSet = new Set([current]);
    // Only the main window brings other windows along.
    if (id == 1) {
      const findAllConnected = SnapUtils.traceConnection<WindowInfo>(abuts);
      movingSet = findAllConnected(windows, current);
    }
    
    const stationary = windows.filter((w) => !movingSet.has(w));
    // console.log('stationary:', JSON.stringify(stationary))
    const moving = Array.from(movingSet);
    
    moving.forEach(w => {
      // const w = this.windows[win.id];
      w.ox = w.x;
      w.oy = w.y;
      w.fx = w.x;
      w.fy = w.y;
    })


    const x = Utils.getX(ev);
    const y = Utils.getY(ev);
    const mouseStart = { x, y };
    // console.log('mose-down!',JSON.stringify(moving))
    
    const workingArea = document.querySelector('.window-manager')?.getBoundingClientRect()
    const browserWindowSize = {width: workingArea?.width || 0, height: workingArea?.height || 0};
    // console.log('browserWindowSize:',JSON.stringify(browserWindowSize))
    
    // const updateWindowPositions0 = (newPositions: WindowPositions) =>{
    //   console.log('updated:',JSON.stringify(newPositions))
    //   for(const [id,att] of Object.entries(newPositions)){
    //     const w = this.windows[id];
    //     w.x = (att.x - mouseStart.x) + w.ox ;
    //     w.y = (att.y - mouseStart.y) + w.oy;
    //   }
    // }
    
    const updateWindowPositions = (p: Point) =>{
      // console.log('updated:',JSON.stringify(p))
      // debugger
      moving.forEach(w => {
        // const w = this.windows[win.id];
        // win.x = w.x;
        // win.y = w.y;
        
        const x = p.x + w.ox!;
        const y = p.y + w.oy!;

        w.fx = x;
        w.fy = y;
        // let {id, width, height } = w;
        // document.getElementById(`${id}`)?.setAttribute('style', `width:${width}px; height:${height}px; top:${y}px; left:${x}px;`);
        // const el =  document.getElementById(`${w.id}`)!
        const el =  w.el!;
        el.style.top = `${y}px`
        el.style.left = `${x}px`
        // const win = this.windows[w.id];
        // win.x = x;
        // win.y = y;
      })
      // }
    }
    
    const boundingBox = SnapUtils.boundingBox(moving);
    const handleMouseMove = (ee: MouseEvent | TouchEvent) => {

      const proposedDiff = {
        x: Utils.getX(ee) - mouseStart.x,
        y: Utils.getY(ee) - mouseStart.y,
      };
      // console.log('mose-move!', proposedDiff)

      //? windows wanna be (position)
      const proposedWindows = moving.map((node) => ({
        ...node,
        ...SnapUtils.applyDiff(node, proposedDiff),
      }));

      const proposedBox = {
        ...boundingBox,
        ...SnapUtils.applyDiff(boundingBox, proposedDiff),
      };

      const snapDiff = SnapUtils.snapDiffManyToMany(
        proposedWindows,
        stationary
      );

      const withinDiff = SnapUtils.snapWithinDiff(
        proposedBox,
        browserWindowSize
      );

      const finalDiff = SnapUtils.applyMultipleDiffs(
        proposedDiff,
        snapDiff,
        withinDiff
      );
      // console.log('finalDif:', finalDiff)

      // const windowPositionDiff: { [windowId: string]: Point } = {};
      // moving.forEach((w) => {
      //   windowPositionDiff[w.id] = SnapUtils.applyDiff(w, finalDiff);
      // });

      updateWindowPositions(finalDiff);
    };

    // const debouncedMouseMove = Utils.debounce(handleMouseMove, 51);//.bind(this)
    const debouncedMouseMove = handleMouseMove;

    // const offsetX = current.x - ev.pageX;
    // const offsetY = current.y - ev.pageY;
    // let left, top;

    
    // function moveWindow(ev) {
    //   left = Math.max(offsetX + ev.pageX, 0);
    //   top = Math.max(offsetY + ev.pageY, 0);
    //   current.x = left;
    //   current.y = top;
    // }
    const stopDnD = () => {
      window.removeEventListener("mousemove", debouncedMouseMove);
      // el.classList.remove("dragging");

      // if (top !== undefined && left !== undefined) {
      //   self.windowService.updatePosition(current.id, left, top);
      // }
      moving.forEach(w => {
        const win = this.windows[w.id];
        // w.fx = p.x + w.ox;
        // w.fy = p.y + w.oy;
        win.x = w.fx;
        win.y = w.fy;

        // let x = p.x + w.ox;
        // let y = p.y + w.oy;
        // let {id, width, height } = w;
        // document.getElementById(`${id}`)?.setAttribute('style', `width:${width}px; height:${height}px; top:${y}px; left:${x}px;`);
        // const w = this.windows[win.id];
        // w.x = x;
        // w.y = y;
      })
    }
    window.addEventListener("mousemove", debouncedMouseMove);
    window.addEventListener("mouseup", stopDnD, { once: true });
  }
  
  handleMouseDown0(id:string, ev: MouseEvent){
    const current = this.windows[id];
    const offsetX = current.x - ev.pageX;
    const offsetY = current.y - ev.pageY;
    let left, top;

    window.addEventListener("mousemove", moveWindow);
    window.addEventListener("mouseup", stopDnD, { once: true });

    function moveWindow(ev) {
      left = Math.max(offsetX + ev.pageX, 0);
      top = Math.max(offsetY + ev.pageY, 0);
      // el.style.left = `${left}px`;
      // el.style.top = `${top}px`;
      current.x = left;
      current.y = top;
    }
    function stopDnD() {
      window.removeEventListener("mousemove", moveWindow);
      // el.classList.remove("dragging");

      // if (top !== undefined && left !== undefined) {
      //   self.windowService.updatePosition(current.id, left, top);
      // }
    }
  }
}

/*
function useHandleMouseDown0(propsWindows: {
  [windowId: string]: WindowInfo;
}): (
  key: WindowId,
  e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
) => void {
  const windowsInfo = useTypedSelector(Selectors.getWindowsInfo);
  const getWindowHidden = useTypedSelector(Selectors.getWindowHidden);
  const browserWindowSize = useTypedSelector(Selectors.getBrowserWindowSize);
  const updateWindowPositions = useActionCreator(Actions.updateWindowPositions);

  const [draggingState, setDraggingState] = useState<DraggingState | null>(
    null
  );

  // When the mouse is down, attach a listener to track mouse move events.
  useEffect(() => {
    if (draggingState == null) {
      return;
    }
    const { boundingBox, moving, stationary, mouseStart } = draggingState;
    const handleMouseMove = (ee: MouseEvent | TouchEvent) => {
      const proposedDiff = {
        x: Utils.getX(ee) - mouseStart.x,
        y: Utils.getY(ee) - mouseStart.y,
      };

      const proposedWindows = moving.map((node) => ({
        ...node,
        ...SnapUtils.applyDiff(node, proposedDiff),
      }));

      const proposedBox = {
        ...boundingBox,
        ...SnapUtils.applyDiff(boundingBox, proposedDiff),
      };

      const snapDiff = SnapUtils.snapDiffManyToMany(
        proposedWindows,
        stationary
      );

      const withinDiff = SnapUtils.snapWithinDiff(
        proposedBox,
        browserWindowSize
      );

      const finalDiff = SnapUtils.applyMultipleDiffs(
        proposedDiff,
        snapDiff,
        withinDiff
      );

      const windowPositionDiff: { [windowId: string]: Point } = {};
      moving.forEach((w) => {
        windowPositionDiff[w.key] = SnapUtils.applyDiff(w, finalDiff);
      });

      updateWindowPositions(windowPositionDiff, false);
    };

    function handleMouseUp() {
      setDraggingState(null);
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    window.addEventListener("mousemove", handleMouseMove, { passive: false });
    window.addEventListener("touchmove", handleMouseMove, { passive: false });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [browserWindowSize, draggingState, updateWindowPositions]);

  // Mouse down handler
  return useCallback(
    (
      key: WindowId,
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (!(e.target as HTMLElement).classList.contains("draggable")) {
        return;
      }

      const x = Utils.getX(e);
      const y = Utils.getY(e);

      if (getWindowHidden(key)) {
        // The user may be clicking on full screen Milkdrop.
        return;
      }

      const windows = windowsInfo.filter(
        (w) => propsWindows[w.key] != null && !getWindowHidden(w.key)
      );
      const targetNode = windows.find((node) => node.key === key);
      if (targetNode == null) {
        throw new Error(`Tried to move a node that does not exist: ${key}`);
      }

      let movingSet = new Set([targetNode]);
      // Only the main window brings other windows along.
      if (key === "main") {
        const findAllConnected = SnapUtils.traceConnection<WindowInfo>(abuts);
        movingSet = findAllConnected(windows, targetNode);
      }

      const stationary = windows.filter((w) => !movingSet.has(w));
      const moving = Array.from(movingSet);

      const mouseStart = { x, y };

      const boundingBox = SnapUtils.boundingBox(moving);
      setDraggingState({ boundingBox, moving, stationary, mouseStart });
    },
    [getWindowHidden, propsWindows, windowsInfo]
  );
}
*/

/*export default function WindowManager0({ windows: propsWindows }: Props) {
  const windowsInfo = useTypedSelector(Selectors.getWindowsInfo);
  const setFocusedWindow = useActionCreator(Actions.setFocusedWindow);
  const handleMouseDown = useHandleMouseDown(propsWindows);

  const windows = windowsInfo.filter((w) => propsWindows[w.key]);

  const onBlur = useCallback(
    // I give up on trying to type things with `relatedTarget`.
    (e: any) => {
      const { currentTarget, relatedTarget } = e;
      if (
        currentTarget === relatedTarget ||
        currentTarget.contains(relatedTarget)
      ) {
        return;
      }
      setFocusedWindow(null);
    },
    [setFocusedWindow]
  );

  return (
    <>
      {windows.map((w) => (
        <div
          key={w.key}
          onBlur={onBlur}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            handleMouseDown(w.key, e);
          }}
          onTouchStart={(e: React.TouchEvent<HTMLDivElement>) => {
            handleMouseDown(w.key, e);
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${w.x}px, ${w.y}px)`,
            touchAction: "none",
          }}
        >
          {propsWindows[w.key]}
        </div>
      ))}
    </>
  );
}
 */