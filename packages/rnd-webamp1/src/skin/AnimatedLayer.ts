import { xml } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { Layer } from "./Layer";

export class AnimatedLayer extends Layer {
  static GUID = "6b64cd274c4b5a26a7e6598c3a49f60c";
  static ID = "{6B64CD27-5A26-4C4B-8C59-E6A70CF6493A}";
  static template = xml`<div class="animatedlayer layer dummy" tag="animatedlayer" style="style()"/>`;

  
  public setSpeed(msperframe: number) {}

  public gotoFrame(framenum: number) {}

  public setStartFrame(framenum: number) {}

  public setEndFrame(framenum: number) {}

  public setAutoReplay(onoff: boolean) {}

  public play() {}

  public stop() {}

  public pause() {}

  public isPlaying(): boolean {}

  public isPaused(): boolean {}

  public isStopped(): boolean {}

  public getStartFrame(): number {}

  public getEndFrame(): number {}

  public getLength(): number {}

  public getDirection(): number {}

  public getAutoReplay(): boolean {}

  public getCurFrame(): number {}

  // AlbumArt
  public setRealtime(onoff: boolean) {}

  // events binding ---------------
  
  // onPlay() {}

  // onPause() {}

  // onResume() {}

  // onStop() {}

  // onFrame(framenum: number) {}


} // animatedlayer

registry.category("component").add("animatedlayer", AnimatedLayer);
