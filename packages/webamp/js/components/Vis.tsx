import React, {
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";

import * as Actions from "../actionCreators";
import * as Selectors from "../selectors";
import { useTypedSelector, useActionCreator } from "../hooks";
// import { usePaintOscilloscopeFrame } from "./useOscilloscopeVisualizer";
// import { usePaintBarFrame, usePaintBar } from "./useBarVisualizer";
import { VISUALIZERS, MEDIA_STATUS } from "../constants";

import {
  Vis as IVis,
  VisPaintHandler,
  BarPaintHandler,
  WavePaintHandler,
  NoVisualizerHandler,
} from "./VisPainter";

type Props = {
  analyser: AnalyserNode;
};

const PIXEL_DENSITY = 2;

// Pre-render the background grid
function preRenderBg(
  width: number,
  height: number,
  bgColor: string,
  fgColor: string,
  windowShade: boolean
): HTMLCanvasElement {
  // Off-screen canvas for pre-rendering the background
  const bgCanvas = document.createElement("canvas");
  bgCanvas.width = width;
  bgCanvas.height = height;
  const distance = 2 * PIXEL_DENSITY;

  const bgCanvasCtx = bgCanvas.getContext("2d");
  if (bgCanvasCtx == null) {
    throw new Error("Could not construct canvas context");
  }
  bgCanvasCtx.fillStyle = bgColor;
  bgCanvasCtx.fillRect(0, 0, width, height);
  if (!windowShade) {
    bgCanvasCtx.fillStyle = fgColor;
    for (let x = 0; x < width; x += distance) {
      for (let y = PIXEL_DENSITY; y < height; y += distance) {
        bgCanvasCtx.fillRect(x, y, PIXEL_DENSITY, PIXEL_DENSITY);
      }
    }
  }
  return bgCanvas;
}

export default function Vis({ analyser }: Props) {
  useLayoutEffect(() => {
    analyser.fftSize = 2048;
  }, [analyser, analyser.fftSize]);
  const colors = useTypedSelector(Selectors.getSkinColors);
  const mode = useTypedSelector(Selectors.getVisualizerStyle);
  const audioStatus = useTypedSelector(Selectors.getMediaStatus);
  const getWindowShade = useTypedSelector(Selectors.getWindowShade);
  const dummyVizData = useTypedSelector(Selectors.getDummyVizData);

  const toggleVisualizerStyle = useActionCreator(Actions.toggleVisualizerStyle);
  const windowShade = getWindowShade("main");
  const renderWidth = windowShade ? 38 : 76;
  const renderHeight = windowShade ? 5 : 16;

  const width = renderWidth * PIXEL_DENSITY;
  const height = renderHeight * PIXEL_DENSITY;

  const bgCanvas = useMemo(() => {
    return preRenderBg(
      width,
      height,
      colors[0],
      colors[1],
      Boolean(windowShade)
    );
  }, [colors, height, width, windowShade]);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  // const vis: IVis = {
  //   canvas,
  //   analyser
  // }

  //? painter administration
  const [painter, setPainter] = useState<VisPaintHandler | null>(null);
  const _vis: IVis = useMemo(() => {
    if (!canvas) return { colors, analyser };
    return { canvas, colors, analyser };
  }, [analyser, canvas, colors]);
  const _setPainter = useCallback(
    (PainterType: typeof VisPaintHandler) => {
      if (!canvas) return;
      // uninteruptable painting requires _painter to be always available
      const oldPainter = painter;
      const newPainter = new PainterType(_vis);
      newPainter.prepare();
      setPainter(newPainter);

      // this.audioStatusChanged(); // stop loop of old painter, preparing new painter.

      if (oldPainter) {
        oldPainter.dispose();
      }
    },
    [canvas, _vis, painter]
  );

  useEffect(() => {
    // console.log(" vis mode:", mode);
    switch (mode) {
      case VISUALIZERS.OSCILLOSCOPE:
        // canvasCtx.drawImage(bgCanvas, 0, 0);
        // paintOscilloscopeFrame(canvasCtx);
        _setPainter(WavePaintHandler);
        break;
      case VISUALIZERS.BAR:
        _setPainter(BarPaintHandler);
        // canvasCtx.drawImage(bgCanvas, 0, 0);
        // paintBarFrame(canvasCtx);
        break;
      case VISUALIZERS.NONE:
        _setPainter(NoVisualizerHandler);
        break;
      default:
        // canvasCtx.clearRect(0, 0, width, height);
        _setPainter(NoVisualizerHandler);
    }
  }, [canvas, _setPainter, mode]);

  useEffect(() => {
    if (canvas == null || painter == null) {
      return;
    }
    const canvasCtx = canvas.getContext("2d");
    if (canvasCtx == null) {
      return;
    }
    canvasCtx.imageSmoothingEnabled = false;

    let animationRequest: number | null = null;
    // Kick off the animation loop
    if (audioStatus === MEDIA_STATUS.PLAYING) {
      const loop = () => {
        // paintFrame(canvasCtx);
        painter.paintFrame();
        animationRequest = window.requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      if (animationRequest != null) {
        window.cancelAnimationFrame(animationRequest);
      }
    };
  }, [audioStatus, canvas, painter]);
  // @ts-ignore

  // @ts-ignore
  return (
    <canvas
      id="visualizer"
      ref={setCanvas}
      style={{ width: renderWidth, height: renderHeight }}
      width={width}
      height={height}
      onClick={toggleVisualizerStyle}
    />
  );
}
