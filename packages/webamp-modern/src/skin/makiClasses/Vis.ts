import { UIRoot } from "../../UIRoot";
import { debounce, num, toBool, unimplemented } from "../../utils";
import { AUDIO_PLAYING } from "../AudioPlayer";
import GammaGroup from "../GammaGroup";
import GuiObj from "./GuiObj";

import {
  Vis as IVis,
  VisPaintHandler,
  BarPaintHandler,
  WavePaintHandler,
  NoVisualizerHandler,
} from "./VisPainter";

type ColorTriplet = string;

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Cvis.2F.3E
export default class Vis extends GuiObj implements IVis {
  static GUID = "ce4f97be4e1977b098d45699276cc933";
  _canvas: HTMLCanvasElement = document.createElement("canvas");
  _painter: VisPaintHandler;
  _animationRequest: number = null;
  // (int) One of three values for which mode to display:
  // "0" is no display,
  // "1" is spectrum,
  // "2" is oscilloscope. Default is to read from a config item. When the user clicks on the vis, it will cycle between its three modes.
  _mode: string = "1";
  _colorBands: ColorTriplet[] = new Array(17).fill("255,255,255"); // 1..16
  _colorBandPeak: ColorTriplet = "255,255,255";
  _colorOsc: ColorTriplet[] = []; // 1..5
  _coloring: string = "normal";
  _peaks: boolean = true;
  _oscStyle: string;
  _bandwidth: string = "wide";
  _gammagroup: string;
  _realtime: boolean = true;
  _colors: string[] = new Array(24).fill("rgb(0,0,0)");  //IVis

  constructor(uiRoot: UIRoot) {
    super(uiRoot);
    // while (this._colorBands.length < 16) {
    //   this._colorBands.push("255,255,255");
    // }
    this._colorBands[0] = ("0,0,0");
    while (this._colorOsc.length < 5) {
      this._colorOsc.push("255,255,255");
    }
    this._painter = new NoVisualizerHandler(this);
    this._uiRoot.audio.on("statchanged", this.audioStatusChanged);
    this._uiRoot.on("colorthemechanged", this._colorThemeChanged);
  }

  setXmlAttr(_key: string, value: string): boolean {
    const key = _key.toLowerCase();
    if (super.setXmlAttr(key, value)) {
      return true;
    }
    value = value.toLowerCase();

    switch (key) {
      case "mode":
        this.setmode(value);
        break;
      case "gammagroup":
        this._gammagroup = value;
        break;

      //? SPECTRUM -------------------------------------------
      case "colorband1":
      case "colorband2":
      case "colorband3":
      case "colorband4":
      case "colorband5":
      case "colorband6":
      case "colorband7":
      case "colorband8":
      case "colorband9":
      case "colorband10":
      case "colorband11":
      case "colorband12":
      case "colorband13":
      case "colorband14":
      case "colorband15":
      case "colorband16":
        // color spectrum band #
        const cobaIndex = parseInt(key.substring(9)) - 1;
        this._colorBands[cobaIndex] = value;
        break;
      case "colorallbands":
        // color spectrum band #
        for (var i = 0; i < 16; i++) {
          this._colorBands[i] = value;
        }
        break;
      case "coloring":
        // Change coloring method for spectroscope ("Normal", "Fire" or "Line").
        this._coloring = value;
        break;
      case "colorbandpeak":
        // color the spectrum peak line.
        this._colorBandPeak = value;
        break;
      case "peaks":
        // (bool) Enable peaks for the spectrum.
        this._peaks = toBool(value);
        break;
      case "bandwidth":
        // (string) Change the style of the spectrum ("thin" or "wide").
        this._bandwidth = value;
        break;

      //? OSCILOSCOPE -------------------------------------------
      case "colorosc1":
      case "colorosc2":
      case "colorosc3":
      case "colorosc4":
      case "colorosc5":
        //  color oscilloscope section #
        const coOcIndex = parseInt(key.substring(8)) - 1;
        this._colorOsc[coOcIndex] = value;
        break;
      case "colorallosc":
        // color the whole oscilloscope.
        for (var i = 0; i < 5; i++) {
          this._colorOsc[i] = value;
        }
        break;
      case "oscstyle":
        //  (string) Change the style of the oscilloscope ("solid", "dots" or "lines").
        this._oscStyle = value;
        break;
      case "others":
        break;
      default:
        return false;
    }
    this._rebuildPainter();
    return true;
  }


