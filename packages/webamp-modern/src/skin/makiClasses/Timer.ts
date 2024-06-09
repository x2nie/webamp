import { xmlRegistry } from "@lib/registry";
import { UIRoot } from "../../UIRoot";
import { assume } from "../../utils";
import BaseObject from "./BaseObject";
import SystemObject from "./SystemObject";

let TIMER_IDS = 0;

export default class Timer extends BaseObject {
  static GUID = "5d0c5bb64b1f7de1168d0fa741199459";
  _system: SystemObject;
  _delay: number = 5000; //x2nie
  _timeout: NodeJS.Timeout | null = null;
  _onTimer: () => void = null;

  // constructor(uiRoot: SystemObject) {
  //   super();
  //   this._system = uiRoot;
  // //   TIMER_IDS += 1;
  // //   this._id = `timer_${TIMER_IDS}`;
  // }

  setDelay(millisec: number) {
    let parent = this.parent;
    while (parent){
      console.log('myParent=', parent.id, parent.constructor.name)
      parent = parent.parent
    }
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
    if (this._timeout != null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
  // async start(): Promise<boolean> {
  start(): boolean {
    // console.log('timer.start()', this._nid)
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
        // this._system.vm.dispatch(self, "ontimer");
        self.doTimer();
      }, this._delay);
      return true;
    } catch (err) {
      return false;
    }
    return false;
  }

  doTimer() {
    // console.log('timer.ontimer()', "this._nid")
    // if (this._onTimer != null) {
    //   this._onTimer();
    // } else {
    //   this._system.dispatch(this, "onTimer");
    // }
    this.emitter.trigger('onTimer')
  }

  onTimer() {
    // this._system.dispatch(this, "onTimer");
    this.emitter.trigger('onTimer')
  }

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

  getskipped(): number {
    return 0;
  }
  /*
extern Int Timer.getSkipped();
*/
}

xmlRegistry.add('timer', Timer)