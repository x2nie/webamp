export interface Vis {
  canvas?: HTMLCanvasElement;
  colors: string[];
  analyser: AnalyserNode;
  audioContext?: AudioContext; //butterchurn need it
  oscStyle?: "dots" | "solid" | "lines";
}

type ColorTriplet = string;

/**
 * Base class of AVS (animation frame renderer engine)
 */
export class VisPaintHandler {
  _vis: Vis;
  _ctx: CanvasRenderingContext2D | null;

  constructor(vis: Vis) {
    this._vis = vis;
    this._ctx = vis.canvas!.getContext("2d");
    // this.prepare();
  }

  /**
   * Attemp to build cached bitmaps for later use while render a frame.
   * Purpose: fast rendering in animation loop
   */
  prepare() { }

  /**
   * Called once per frame rendiring
   */
  paintFrame() { }

  /**
   * Attemp to cleanup cached bitmaps
   */
  dispose() { }

  /**
   * called if it is an AVS.
   * @param action vis_prev | vis_next | vis_f5 (fullscreen) |
   */
  doAction(action: string, param: string) { }
}

//? =============================== BAR PAINTER ===============================
export class BarPaintHandler extends VisPaintHandler {
  prepare() { }

  paintFrame() {
    if (!this._ctx) return;
    const ctx = this._ctx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 5;
    for (let i = 0; i < 30; i += 1) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);

      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
      ctx.stroke();
    }
  }
}

//? =============================== OSCILOSCOPE PAINTER ===============================

export class WavePaintHandler0000000____ extends VisPaintHandler {
  prepare() { }

  paintFrame() {
    if (!this._ctx) return;
    const ctx = this._ctx;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    for (let i = 0; i < 30; i += 1) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
  }
}
type PaintWavFunction = (x: number, y: number, colorIndex: number) => void;
// Return the average value in a slice of dataArray
function sliceAverage(
  dataArray: Uint8Array,
  sliceWidth: number,
  sliceNumber: number
): number {
  const start = sliceWidth * sliceNumber;
  const end = start + sliceWidth;
  let sum = 0;
  for (let i = start; i < end; i++) {
    sum += dataArray[i];
  }
  return sum / sliceWidth;
}

function slice1st(
  dataArray: Uint8Array,
  sliceWidth: number,
  sliceNumber: number
): number {
  const start = sliceWidth * sliceNumber;
  // const end = start + sliceWidth;
  // let sum = 0;
  // for (let i = start; i < end; i++) {
  //   sum += dataArray[i];
  // }
  return dataArray[start];
}

export class WavePaintHandler extends VisPaintHandler {
  _analyser: AnalyserNode;
  _bufferLength: number;
  _lastX: number = 0;
  _lastY: number = 0;
  _dataArray: Uint8Array;
  _pixelRatio: number; // 1 or 2
  // Off-screen canvas for drawing perfect pixel (no blured lines)
  _bar: HTMLCanvasElement = document.createElement("canvas");
  _16h: HTMLCanvasElement = document.createElement("canvas"); // non-stretched
  paintWav: PaintWavFunction;
  _datafetched: boolean = false;
  // _colors2: string[];

  constructor(vis: Vis) {
    super(vis);
    this._analyser = this._vis.analyser;
    this._bufferLength = this._analyser.fftSize;
    // this._octaveBuckets = octaveBucketsForBufferLength(this._bufferLength);
    this._dataArray = new Uint8Array(this._bufferLength);

    this._16h.width = 1;
    this._16h.height = 16;
    this._16h.setAttribute("width", "72");
    this._16h.setAttribute("height", "16");

    //* see https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#monitoring_screen_resolution_or_zoom_level_changes
    this._pixelRatio = window.devicePixelRatio || 1;

    if (this._vis.oscStyle === "dots") {
      this.paintWav = this.paintWavDot.bind(this);
    } else if (this._vis.oscStyle === "solid") {
      this.paintWav = this.paintWavSolid.bind(this);
    } else {
      this.paintWav = this.paintWavLine.bind(this);
    }
  }

  prepare() {
    if (!this._ctx) {
      console.log("ctx not set!");
      return;
    }
    const vis = this._vis;
    // const groupId = vis._gammagroup;
    // const gammaGroup = this._vis._uiRoot._getGammaGroup(groupId);

    //? paint bar
    this._bar.width = 1;
    this._bar.height = 5;
    this._bar.setAttribute("width", "1");
    this._bar.setAttribute("height", "5");
    const ctx = this._bar.getContext("2d");
    if (ctx) {
      for (let y = 0; y < 5; y++) {
        // ctx.fillStyle = gammaGroup.transformColor(vis._colorOsc[y]);
        ctx.fillStyle = vis.colors[18 + y];
        ctx.fillRect(0, y, 1, y + 1);
      }
    }

    // this._ctx = vis._canvas.getContext("2d");
    this._ctx.imageSmoothingEnabled = false;
    // @ts-ignore
    this._ctx.mozImageSmoothingEnabled = false;
    // @ts-ignore
    this._ctx.webkitImageSmoothingEnabled = false;
    // @ts-ignore
    this._ctx.msImageSmoothingEnabled = false;
    // Just use one of the viscolors for now

    this._datafetched = false;
  }

