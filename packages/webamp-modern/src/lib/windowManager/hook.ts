// import { ReactNode, useCallback, useEffect, useState } from "react";

import { reactive, useState, useEnv, toRaw } from "@odoo/owl";
// import { registry } from "@web/core/registry";
import * as SnapUtils from "./snapUtils";
// import * as Selectors from "../selectors";
// import * as Actions from "../actionCreators";
import { WindowInfo, Box, Point, WindowPositions } from "./types";
// import { useTypedSelector, useActionCreator } from "../hooks";
import * as Utils from "./utils";
// import { getX, getY } from "./utils";

// -----------------------------------------------------------------------------
// Window manager code
// -----------------------------------------------------------------------------

export function createWindowService(): WindowManager {
  return reactive(new WindowManager());
}

export function useWindowService(): WindowManager {
  const env = useEnv();
  return useState(env.windowService);
}

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
  // static Windows = {};
  windows = {}; // mapping id => info
  nextId = 1;

  env = useEnv();

  updatePosition(id, left, top) {
    const w = this.windows[id];
    w.x = left;
    w.y = top;
  }

  getWindows(): WindowInfo[] {
    return this.env.ui.app.getContainers().map((container) => {
      const layout = container.getCurLayout();
      return {
        id: container.attributes.id,
        x: container.attributes.x,
        y: container.attributes.y,
        width: layout.attributes.w,
        height: layout.attributes.h,
        el: container.el.props.node.attributes, // reactive version
        visible: true,
      };
    });
    // return Object.values(this.windows);
    // return toRaw(Object.values(this.windows));
  }
  handleMouseDown(id: string, ev: MouseEvent) {
    // const windows = toRaw(this.getWindows().filter(
    //   (w) => w.id != null //&& !getWindowHidden(w.key)
    // ));
    const windows: MovingWindow[] = this.getWindows()
      .filter((w) => w.visible)
      .map((w) => toRaw(w));
    // console.log('dragstart.wins:', windows)
    // windows.forEach((w) => {
    //   if (w.el) {
    //     const bound = w.el.getBoundingClientRect();
    //     w.width = bound.width;
    //     w.height = bound.height;
    //     // console.log(w.id, bound)
    //   }
    // });
    // const current = toRaw(this.windows[id]);
    const current = windows.filter((w) => w.id == id)[0];
    if (current == null) {
      throw new Error(`Tried to move a node that does not exist: ${id}`);
    }

    let movingSet = new Set([current]);
    // Only the main window brings other windows along.
    if (id == "main") {
      const findAllConnected = SnapUtils.traceConnection<WindowInfo>(abuts);
      movingSet = findAllConnected(windows, current);
    }

    const stationary = windows.filter((w) => !movingSet.has(w));
    // console.log('stationary:', JSON.stringify(stationary))
    const moving = Array.from(movingSet);

    moving.forEach((w) => {
      // const w = this.windows[win.id];
      w.ox = w.x;
      w.oy = w.y;
      w.fx = w.x;
      w.fy = w.y;
    });

    const x = Utils.getX(ev);
    const y = Utils.getY(ev);
    const mouseStart = { x, y };
    // console.log('mose-down!',JSON.stringify(moving))

    const workingArea = document
    .querySelector(".window-manager0")
    ?.getBoundingClientRect();
    // const workingArea = window.screen.
    // console.log('workingArea', workingArea)
    const browserWindowSize = {
      width: workingArea?.width || window.screen.availWidth,
      height: workingArea?.height || window.screen.availHeight,
    };
    // console.log('browserWindowSize:',JSON.stringify(browserWindowSize))

    // const updateWindowPositions0 = (newPositions: WindowPositions) =>{
    //   console.log('updated:',JSON.stringify(newPositions))
    //   for(const [id,att] of Object.entries(newPositions)){
    //     const w = this.windows[id];
    //     w.x = (att.x - mouseStart.x) + w.ox ;
    //     w.y = (att.y - mouseStart.y) + w.oy;
    //   }
    // }

    const updateWindowPositions = (p: Point) => {
      // console.log('updated:',JSON.stringify(p))
      // debugger
      moving.forEach((w) => {
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
        const el = w.el!;
        // el.style.top = `${y}px`;
        // el.style.left = `${x}px`;
        // debugger
        el.y = y;
        el.x = x;
        // el.attributes.y = y;
        // el.attributes.x = x;
        // const win = this.windows[w.id];
        // win.x = x;
        // win.y = y;
        // console.log('moving to:', el.x, el.y)
      });
      // }
    };

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
      //? maybe multi-screen? https://stackoverflow.com/questions/18377996/get-monitor-count

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
      window.removeEventListener("mousemove", handleMouseMove);
      // el.classList.remove("dragging");

      // if (top !== undefined && left !== undefined) {
      //   self.windowService.updatePosition(current.id, left, top);
      // }
      moving.forEach((w) => {
        const win = this.windows[w.id];
        // w.fx = p.x + w.ox;
        // w.fy = p.y + w.oy;
//        win.x = w.fx;
//        win.y = w.fy;

        // let x = p.x + w.ox;
        // let y = p.y + w.oy;
        // let {id, width, height } = w;
        // document.getElementById(`${id}`)?.setAttribute('style', `width:${width}px; height:${height}px; top:${y}px; left:${x}px;`);
        // const w = this.windows[win.id];
        // w.x = x;
        // w.y = y;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDnD, { once: true });
  }
}
