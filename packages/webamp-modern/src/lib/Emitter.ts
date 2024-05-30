export class Emitter {
    _cbs: { [event: string]: Array<Function> } = {};
  
    // call this to register a callback to a specific event
    on(event: string, cb: Function): Function {
      if (this._cbs[event] == null) {
        this._cbs[event] = [];
      }
      this._cbs[event].push(cb);
  
      // return a function for later unregistering
      return () => {
        //TODO: consider using this.off(), or integrate both
        this._cbs[event] = this._cbs[event].filter((c) => c !== cb);
      };
    }
  
    // remove an registered callback from a specific event
    off(event: string, cb: Function) {
      if (this._cbs[event] == null) {
        return;
      }
      const cbs = this._cbs[event];
      const index = cbs.indexOf(cb, 0);
      if (index > -1) {
        cbs.splice(index, 1);
      }
    }
  
    // call this to run registered callbacks of an event
    trigger(event: string, ...args: any[]) {
      const subscriptions = this._cbs[event];
      if (subscriptions == null) {
        return;
      }
      for (const cb of subscriptions) {
        cb(...args);
      }
    }
  }
  