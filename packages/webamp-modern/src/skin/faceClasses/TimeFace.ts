import UI_ROOT from "../../UIRoot";
import { integerToTime } from "../../utils";
import GuiObj from "../makiClasses/GuiObj";

export default class TimeFace extends GuiObj {
  _displayValue: string = "";
  _disposeDisplaySubscription: Function;

  getElTag(): string {
    return "text";
  }

  init(): void {
    super.init();
    this._disposeDisplaySubscription = UI_ROOT.audio.onCurrentTimeChange(() => {
      this.setDisplayValue(integerToTime(UI_ROOT.audio.getCurrentTime()));
    });
    this.setDisplayValue(integerToTime(UI_ROOT.audio.getCurrentTime()));
  }

  setDisplayValue(newValue: string) {
    if (newValue !== this._displayValue) {
      this._displayValue = newValue;
      this._renderText();
    }
  }

  _renderText() {
    this._div.textContent = this._displayValue;
  }
}
