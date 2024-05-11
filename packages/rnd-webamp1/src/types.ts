// import { PlaylistState } from "./reducers/playlist";
// import { SettingsState } from "./reducers/settings";
// import { UserInputState } from "./reducers/userInput";
// import { MediaState } from "./reducers/media";
// import { ThunkDispatch, ThunkAction } from "redux-thunk";
// import { DisplayState } from "./reducers/display";
// import {
//   WindowsState,
//   WindowPositions as _WindowPositions,
//   WebampWindow as _WebampWindow,
//   WindowInfo as _WindowInfo,
// } from "./reducers/windows";
// import { EqualizerState } from "./reducers/equalizer";
// import { NetworkState } from "./reducers/network";
// import { MilkdropState } from "./reducers/milkdrop";
// import { SerializedStateV1 } from "./serializedStates/v1Types";
// import { TracksState } from "./reducers/tracks";
// import { IAudioMetadata, IOptions } from "music-metadata-browser";
// import { Store as ReduxStore } from "redux";

// Avoid warnings from Webpack: https://github.com/webpack/webpack/issues/7378
// export type WebampWindow = _WebampWindow;
// export type WindowInfo = _WindowInfo;
// export type WindowPositions = _WindowPositions;

export interface Point {
  x: number;
  y: number;
}

export interface Diff {
  x?: number;
  y?: number;
}

export interface BoundingBox {
  width: number;
  height: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export type WindowId = "main" | "playlist" | "equalizer" | "milkdrop";

export interface WindowInfo extends Box {
  // id: WindowId;
  id: number;
}

export type WindowPositions = {
  [windowId: string]: Point;
};