  setup() {
    this.setmode(this._mode); // in case xml doesn't define mode.
    super.setup();
    this.audioStatusChanged();
  }

  dispose() {
    super.dispose();
    this._stopVisualizer();
  }


  //? IVis implementations
  get canvas(){
    return this._canvas;
  }
  get analyser(){
    return this._uiRoot.audio.getAnalyser();
  }
  get colors(){
    return this._colors;
  }

  _colorThemeChanged = (newGammaId: string) => {
    //? this.colors should be in compatible order to wmz.VISCOLORS.TXT
    const gammaGroup = this._uiRoot._getGammaGroup(this._gammagroup);
    for (let i = 0; i <= 16; i++) {
      this._colors[i] = gammaGroup.transformColor(this._colorBands[i]);
    }
    for (let i = 0; i < 5; i++) {
      this._colors[18+i] = gammaGroup.transformColor(this._colorOsc[i]);
    }
    this._colors[23] = gammaGroup.transformColor(this._colorBandPeak);
    // vis.setxmlparam(`colorbandpeak`, colors[23]);
    this._rebuildPainter();
  };

  /**
   * Called when any a color changed.
   * Debounce = avoid too many changes in a range time (100ms here)
   */
  _rebuildPainter = debounce(() => {
    if (this._painter) {
      this._painter.prepare();
      // const ctx = this._canvas.getContext("2d");
      // if (ctx == null) {
      //   return;
      // }
      this._painter.paintFrame();
    }
  }, 100);



  setmode(mode: string) {
    this._mode = mode;
    // const painterClass =
    //   VISPAINTERS[mode] || VISPAINTERS["0"]; /* NoVisualizerHandler */
    // this._setPainter(painterClass);
    // return
    switch (mode) {
      case '1':
        // "1" is spectrum,
        this._setPainter(BarPaintHandler);
        break;
      case '2':
        // "2" is oscilloscope.
        this._setPainter(WavePaintHandler);
        break;
      default:
        // "0" is no display,
        this._setPainter(NoVisualizerHandler);
        break;
    }
  }

  getmode(): number {
    return parseInt("0" + this._mode); // so we support non numeral use. eg: 'butterchurn'
  }

  nextmode() {
    let newMode = this.getmode() + 1;
    if (newMode > 2) {
      newMode = 0;
    }
    this.setmode(String(newMode));
  }

  _setPainter(PainterType: typeof VisPaintHandler) {
    // uninteruptable painting requires _painter to be always available
    const oldPainter = this._painter;
    this._painter = new PainterType(this);

    this.audioStatusChanged(); // stop loop of old painter, preparing new painter.

    if (oldPainter) {
      oldPainter.dispose();
    }
  }

  // disposable
  audioStatusChanged = () => {
    // to avoid multiple loop, we always stop the old painting loop
    this._stopVisualizer();

    // start the new loop
    const playing = this._uiRoot.audio.getState() == AUDIO_PLAYING;
    if (playing) {
      this._startVisualizer();
    }
  };

  _startVisualizer() {
    // Kick off the animation loop
    // const ctx = this._canvas.getContext("2d");
    // if (ctx == null) {
    //   return;
    // }
    // ctx.imageSmoothingEnabled = false;
    this._rebuildPainter();
    const loop = () => {
      this._painter.paintFrame();
      this._animationRequest = window.requestAnimationFrame(loop);
    };
    loop();
  }

  _stopVisualizer() {
    if (this._animationRequest != null) {
      window.cancelAnimationFrame(this._animationRequest);
      this._animationRequest = null;
    }
  }

  /*extern Vis.onFrame(); */
  setrealtime(onoff: boolean) {
    this._realtime = unimplemented(onoff);
  }
  getrealtime(): boolean {
    return this._realtime;
  }

  _renderWidth() {
    super._renderWidth();
    this._canvas.style.width = this._div.style.width;
    this._canvas.setAttribute("width", `${parseInt(this._div.style.width)}`);
  }

  _renderHeight() {
    super._renderHeight();
    this._canvas.style.height = this._div.style.height;
    this._canvas.setAttribute("height", `${parseInt(this._div.style.height)}`);
  }

  draw() {
    super.draw();
    this._canvas.setAttribute("id", this.getId() + "-canvas");
    this._div.appendChild(this._canvas);
  }
}

