export interface Vis {
    canvas?: HTMLCanvasElement;
    colors: string[];
    analyser: AnalyserNode;
    audioContext?: AudioContext;    //butterchurn need it
    oscStyle?: "dots" | "solid" | "lines";
  }
  
    
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
    prepare() {}
  
    /**
     * Called once per frame rendiring
     */
    paintFrame() {}
  
    /**
     * Attemp to cleanup cached bitmaps
     */
    dispose() {}
  
    /**
     * called if it is an AVS.
     * @param action vis_prev | vis_next | vis_f5 (fullscreen) |
     */
    doAction(action: string, param: string) {}
  }
  
  //? =============================== BAR PAINTER ===============================
  export class BarPaintHandler extends VisPaintHandler {
    prepare() {}

    randomColor(){
        const i = Math.floor(Math.random() * 16)
        return this._vis.colors[i]
    }
  
    paintFrame() {
      if (!this._ctx) return;
      const ctx = this._ctx;
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 3;
      for (let i = 0; i < 30; i += 1) {
        // const r = Math.floor(Math.random() * 255);
        // const g = Math.floor(Math.random() * 255);
        // const b = Math.floor(Math.random() * 255);
        // ctx.strokeStyle = `rgba(${r},${g},${b},1)`;
  
        ctx.beginPath();
        ctx.moveTo(Math.random() * width, Math.random() * height);
        ctx.lineTo(Math.random() * width, Math.random() * height);
        ctx.strokeStyle = this.randomColor();
        ctx.stroke();
      }
    }
  }
  
  //? =============================== OSCILOSCOPE PAINTER ===============================
  
  export class WavePaintHandler extends VisPaintHandler {
    prepare() {}
  
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
  