import { registry } from "@web/core/registry";
import { Script } from "./Script";
import { assume } from "./utils";

export default class Timer {
    static GUID = "5d0c5bb64b1f7de1168d0fa741199459";
    // _uiRoot: UIRoot;
    _delay: number = 5000; //x2nie
    _timeout: NodeJS.Timeout | null = null;
    // _onTimer: () => void = null;
  
    constructor(private script: Script) {
    //   super();
    //   this._uiRoot = uiRoot;
    //   TIMER_IDS += 1;
    //   this._id = `timer_${TIMER_IDS}`;
    }
  
    setDelay(millisec: number) {
    console.log(`timer.setDelay(${millisec})`)
      // assume(
      //   this._timeout == null,
      //   "Tried to change the delay on a running timer"
      // );
      const running = this.isrunning();
      if (running) this.stop();
      this._delay = millisec;
      if (running) this.start();
    }
    stop() {
    console.log('timer.stop()')
      if (this._timeout != null) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }
    // async start(): Promise<boolean> {
    start(): boolean {
      console.log('timer.start()')
      if (!this._delay) {
        return false;
      }
      const self = this;
  
      try {
        assume(this._delay != null, "Tried to start a timer without a delay");
        if (this.isrunning()) {
          this.stop();
        }
        this._timeout = setInterval(() => {
          // console.log('timer.ontimer()', this._nid)
          // this._uiRoot.vm.dispatch(self, "ontimer");
          self.doTimer();
        }, this._delay);
        return true;
      } catch (err) {
        return false;
      }
      return false;
    }
  
    doTimer() {
      // console.log('timer.ontimer()', this._nid)
    //   if (this._onTimer != null) {
    //     this._onTimer();
    //   } else {
        // this._uiRoot.vm.dispatch(this, "ontimer");
    //   }
        this.script.dispatch(this, 'onTimer')
    }
  
    // onTimer() {
    //   this._uiRoot.vm.dispatch(this, "ontimer");
    // }
  
    // setOnTimer(callback: () => void) {
    //   const handler = () => {
    //     callback();
    //   };
    //   this._onTimer = handler;
    //   // this._onTimer = callback;
    // }
  
    isrunning(): boolean {
      return this._timeout != null;
    }
  
    getDelay(): number {
      return this._delay;
    }
  
    getSkipped(): number {
      return 0;
    }
    /*
  extern Int Timer.getSkipped();
  */
}
 
registry.category("component").add("timer", Timer);