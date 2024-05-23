type PosEvent = MouseEvent | TouchEvent;


function getPos(e: PosEvent): { clientX: number; clientY: number } {
  switch (e.type) {
    case "touchstart":
    case "touchmove": {
      const touch =
        (e as TouchEvent).targetTouches[0] ?? (e as TouchEvent).touches[0];
      if (touch == null) {
        // Investigating https://github.com/captbaritone/webamp/issues/1105
        throw new Error("Unexpected touch event with zero touch targets.");
      }
      return touch;
    }
    case "mousedown":
    case "mousemove": {
      return e as MouseEvent;
    }
    default:
      throw new Error(`Unexpected event type: ${e.type}`);
  }
}


export function getX(e: PosEvent) {
    return getPos(e).clientX;
  }
  
  export function getY(e: PosEvent) {
    return getPos(e).clientY;
  }
  