  paintFrame() {
    if (!this._ctx) return;
    this._analyser.getByteTimeDomainData(this._dataArray);
    // this._analyser.getFloatTimeDomainData(this._dataArray);
    this._dataArray = this._dataArray.slice(0, 576);
    const bandwidth = this._dataArray.length;

    //* to save and see in excel (bar chart)
    if (!this._datafetched) {
      // console.log(JSON.stringify(Array.from(this._dataArray)))
      this._datafetched = true;
    }

    const using16temporaryCanvas = this._vis.canvas!.height !== 16;

    if (using16temporaryCanvas) {
      this._ctx = this._16h.getContext("2d");
    }
    const width = this._ctx!.canvas.width;
    const height = this._ctx!.canvas.height;
    this._ctx!.clearRect(0, 0, width, height);

    const sliceWidth = Math.floor(/* this._bufferLength */ bandwidth / width);

    // Iterate over the width of the canvas in fixed 72 pixels.
    for (let j = 0; j <= width; j++) {
      // const amplitude = sliceAverage(this._dataArray, sliceWidth, j);
      const amplitude = slice1st(this._dataArray, sliceWidth, j);
      // forget all that was here, -4 is set to off center the oscilloscope
      // because completely centered looks a bit weird
      const [y, colorIndex] = this.rangeByAmplitude(-(amplitude - 4) + 256);
      // amplitude is now upside down because we're flipping the rendering
      // of the oscilloscope upside down as well
      // why? because the modern skin engine does this, and i dont like that
      // change to this.rangeByAmplitude(amplitude+4); for Winamp Classic behavior
      const x = j; /* * PIXEL_DENSITY */

      this.paintWav(x, y, colorIndex);
    }

    if (using16temporaryCanvas) {
      const canvas = this._vis.canvas!;
      const visCtx = canvas.getContext("2d")!;
      visCtx.clearRect(0, 0, canvas.width, canvas.height);
      visCtx.drawImage(
        this._16h,
        0, 0, // sx,sy
        72, 16, // sw,sh
        0, 0, //dx,dy
        canvas.width, canvas.height //dw,dh
      );
    }
  }

  /**
   *
   * @param amplitude 0..255
   * @returns xy.Y(top to bottom), colorOscIndex
   */
  rangeByAmplitude(amplitude: number): [number, number] {
    //odjasdjflasjdf;lasjdf;asjd;fjasd;fsajdf
    if (amplitude >= 184) {
      return [0, 3];
    }
    if (amplitude >= 176) {
      return [1, 3];
    }
    if (amplitude >= 168) {
      return [2, 2];
    }
    if (amplitude >= 160) {
      return [3, 2];
    }
    if (amplitude >= 152) {
      return [4, 1];
    }
    if (amplitude >= 144) {
      return [5, 1];
    }
    if (amplitude >= 136) {
      return [6, 0];
    }
    if (amplitude >= 128) {
      return [7, 0];
    }
    if (amplitude >= 120) {
      return [8, 1];
    }
    if (amplitude >= 112) {
      return [9, 1];
    }
    if (amplitude >= 104) {
      return [10, 2];
    }
    if (amplitude >= 96) {
      return [11, 2];
    }
    if (amplitude >= 88) {
      return [12, 3];
    }
    if (amplitude >= 80) {
      return [13, 3];
    }
    if (amplitude >= 72) {
      return [14, 4];
    }
    // if(amplitude>=56){return [15, 4]}
    return [15, 4];
  }

  paintWavLine(x: number, y: number, colorIndex: number) {
    if (x === 0) this._lastY = y;

    let top = y;
    let bottom = this._lastY;
    this._lastY = y;

    if (bottom < top) {
      [bottom, top] = [top, bottom];
      top++; //top++, that emulates Winamp's/WACUP's OSC behavior correctly
    }
    // const h = bottom - top + 1;

    for (y = top; y <= bottom; y++) {
      this._ctx!.drawImage(
        this._bar,
        0, colorIndex, // sx,sy
        1, 1, // sw,sh
        x, -y + 15, //dx,dy, dy is upside down because Winamp3/Winamp5 does it, so we have to emulate it
        //set to x, y, for Winamp Classic behavior
        1, 1 //dw,dh
      );
    }
  }

  paintWavDot(x: number, y: number, colorIndex: number) {
    this._ctx!.drawImage(
      this._bar,
      0, colorIndex, // sx,sy
      1, 1, // sw,sh
      x, -y + 15, //dx,dy, dy is upside down because Winamp3/Winamp5 does it, so we have to emulate it
      //set to x, y, for Winamp Classic behavior
      1, 1 //dw,dh
    );
  }

  paintWavSolid(x: number, y: number, colorIndex: number) {
    let top, bottom;
    if (y >= 8) {
      top = 8;
      bottom = y;
    } else {
      top = y;
      bottom = 7;
    }
    // const h = bottom - top + 1;
    for (y = top; y <= bottom; y++) {
      this._ctx!.drawImage(
        this._bar,
        0, colorIndex, // sx,sy
        1, 1, // sw,sh
        x, -y + 15, //dx,dy, dy is upside down because Winamp3/Winamp5 does it, so we have to emulate it
        //set to x, y, for Winamp Classic behavior
        1, 1 //dw,dh
      );
    }
  }
}

export class NoVisualizerHandler extends VisPaintHandler {
  cleared: boolean = false;
  prepare() {
    this.cleared = false;
  }

  paintFrame() {
    if (!this._ctx) return;
    const ctx = this._ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.cleared = true;
  }
}
