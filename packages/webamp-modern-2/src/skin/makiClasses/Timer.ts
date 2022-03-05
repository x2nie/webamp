import UI_ROOT from "../../UIRoot";
import { assume } from "../../utils";
import BaseObject from "./BaseObject";

export default class Timer extends BaseObject {
  static GUID = "5d0c5bb64b1f7de1168d0fa741199459";
  _delay: number = 100; //x2nie
  _timeout: NodeJS.Timeout | null = null;
  setdelay(millisec: number) {
    // assume(
    //   this._timeout == null,
    //   "Tried to change the delay on a running timer"
    // );
    const running = this.isrunning();
    if(running) this.stop();
    this._delay = millisec;
    if(running) this.start()
  }
  stop() {
    if (this._timeout != null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
  start():boolean {
    if(!this._delay){
      return false;
    }

    try{
      assume(this._delay != null, "Tried to start a timer without a delay");
      if(this.isrunning()){
        this.stop();
      }
      this._timeout = setInterval(() => {
        UI_ROOT.vm.dispatch(this, "ontimer");
      }, this._delay);
      return true
    } 
    catch(err){
      return false
    }
    return false
  }

  isrunning(): boolean {
    return this._timeout != null;
  }

  getdelay(): number {
    return this._delay;
  }

  /*
extern Int Timer.getSkipped();
*/
}
