
export interface Point {
    x: number;
    y: number;
  }
  
  export interface Diff {
    x?: number;
    y?: number;
  }
  
  export interface BoundingBox {
    width: number;
    height: number;
  }
  
  export interface Box extends Point {
    width: number;
    height: number;
  }


export interface WindowInfo extends Box {
    // id: WindowId;
    id: string;
    visible?: boolean;
    el?: HTMLElement;
  }
  
  export type WindowPositions = {
    [windowId: string]: Point;
  };
  