var N = Object.create;
var o = Object.defineProperty;
var W = Object.getOwnPropertyDescriptor;
var V = Object.getOwnPropertyNames,
  F = Object.getOwnPropertySymbols,
  H = Object.getPrototypeOf,
  w = Object.prototype.hasOwnProperty,
  z = Object.prototype.propertyIsEnumerable;
var E = (e, r, a) =>
    r in e
      ? o(e, r, { enumerable: !0, configurable: !0, writable: !0, value: a })
      : (e[r] = a),
  p = (e, r) => {
    for (var a in r || (r = {})) w.call(r, a) && E(e, a, r[a]);
    if (F) for (var a of F(r)) z.call(r, a) && E(e, a, r[a]);
    return e;
  };
var U = (e) => o(e, "__esModule", { value: !0 });
var $ = (e, r, a) => {
    if ((r && typeof r == "object") || typeof r == "function")
      for (let n of V(r))
        !w.call(e, n) &&
          n !== "default" &&
          o(e, n, {
            get: () => r[n],
            enumerable: !(a = W(r, n)) || a.enumerable,
          });
    return e;
  },
  q = (e) =>
    $(
      U(
        o(
          e != null ? N(H(e)) : {},
          "default",
          e && e.__esModule && "default" in e
            ? { get: () => e.default, enumerable: !0 }
            : { value: e, enumerable: !0 }
        )
      ),
      e
    );
var X = {
    parent: "@{00000000-0000-0000-0000-000000000000}@",
    functions: [
      { result: "String", name: "getClassName", parameters: [] },
      { result: "String", name: "getId", parameters: [] },
      {
        result: "Int",
        name: "onNotify",
        parameters: [
          ["String", "command"],
          ["String", "param"],
          ["int", "a"],
          ["int", "b"],
        ],
      },
    ],
    name: "Object",
  },
  Y = {
    parent: "Object",
    functions: [
      { result: "", name: "onScriptLoaded", parameters: [] },
      { result: "", name: "onScriptUnloading", parameters: [] },
      { result: "", name: "onQuit", parameters: [] },
      {
        result: "",
        name: "onSetXuiParam",
        parameters: [
          ["String", "param"],
          ["String", "value"],
        ],
      },
      { result: "", name: "onKeyDown", parameters: [["String", "key"]] },
      {
        result: "",
        name: "onAccelerator",
        parameters: [
          ["String", "action"],
          ["String", "section"],
          ["String", "key"],
        ],
      },
      {
        result: "",
        name: "onCreateLayout",
        parameters: [["Layout", "_layout"]],
      },
      { result: "", name: "onShowLayout", parameters: [["Layout", "_layout"]] },
      { result: "", name: "onHideLayout", parameters: [["Layout", "_layout"]] },
      {
        result: "",
        name: "onViewPortChanged",
        parameters: [
          ["int", "width"],
          ["int", "height"],
        ],
      },
      { result: "", name: "onStop", parameters: [] },
      { result: "", name: "onPlay", parameters: [] },
      { result: "", name: "onPause", parameters: [] },
      { result: "", name: "onResume", parameters: [] },
      {
        result: "",
        name: "onTitleChange",
        parameters: [["String", "newtitle"]],
      },
      {
        result: "",
        name: "onTitle2Change",
        parameters: [["String", "newtitle2"]],
      },
      { result: "", name: "onUrlChange", parameters: [["String", "url"]] },
      { result: "", name: "onInfoChange", parameters: [["String", "info"]] },
      { result: "", name: "onStatusMsg", parameters: [["String", "msg"]] },
      {
        result: "",
        name: "onEqBandChanged",
        parameters: [
          ["int", "band"],
          ["int", "newvalue"],
        ],
      },
      {
        result: "",
        name: "onEqPreampChanged",
        parameters: [["int", "newvalue"]],
      },
      { result: "", name: "onEqChanged", parameters: [["int", "newstatus"]] },
      { result: "", name: "onEqFreqChanged", parameters: [["int", "isiso"]] },
      { result: "", name: "onVolumeChanged", parameters: [["int", "newvol"]] },
      { result: "", name: "onSeek", parameters: [["int", "newpos"]] },
      {
        result: "Container",
        name: "getContainer",
        parameters: [["String", "container_id"]],
      },
      {
        result: "Container",
        name: "newDynamicContainer",
        parameters: [["String", "container_id"]],
      },
      {
        result: "Group",
        name: "newGroup",
        parameters: [["String", "group_id"]],
      },
      {
        result: "Layout",
        name: "newGroupAsLayout",
        parameters: [["String", "group_id"]],
      },
      { result: "Int", name: "getNumContainers", parameters: [] },
      {
        result: "Container",
        name: "enumContainer",
        parameters: [["Int", "num"]],
      },
      { result: "String", name: "enumEmbedGUID", parameters: [["int", "num"]] },
      { result: "Wac", name: "getWac", parameters: [["String", "wac_guid"]] },
      {
        result: "Int",
        name: "messageBox",
        parameters: [
          ["String", "message"],
          ["String", "msgtitle"],
          ["Int", "flag"],
          ["String", "notanymore_id"],
        ],
      },
      { result: "String", name: "getPlayItemString", parameters: [] },
      { result: "Int", name: "getPlayItemLength", parameters: [] },
      {
        result: "String",
        name: "getPlayItemMetaDataString",
        parameters: [["String", "metadataname"]],
      },
      {
        result: "String",
        name: "getMetaDataString",
        parameters: [
          ["String", "filename"],
          ["String", "metadataname"],
        ],
      },
      { result: "String", name: "getPlayItemDisplayTitle", parameters: [] },
      { result: "Int", name: "getCurrentTrackRating", parameters: [] },
      {
        result: "",
        name: "onCurrentTrackRated",
        parameters: [["int", "rating"]],
      },
      {
        result: "",
        name: "setCurrentTrackRating",
        parameters: [["int", "rating"]],
      },
      {
        result: "String",
        name: "getExtFamily",
        parameters: [["String", "ext"]],
      },
      {
        result: "String",
        name: "getDecoderName",
        parameters: [["string", "playitem"]],
      },
      { result: "", name: "playFile", parameters: [["String", "playitem"]] },
      {
        result: "Int",
        name: "getAlbumArt",
        parameters: [["String", "playitem"]],
      },
      {
        result: "",
        name: "downloadMedia",
        parameters: [
          ["String", "url"],
          ["String", "destinationPath"],
          ["boolean", "wantAddToML"],
          ["boolean", "notifyDownloadsList"],
        ],
      },
      {
        result: "",
        name: "downloadURL",
        parameters: [
          ["String", "url"],
          ["String", "destination_filename"],
          ["String", "progress_dialog_title"],
        ],
      },
      {
        result: "",
        name: "onDownloadFinished",
        parameters: [
          ["String", "url"],
          ["boolean", "success"],
          ["String", "filename"],
        ],
      },
      { result: "String", name: "getDownloadPath", parameters: [] },
      {
        result: "",
        name: "setDownloadPath",
        parameters: [["String", "new_path"]],
      },
      { result: "", name: "enqueueFile", parameters: [["String", "playitem"]] },
      { result: "Int", name: "getLeftVuMeter", parameters: [] },
      { result: "Int", name: "getRightVuMeter", parameters: [] },
      { result: "Int", name: "getVolume", parameters: [] },
      { result: "", name: "setVolume", parameters: [["Int", "vol"]] },
      { result: "", name: "play", parameters: [] },
      { result: "", name: "stop", parameters: [] },
      { result: "", name: "pause", parameters: [] },
      { result: "", name: "next", parameters: [] },
      { result: "", name: "previous", parameters: [] },
      { result: "", name: "eject", parameters: [] },
      { result: "", name: "seekTo", parameters: [["Int", "pos"]] },
      { result: "Int", name: "getPosition", parameters: [] },
      {
        result: "",
        name: "setEqBand",
        parameters: [
          ["int", "band"],
          ["Int", "value"],
        ],
      },
      { result: "", name: "setEqPreamp", parameters: [["Int", "value"]] },
      { result: "", name: "setEq", parameters: [["Int", "onoff"]] },
      { result: "Int", name: "getEqBand", parameters: [["int", "band"]] },
      { result: "int", name: "getEqPreamp", parameters: [] },
      { result: "int", name: "getEq", parameters: [] },
      { result: "int", name: "getMousePosX", parameters: [] },
      { result: "int", name: "getMousePosY", parameters: [] },
      {
        result: "String",
        name: "integerToString",
        parameters: [["Int", "value"]],
      },
      {
        result: "Int",
        name: "StringToInteger",
        parameters: [["String", "str"]],
      },
      {
        result: "String",
        name: "floatToString",
        parameters: [
          ["float", "value"],
          ["int", "ndigits"],
        ],
      },
      {
        result: "Float",
        name: "stringToFloat",
        parameters: [["String", "str"]],
      },
      {
        result: "String",
        name: "integerToLongTime",
        parameters: [["Int", "value"]],
      },
      {
        result: "String",
        name: "integerToTime",
        parameters: [["Int", "value"]],
      },
      {
        result: "String",
        name: "dateToTime",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "String",
        name: "dateToLongTime",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "String",
        name: "formatDate",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "String",
        name: "formatLongDate",
        parameters: [["Int", "datetime"]],
      },
      { result: "Int", name: "getDateYear", parameters: [["Int", "datetime"]] },
      {
        result: "Int",
        name: "getDateMonth",
        parameters: [["Int", "datetime"]],
      },
      { result: "Int", name: "getDateDay", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateDow", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateDoy", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateHour", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateMin", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateSec", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDateDst", parameters: [["Int", "datetime"]] },
      { result: "Int", name: "getDate", parameters: [] },
      {
        result: "String",
        name: "strmid",
        parameters: [
          ["String", "str"],
          ["Int", "start"],
          ["Int", "len"],
        ],
      },
      {
        result: "String",
        name: "strleft",
        parameters: [
          ["string", "str"],
          ["int", "nchars"],
        ],
      },
      {
        result: "string",
        name: "strright",
        parameters: [
          ["string", "str"],
          ["int", "nchars"],
        ],
      },
      {
        result: "int",
        name: "strsearch",
        parameters: [
          ["string", "str"],
          ["string", "substr"],
        ],
      },
      { result: "int", name: "strlen", parameters: [["string", "str"]] },
      { result: "string", name: "strupper", parameters: [["string", "str"]] },
      { result: "string", name: "strlower", parameters: [["string", "str"]] },
      { result: "string", name: "urlEncode", parameters: [["string", "url"]] },
      { result: "string", name: "urlDecode", parameters: [["string", "url"]] },
      {
        result: "string",
        name: "parseATF",
        parameters: [["string", "topass"]],
      },
      { result: "string", name: "removePath", parameters: [["string", "str"]] },
      { result: "string", name: "getPath", parameters: [["string", "str"]] },
      {
        result: "string",
        name: "getExtension",
        parameters: [["string", "str"]],
      },
      {
        result: "string",
        name: "getToken",
        parameters: [
          ["string", "str"],
          ["string", "separator"],
          ["int", "tokennum"],
        ],
      },
      { result: "double", name: "sin", parameters: [["double", "value"]] },
      { result: "double", name: "cos", parameters: [["double", "value"]] },
      { result: "double", name: "tan", parameters: [["double", "value"]] },
      { result: "double", name: "asin", parameters: [["double", "value"]] },
      { result: "double", name: "acos", parameters: [["double", "value"]] },
      { result: "double", name: "atan", parameters: [["double", "value"]] },
      {
        result: "double",
        name: "atan2",
        parameters: [
          ["double", "y"],
          ["double", "x"],
        ],
      },
      {
        result: "double",
        name: "pow",
        parameters: [
          ["double", "value"],
          ["double", "pvalue"],
        ],
      },
      { result: "double", name: "sqr", parameters: [["double", "value"]] },
      { result: "double", name: "log10", parameters: [["double", "value"]] },
      { result: "double", name: "ln", parameters: [["double", "value"]] },
      { result: "double", name: "sqrt", parameters: [["double", "value"]] },
      { result: "int", name: "random", parameters: [["int", "max"]] },
      {
        result: "",
        name: "setPrivateString",
        parameters: [
          ["string", "section"],
          ["string", "item"],
          ["string", "value"],
        ],
      },
      {
        result: "",
        name: "setPrivateInt",
        parameters: [
          ["string", "section"],
          ["string", "item"],
          ["int", "value"],
        ],
      },
      {
        result: "String",
        name: "getPrivateString",
        parameters: [
          ["String", "section"],
          ["String", "item"],
          ["String", "defvalue"],
        ],
      },
      {
        result: "Int",
        name: "getPrivateInt",
        parameters: [
          ["String", "section"],
          ["String", "item"],
          ["Int", "defvalue"],
        ],
      },
      {
        result: "",
        name: "setPublicString",
        parameters: [
          ["String", "item"],
          ["String", "value"],
        ],
      },
      {
        result: "",
        name: "setPublicInt",
        parameters: [
          ["String", "item"],
          ["Int", "value"],
        ],
      },
      {
        result: "String",
        name: "getPublicString",
        parameters: [
          ["String", "item"],
          ["String", "defvalue"],
        ],
      },
      {
        result: "Int",
        name: "getPublicInt",
        parameters: [
          ["String", "item"],
          ["Int", "defvalue"],
        ],
      },
      { result: "String", name: "getParam", parameters: [] },
      { result: "Group", name: "getScriptGroup", parameters: [] },
      { result: "Int", name: "getViewportWidth", parameters: [] },
      {
        result: "Int",
        name: "getViewportWidthFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getViewportWidthFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getMonitorWidth", parameters: [] },
      {
        result: "Int",
        name: "getMonitorWidthFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "Int",
        name: "getMonitorWidthFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "",
        name: "onMouseMove",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getViewportHeight", parameters: [] },
      {
        result: "Int",
        name: "getViewportHeightFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getViewportHeightFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getMonitorHeight", parameters: [] },
      {
        result: "Int",
        name: "getMonitorHeightFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "Int",
        name: "getMonitorHeightFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      { result: "Int", name: "getMonitorLeft", parameters: [] },
      {
        result: "Int",
        name: "getMonitorLeftFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getMonitorLeftFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getMonitorTop", parameters: [] },
      {
        result: "Int",
        name: "getMonitorTopFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getMonitorTopFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getViewportLeft", parameters: [] },
      {
        result: "Int",
        name: "getViewportLeftFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getViewportLeftFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "getViewportTop", parameters: [] },
      {
        result: "Int",
        name: "getViewportTopFromGuiObject",
        parameters: [["GuiObject", "g"]],
      },
      {
        result: "Int",
        name: "getViewportTopFromPoint",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "debugString",
        parameters: [
          ["String", "str"],
          ["Int", "severity"],
        ],
      },
      {
        result: "",
        name: "ddeSend",
        parameters: [
          ["String", "application"],
          ["String", "command"],
          ["Int", "mininterval"],
        ],
      },
      {
        result: "WindowHolder",
        name: "onLookForComponent",
        parameters: [["String", "guid"]],
      },
      { result: "Int", name: "getCurAppLeft", parameters: [] },
      { result: "Int", name: "getCurAppTop", parameters: [] },
      { result: "Int", name: "getCurAppWidth", parameters: [] },
      { result: "Int", name: "getCurAppHeight", parameters: [] },
      { result: "Boolean", name: "isAppActive", parameters: [] },
      { result: "String", name: "getSkinName", parameters: [] },
      { result: "", name: "switchSkin", parameters: [["String", "skinname"]] },
      { result: "Int", name: "isLoadingSkin", parameters: [] },
      { result: "", name: "lockUI", parameters: [] },
      { result: "", name: "unlockUI", parameters: [] },
      { result: "Browser", name: "getMainBrowser", parameters: [] },
      { result: "", name: "popMainBrowser", parameters: [] },
      { result: "", name: "navigateUrl", parameters: [["String", "url"]] },
      {
        result: "",
        name: "navigateUrlBrowser",
        parameters: [["String", "url"]],
      },
      { result: "Boolean", name: "onOpenURL", parameters: [["string", "url"]] },
      {
        result: "Boolean",
        name: "isObjectValid",
        parameters: [["Object", "o"]],
      },
      { result: "Int", name: "integer", parameters: [["Double", "d"]] },
      { result: "Double", name: "frac", parameters: [["Double", "d"]] },
      { result: "Int", name: "getTimeOfDay", parameters: [] },
      {
        result: "",
        name: "setMenuTransparency",
        parameters: [["int", "alphavalue"]],
      },
      {
        result: "Boolean",
        name: "onGetCancelComponent",
        parameters: [
          ["String", "guid"],
          ["boolean", "goingvisible"],
        ],
      },
      { result: "Int", name: "getStatus", parameters: [] },
      { result: "Int", name: "isKeyDown", parameters: [["int", "vk_code"]] },
      {
        result: "",
        name: "setClipboardText",
        parameters: [["String", "_text"]],
      },
      { result: "String", name: "Chr", parameters: [["Int", "charnum"]] },
      { result: "String", name: "translate", parameters: [["String", "str"]] },
      {
        result: "String",
        name: "getString",
        parameters: [
          ["String", "table"],
          ["int", "id"],
        ],
      },
      { result: "String", name: "getLanguageId", parameters: [] },
      {
        result: "String",
        name: "selectFile",
        parameters: [
          ["String", "extlist"],
          ["String", "id"],
          ["String", "prev_filename"],
        ],
      },
      {
        result: "String",
        name: "selectFolder",
        parameters: [
          ["String", "wnd_title"],
          ["String", "wnd_info"],
          ["String", "default_path"],
        ],
      },
      { result: "", name: "systemMenu", parameters: [] },
      { result: "", name: "windowMenu", parameters: [] },
      {
        result: "",
        name: "triggerAction",
        parameters: [
          ["GuiObject", "context"],
          ["String", "actionname"],
          ["String", "actionparam"],
        ],
      },
      {
        result: "GuiObject",
        name: "showWindow",
        parameters: [
          ["String", "guidorgroupid"],
          ["String", "preferedcontainer"],
          ["Boolean", "transient"],
        ],
      },
      { result: "", name: "hideWindow", parameters: [["GuiObject", "hw"]] },
      {
        result: "",
        name: "hideNamedWindow",
        parameters: [["String", "guidorgroup"]],
      },
      {
        result: "Boolean",
        name: "isNamedWindowVisible",
        parameters: [["String", "guidorgroup"]],
      },
      {
        result: "",
        name: "setAtom",
        parameters: [
          ["String", "atomname"],
          ["Object", "object"],
        ],
      },
      {
        result: "Object",
        name: "getAtom",
        parameters: [["String", "atomname"]],
      },
      { result: "", name: "invokeDebugger", parameters: [] },
      { result: "int", name: "hasVideoSupport", parameters: [] },
      { result: "Int", name: "isVideo", parameters: [] },
      { result: "Int", name: "isVideoFullscreen", parameters: [] },
      { result: "Int", name: "getIdealVideoWidth", parameters: [] },
      { result: "Int", name: "getIdealVideoHeight", parameters: [] },
      { result: "Int", name: "isMinimized", parameters: [] },
      { result: "", name: "minimizeApplication", parameters: [] },
      { result: "", name: "restoreApplication", parameters: [] },
      { result: "", name: "activateApplication", parameters: [] },
      { result: "Int", name: "getPlaylistLength", parameters: [] },
      { result: "Int", name: "getPlaylistIndex", parameters: [] },
      { result: "", name: "clearPlaylist", parameters: [] },
      { result: "Boolean", name: "isDesktopAlphaAvailable", parameters: [] },
      { result: "Boolean", name: "isTransparencyAvailable", parameters: [] },
      { result: "Int", name: "onShowNotification", parameters: [] },
      { result: "String", name: "getSongInfoText", parameters: [] },
      { result: "String", name: "getSongInfoTextTranslated", parameters: [] },
      {
        result: "Int",
        name: "getVisBand",
        parameters: [
          ["int", "channel"],
          ["int", "band"],
        ],
      },
      { result: "Double", name: "getRuntimeVersion", parameters: [] },
      {
        result: "Int",
        name: "isWa2ComponentVisible",
        parameters: [["String", "guid"]],
      },
      {
        result: "",
        name: "hideWa2Component",
        parameters: [["String", "guid"]],
      },
      { result: "boolean", name: "isProVersion", parameters: [] },
      { result: "String", name: "getWinampVersion", parameters: [] },
      { result: "Int", name: "getBuildNumber", parameters: [] },
      {
        result: "int",
        name: "getFileSize",
        parameters: [["String", "fullfilename"]],
      },
    ],
    name: "System",
  },
  K = {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "onSwitchToLayout",
        parameters: [["Layout", "newlayout"]],
      },
      {
        result: "",
        name: "onBeforeSwitchToLayout",
        parameters: [
          ["Layout", "oldlayout"],
          ["Layout", "newlayout"],
        ],
      },
      {
        result: "",
        name: "setXmlParam",
        parameters: [
          ["String", "param"],
          ["String", "value"],
        ],
      },
      { result: "", name: "onHideLayout", parameters: [["Layout", "_layout"]] },
      { result: "", name: "onShowLayout", parameters: [["Layout", "_layout"]] },
      {
        result: "Layout",
        name: "getLayout",
        parameters: [["String", "layout_id"]],
      },
      { result: "Int", name: "getNumLayouts", parameters: [] },
      { result: "Layout", name: "enumLayout", parameters: [["Int", "num"]] },
      {
        result: "",
        name: "switchToLayout",
        parameters: [["String", "layout_id"]],
      },
      { result: "", name: "show", parameters: [] },
      { result: "", name: "hide", parameters: [] },
      { result: "", name: "close", parameters: [] },
      { result: "", name: "toggle", parameters: [] },
      { result: "Int", name: "isDynamic", parameters: [] },
      { result: "", name: "setName", parameters: [["String", "name"]] },
      { result: "String", name: "getName", parameters: [] },
      { result: "String", name: "getGuid", parameters: [] },
      { result: "Layout", name: "getCurLayout", parameters: [] },
      {
        result: "",
        name: "onAddContent",
        parameters: [
          ["GuiObject", "wnd"],
          ["String", "id"],
          ["String", "guid"],
        ],
      },
    ],
    name: "Container",
  },
  J = {
    parent: "Object",
    functions: [
      { result: "String", name: "getGuid", parameters: [] },
      { result: "String", name: "getName", parameters: [] },
      {
        result: "Int",
        name: "sendCommand",
        parameters: [
          ["String", "cmd"],
          ["Int", "param1"],
          ["Int", "param2"],
          ["String", "param3"],
        ],
      },
      { result: "", name: "show", parameters: [] },
      { result: "", name: "hide", parameters: [] },
      { result: "Boolean", name: "isVisible", parameters: [] },
      {
        result: "",
        name: "onNotify",
        parameters: [
          ["String", "notifstr"],
          ["Int", "a"],
          ["Int", "b"],
        ],
      },
      { result: "", name: "onShow", parameters: [] },
      { result: "", name: "onHide", parameters: [] },
      { result: "", name: "setStatusBar", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "getStatusBar", parameters: [] },
    ],
    name: "Wac",
  },
  Z = {
    parent: "Object",
    functions: [
      { result: "", name: "addItem", parameters: [["Any", "_object"]] },
      { result: "", name: "removeItem", parameters: [["int", "pos"]] },
      { result: "Any", name: "enumItem", parameters: [["int", "pos"]] },
      { result: "Int", name: "findItem", parameters: [["Any", "_object"]] },
      {
        result: "Int",
        name: "findItem2",
        parameters: [
          ["Any", "_object"],
          ["int", "startItem"],
        ],
      },
      { result: "int", name: "getNumItems", parameters: [] },
      { result: "", name: "removeAll", parameters: [] },
    ],
    name: "List",
  },
  Q = {
    parent: "Object",
    functions: [
      { result: "boolean", name: "getItem", parameters: [["int", "n"]] },
      {
        result: "",
        name: "setItem",
        parameters: [
          ["int", "n"],
          ["boolean", "val"],
        ],
      },
      { result: "", name: "setSize", parameters: [["int", "s"]] },
      { result: "int", name: "getSize", parameters: [] },
    ],
    name: "BitList",
  },
  ee = {
    parent: "Object",
    functions: [
      {
        result: "Int",
        name: "getValue",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "Int",
        name: "getARGBValue",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "channel"],
        ],
      },
      {
        result: "Boolean",
        name: "inRegion",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "", name: "loadMap", parameters: [["String", "bitmapid"]] },
      { result: "Int", name: "getWidth", parameters: [] },
      { result: "Int", name: "getHeight", parameters: [] },
      { result: "Region", name: "getRegion", parameters: [] },
    ],
    name: "Map",
  },
  te = {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "addSubMenu",
        parameters: [
          ["PopupMenu", "submenu"],
          ["String", "submenutext"],
        ],
      },
      {
        result: "",
        name: "addCommand",
        parameters: [
          ["String", "cmdtxt"],
          ["Int", "cmd_id"],
          ["Boolean", "checked"],
          ["Boolean", "disabled"],
        ],
      },
      { result: "", name: "addSeparator", parameters: [] },
      {
        result: "Int",
        name: "popAtXY",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "Int", name: "popAtMouse", parameters: [] },
      { result: "Int", name: "getNumCommands", parameters: [] },
      {
        result: "",
        name: "checkCommand",
        parameters: [
          ["int", "cmd_id"],
          ["boolean", "check"],
        ],
      },
      {
        result: "",
        name: "disableCommand",
        parameters: [
          ["int", "cmd_id"],
          ["boolean", "disable"],
        ],
      },
    ],
    name: "PopupMenu",
  },
  re = {
    parent: "Object",
    functions: [
      { result: "", name: "add", parameters: [["Region", "reg"]] },
      { result: "", name: "sub", parameters: [["Region", "reg"]] },
      {
        result: "",
        name: "offset",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "", name: "stretch", parameters: [["double", "r"]] },
      { result: "", name: "copy", parameters: [["Region", "reg"]] },
      {
        result: "",
        name: "loadFromMap",
        parameters: [
          ["Map", "regionmap"],
          ["Int", "threshold"],
          ["Boolean", "reversed"],
        ],
      },
      {
        result: "",
        name: "loadFromBitmap",
        parameters: [["String", "bitmapid"]],
      },
      { result: "Int", name: "getBoundingBoxX", parameters: [] },
      { result: "Int", name: "getBoundingBoxY", parameters: [] },
      { result: "Int", name: "getBoundingBoxW", parameters: [] },
      { result: "Int", name: "getBoundingBoxH", parameters: [] },
    ],
    name: "Region",
  },
  ae = {
    parent: "Object",
    functions: [
      { result: "", name: "onTimer", parameters: [] },
      { result: "", name: "setDelay", parameters: [["int", "millisec"]] },
      { result: "Int", name: "getDelay", parameters: [] },
      { result: "", name: "start", parameters: [] },
      { result: "", name: "stop", parameters: [] },
      { result: "", name: "isRunning", parameters: [] },
      { result: "Int", name: "getSkipped", parameters: [] },
    ],
    name: "Timer",
  },
  ne = {
    parent: "Object",
    functions: [
      { result: "Int", name: "setFeed", parameters: [["String", "feed_id"]] },
      { result: "", name: "releaseFeed", parameters: [] },
      {
        result: "",
        name: "onFeedChange",
        parameters: [["String", "new_feeddata"]],
      },
    ],
    name: "FeedWatcher",
  },
  se = {
    parent: "Object",
    functions: [
      { result: "", name: "show", parameters: [] },
      { result: "", name: "hide", parameters: [] },
      { result: "int", name: "isVisible", parameters: [] },
      { result: "", name: "onSetVisible", parameters: [["Boolean", "onoff"]] },
      { result: "", name: "setAlpha", parameters: [["int", "alpha"]] },
      { result: "int", name: "getAlpha", parameters: [] },
      {
        result: "",
        name: "onLeftButtonUp",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onLeftButtonDown",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onRightButtonUp",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onRightButtonDown",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onRightButtonDblClk",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onLeftButtonDblClk",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "int",
        name: "onMouseWheelUp",
        parameters: [
          ["int", "clicked"],
          ["int", "lines"],
        ],
      },
      {
        result: "int",
        name: "onMouseWheelDown",
        parameters: [
          ["int", "clicked"],
          ["int", "lines"],
        ],
      },
      {
        result: "",
        name: "onMouseMove",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "", name: "onEnterArea", parameters: [] },
      { result: "", name: "onLeaveArea", parameters: [] },
      { result: "", name: "setEnabled", parameters: [["boolean", "onoff"]] },
      { result: "boolean", name: "getEnabled", parameters: [] },
      { result: "", name: "onEnable", parameters: [["boolean", "onoff"]] },
      {
        result: "",
        name: "resize",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "w"],
          ["int", "h"],
        ],
      },
      {
        result: "",
        name: "onResize",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "w"],
          ["int", "h"],
        ],
      },
      {
        result: "boolean",
        name: "isMouseOver",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "int", name: "getLeft", parameters: [] },
      { result: "int", name: "getTop", parameters: [] },
      { result: "int", name: "getWidth", parameters: [] },
      { result: "int", name: "getHeight", parameters: [] },
      { result: "", name: "setTargetX", parameters: [["int", "x"]] },
      { result: "", name: "setTargetY", parameters: [["int", "y"]] },
      { result: "", name: "setTargetW", parameters: [["int", "w"]] },
      { result: "", name: "setTargetH", parameters: [["int", "r"]] },
      { result: "", name: "setTargetA", parameters: [["int", "alpha"]] },
      {
        result: "",
        name: "setTargetSpeed",
        parameters: [["float", "insecond"]],
      },
      { result: "", name: "gotoTarget", parameters: [] },
      { result: "", name: "onTargetReached", parameters: [] },
      { result: "", name: "cancelTarget", parameters: [] },
      { result: "", name: "reverseTarget", parameters: [["int", "reverse"]] },
      { result: "", name: "onStartup", parameters: [] },
      { result: "boolean", name: "isGoingToTarget", parameters: [] },
      {
        result: "",
        name: "setXmlParam",
        parameters: [
          ["String", "param"],
          ["String", "value"],
        ],
      },
      {
        result: "String",
        name: "getXmlParam",
        parameters: [["String", "param"]],
      },
      { result: "", name: "init", parameters: [["Group", "parent"]] },
      { result: "", name: "bringToFront", parameters: [] },
      { result: "", name: "bringToBack", parameters: [] },
      { result: "", name: "bringAbove", parameters: [["GuiObject", "guiobj"]] },
      { result: "", name: "bringBelow", parameters: [["GuiObject", "guiobj"]] },
      { result: "Int", name: "getGuiX", parameters: [] },
      { result: "Int", name: "getGuiY", parameters: [] },
      { result: "Int", name: "getGuiW", parameters: [] },
      { result: "Int", name: "getGuiH", parameters: [] },
      { result: "Int", name: "getGuiRelatX", parameters: [] },
      { result: "Int", name: "getGuiRelatY", parameters: [] },
      { result: "Int", name: "getGuiRelatW", parameters: [] },
      { result: "Int", name: "getGuiRelatH", parameters: [] },
      { result: "Boolean", name: "isActive", parameters: [] },
      { result: "GuiObject", name: "getParent", parameters: [] },
      { result: "Layout", name: "getParentLayout", parameters: [] },
      { result: "GuiObject", name: "getTopParent", parameters: [] },
      { result: "int", name: "runModal", parameters: [] },
      { result: "", name: "endModal", parameters: [["int", "retcode"]] },
      {
        result: "GuiObject",
        name: "findObject",
        parameters: [["String", "id"]],
      },
      {
        result: "GuiObject",
        name: "findObjectXY",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "String", name: "getName", parameters: [] },
      { result: "int", name: "clientToScreenX", parameters: [["int", "x"]] },
      { result: "int", name: "clientToScreenY", parameters: [["int", "y"]] },
      { result: "int", name: "clientToScreenW", parameters: [["int", "w"]] },
      { result: "int", name: "clientToScreenH", parameters: [["int", "h"]] },
      { result: "int", name: "screenToClientX", parameters: [["int", "x"]] },
      { result: "int", name: "screenToClientY", parameters: [["int", "y"]] },
      { result: "int", name: "screenToClientW", parameters: [["int", "w"]] },
      { result: "int", name: "screenToClientH", parameters: [["int", "h"]] },
      { result: "int", name: "getAutoWidth", parameters: [] },
      { result: "int", name: "getAutoHeight", parameters: [] },
      { result: "", name: "setFocus", parameters: [] },
      { result: "", name: "onChar", parameters: [["String", "c"]] },
      { result: "", name: "onAccelerator", parameters: [["String", "accel"]] },
      { result: "Boolean", name: "isMouseOverRect", parameters: [] },
      {
        result: "Object",
        name: "getInterface",
        parameters: [["String", "interface_guid"]],
      },
      { result: "", name: "onDragEnter", parameters: [] },
      {
        result: "",
        name: "onDragOver",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      { result: "", name: "onDragLeave", parameters: [] },
      { result: "", name: "onKeyDown", parameters: [["int", "vk_code"]] },
      { result: "", name: "onKeyUp", parameters: [["int", "vk_code"]] },
      { result: "", name: "onGetFocus", parameters: [] },
      { result: "", name: "onKillFocus", parameters: [] },
      {
        result: "Int",
        name: "sendAction",
        parameters: [
          ["String", "action"],
          ["String", "param"],
          ["Int", "x"],
          ["int", "y"],
          ["int", "p1"],
          ["int", "p2"],
        ],
      },
      {
        result: "Int",
        name: "onAction",
        parameters: [
          ["String", "action"],
          ["String", "param"],
          ["Int", "x"],
          ["int", "y"],
          ["int", "p1"],
          ["int", "p2"],
          ["GuiObject", "source"],
        ],
      },
    ],
    name: "GuiObject",
  },
  me = {
    parent: "GuiObject",
    functions: [
      {
        result: "GuiObject",
        name: "getObject",
        parameters: [["String", "object_id"]],
      },
      { result: "Int", name: "getNumObjects", parameters: [] },
      { result: "GuiObject", name: "enumObject", parameters: [["Int", "num"]] },
      {
        result: "",
        name: "onCreateObject",
        parameters: [["GuiObject", "newobj"]],
      },
      { result: "Int", name: "getMousePosX", parameters: [] },
      { result: "Int", name: "getMousePosY", parameters: [] },
      { result: "Boolean", name: "isLayout", parameters: [] },
    ],
    name: "Group",
  },
  le = {
    parent: "Group",
    functions: [
      { result: "", name: "onDock", parameters: [["int", "side"]] },
      { result: "", name: "onUndock", parameters: [] },
      {
        result: "",
        name: "onScale",
        parameters: [["Double", "newscalevalue"]],
      },
      { result: "Double", name: "getScale", parameters: [] },
      { result: "", name: "setScale", parameters: [["Double", "scalevalue"]] },
      {
        result: "",
        name: "setDesktopAlpha",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "getDesktopAlpha", parameters: [] },
      { result: "Container", name: "getContainer", parameters: [] },
      { result: "", name: "center", parameters: [] },
      { result: "", name: "onMove", parameters: [] },
      { result: "", name: "onEndMove", parameters: [] },
      {
        result: "",
        name: "onUserResize",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "w"],
          ["int", "h"],
        ],
      },
      {
        result: "",
        name: "snapAdjust",
        parameters: [
          ["int", "left"],
          ["int", "top"],
          ["int", "right"],
          ["int", "bottom"],
        ],
      },
      { result: "Int", name: "getSnapAdjustTop", parameters: [] },
      { result: "Int", name: "getSnapAdjustRight", parameters: [] },
      { result: "Int", name: "getSnapAdjustLeft", parameters: [] },
      { result: "Int", name: "getSnapAdjustBottom", parameters: [] },
      {
        result: "",
        name: "setRedrawOnResize",
        parameters: [["int", "wantredrawonresize"]],
      },
      { result: "", name: "beforeRedock", parameters: [] },
      { result: "", name: "redock", parameters: [] },
      { result: "Boolean", name: "isTransparencySafe", parameters: [] },
      { result: "Boolean", name: "isLayoutAnimationSafe", parameters: [] },
      { result: "", name: "onMouseEnterLayout", parameters: [] },
      { result: "", name: "onMouseLeaveLayout", parameters: [] },
      { result: "", name: "onSnapAdjustChanged", parameters: [] },
    ],
    name: "Layout",
  },
  ie = {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "setRegionFromMap",
        parameters: [
          ["Map", "regionmap"],
          ["Int", "threshold"],
          ["Boolean", "reverse"],
        ],
      },
      { result: "", name: "setRegion", parameters: [["Region", "reg"]] },
      { result: "GuiObject", name: "getContent", parameters: [] },
      { result: "String", name: "getGuid", parameters: [] },
      { result: "String", name: "getComponentName", parameters: [] },
      { result: "", name: "onGetWac", parameters: [["Wac", "wacobj"]] },
      { result: "", name: "onGiveUpWac", parameters: [["Wac", "wacobj"]] },
      { result: "Wac", name: "getWac", parameters: [] },
      { result: "", name: "setAcceptWac", parameters: [["Boolean", "onoff"]] },
    ],
    name: "WindowHolder",
  },
  ue = {
    parent: "GuiObject",
    functions: [
      { result: "Int", name: "getMaxHeight", parameters: [] },
      { result: "Int", name: "getMaxWidth", parameters: [] },
      { result: "Int", name: "setScroll", parameters: [["int", "x"]] },
      { result: "Int", name: "getScroll", parameters: [] },
      { result: "Int", name: "getNumChildren", parameters: [] },
      { result: "GuiObject", name: "enumChildren", parameters: [["int", "n"]] },
    ],
    name: "ComponentBucket",
  },
  oe = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onEnter", parameters: [] },
      { result: "", name: "onAbort", parameters: [] },
      { result: "", name: "onIdleEditUpdate", parameters: [] },
      { result: "", name: "onEditUpdate", parameters: [] },
      { result: "", name: "setText", parameters: [["String", "txt"]] },
      { result: "", name: "setAutoEnter", parameters: [["boolean", "onoff"]] },
      { result: "Int", name: "getAutoEnter", parameters: [] },
      { result: "String", name: "getText", parameters: [] },
      { result: "", name: "selectAll", parameters: [] },
      { result: "", name: "enter", parameters: [] },
      {
        result: "",
        name: "setIdleEnabled",
        parameters: [["boolean", "onoff"]],
      },
      { result: "Int", name: "getIdleEnabled", parameters: [] },
    ],
    name: "Edit",
  },
  pe = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onSetPosition", parameters: [["int", "newpos"]] },
      { result: "", name: "onPostedPosition", parameters: [["int", "newpos"]] },
      { result: "", name: "onSetFinalPosition", parameters: [["int", "pos"]] },
      { result: "", name: "setPosition", parameters: [["int", "pos"]] },
      { result: "Int", name: "getPosition", parameters: [] },
      { result: "", name: "lock", parameters: [] },
      { result: "", name: "unlock", parameters: [] },
    ],
    name: "Slider",
  },
  ge = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onFrame", parameters: [] },
      { result: "", name: "setRealtime", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "getRealtime", parameters: [] },
      { result: "Int", name: "getMode", parameters: [] },
      { result: "", name: "setMode", parameters: [["Int", "mode"]] },
      { result: "", name: "nextMode", parameters: [] },
    ],
    name: "Vis",
  },
  ce = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "navigateUrl", parameters: [["String", "url"]] },
      { result: "", name: "back", parameters: [] },
      { result: "", name: "forward", parameters: [] },
      { result: "", name: "stop", parameters: [] },
      { result: "", name: "refresh", parameters: [] },
      { result: "", name: "home", parameters: [] },
      {
        result: "",
        name: "setTargetName",
        parameters: [["String", "targetname"]],
      },
      {
        result: "Boolean",
        name: "onBeforeNavigate",
        parameters: [
          ["String", "url"],
          ["Int", "flags"],
          ["String", "targetframename"],
        ],
      },
      {
        result: "",
        name: "onDocumentComplete",
        parameters: [["String", "url"]],
      },
      { result: "", name: "onDocumentReady", parameters: [["String", "url"]] },
      { result: "String", name: "getDocumentTitle", parameters: [] },
      {
        result: "",
        name: "onNavigateError",
        parameters: [
          ["String", "url"],
          ["int", "code"],
        ],
      },
      {
        result: "",
        name: "setCancelIEErrorPage",
        parameters: [["boolean", "cancel"]],
      },
      { result: "", name: "scrape", parameters: [] },
      {
        result: "string",
        name: "onMediaLink",
        parameters: [["string", "url"]],
      },
    ],
    name: "Browser",
  },
  de = { parent: "GuiObject", functions: [], name: "EqVis" },
  Ie = { parent: "GuiObject", functions: [], name: "Status" },
  fe = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "setText", parameters: [["String", "txt"]] },
      { result: "", name: "setAlternateText", parameters: [["String", "txt"]] },
      { result: "String", name: "getText", parameters: [] },
      { result: "int", name: "getTextWidth", parameters: [] },
      { result: "", name: "onTextChanged", parameters: [["String", "newtxt"]] },
    ],
    name: "Text",
  },
  Se = { parent: "GuiObject", functions: [], name: "Title" },
  be = {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onBeginResize",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "w"],
          ["int", "h"],
        ],
      },
      {
        result: "",
        name: "onEndResize",
        parameters: [
          ["int", "x"],
          ["int", "y"],
          ["int", "w"],
          ["int", "h"],
        ],
      },
      { result: "", name: "fx_onInit", parameters: [] },
      { result: "", name: "fx_onFrame", parameters: [] },
      {
        result: "Double",
        name: "fx_onGetPixelR",
        parameters: [
          ["double", "r"],
          ["double", "d"],
          ["double", "x"],
          ["double", "y"],
        ],
      },
      {
        result: "Double",
        name: "fx_onGetPixelD",
        parameters: [
          ["double", "r"],
          ["double", "d"],
          ["double", "x"],
          ["double", "y"],
        ],
      },
      {
        result: "Double",
        name: "fx_onGetPixelX",
        parameters: [
          ["double", "r"],
          ["double", "d"],
          ["double", "x"],
          ["double", "y"],
        ],
      },
      {
        result: "Double",
        name: "fx_onGetPixelY",
        parameters: [
          ["double", "r"],
          ["double", "d"],
          ["double", "x"],
          ["double", "y"],
        ],
      },
      {
        result: "Double",
        name: "fx_onGetPixelA",
        parameters: [
          ["double", "r"],
          ["double", "d"],
          ["double", "x"],
          ["double", "y"],
        ],
      },
      {
        result: "",
        name: "setRegionFromMap",
        parameters: [
          ["Map", "regionmap"],
          ["int", "threshold"],
          ["boolean", "reverse"],
        ],
      },
      { result: "", name: "setRegion", parameters: [["Region", "reg"]] },
      { result: "", name: "fx_setEnabled", parameters: [["boolean", "onoff"]] },
      { result: "Boolean", name: "fx_getEnabled", parameters: [] },
      { result: "", name: "fx_setWrap", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "fx_getWrap", parameters: [] },
      { result: "", name: "fx_setRect", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "fx_getRect", parameters: [] },
      { result: "", name: "fx_setBgFx", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "fx_getBgFx", parameters: [] },
      { result: "", name: "fx_setClear", parameters: [["Boolean", "onoff"]] },
      { result: "Boolean", name: "fx_getClear", parameters: [] },
      { result: "", name: "fx_setSpeed", parameters: [["Int", "msperframe"]] },
      { result: "Int", name: "fx_getSpeed", parameters: [] },
      {
        result: "",
        name: "fx_setRealtime",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "fx_getRealtime", parameters: [] },
      {
        result: "",
        name: "fx_setLocalized",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "fx_getLocalized", parameters: [] },
      {
        result: "",
        name: "fx_setBilinear",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "fx_getBilinear", parameters: [] },
      {
        result: "",
        name: "fx_setAlphaMode",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "fx_getAlphaMode", parameters: [] },
      {
        result: "",
        name: "fx_setGridSize",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      { result: "", name: "fx_update", parameters: [] },
      { result: "", name: "fx_restart", parameters: [] },
      { result: "Boolean", name: "isInvalid", parameters: [] },
    ],
    name: "Layer",
  },
  Ce = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onActivate", parameters: [["int", "activated"]] },
      { result: "", name: "onLeftClick", parameters: [] },
      { result: "", name: "onRightClick", parameters: [] },
      { result: "", name: "setActivated", parameters: [["Boolean", "onoff"]] },
      {
        result: "",
        name: "setActivatedNoCallback",
        parameters: [["Boolean", "onoff"]],
      },
      { result: "Boolean", name: "getActivated", parameters: [] },
      { result: "", name: "leftClick", parameters: [] },
      { result: "", name: "rightClick", parameters: [] },
    ],
    name: "Button",
  },
  he = {
    parent: "Layer",
    functions: [
      { result: "", name: "onPlay", parameters: [] },
      { result: "", name: "onPause", parameters: [] },
      { result: "", name: "onResume", parameters: [] },
      { result: "", name: "onStop", parameters: [] },
      { result: "", name: "onFrame", parameters: [["Int", "framenum"]] },
      { result: "", name: "setSpeed", parameters: [["Int", "msperframe"]] },
      { result: "", name: "gotoFrame", parameters: [["int", "framenum"]] },
      { result: "", name: "setStartFrame", parameters: [["Int", "framenum"]] },
      { result: "", name: "setEndFrame", parameters: [["int", "framenum"]] },
      { result: "", name: "setAutoReplay", parameters: [["Boolean", "onoff"]] },
      { result: "", name: "play", parameters: [] },
      { result: "", name: "stop", parameters: [] },
      { result: "", name: "pause", parameters: [] },
      { result: "Boolean", name: "isPlaying", parameters: [] },
      { result: "Boolean", name: "isPaused", parameters: [] },
      { result: "Boolean", name: "isStopped", parameters: [] },
      { result: "Int", name: "getStartFrame", parameters: [] },
      { result: "Int", name: "getEndFrame", parameters: [] },
      { result: "Int", name: "getLength", parameters: [] },
      { result: "Int", name: "getDirection", parameters: [] },
      { result: "Boolean", name: "getAutoReplay", parameters: [] },
      { result: "Int", name: "getCurFrame", parameters: [] },
      { result: "", name: "setRealtime", parameters: [["Boolean", "onoff"]] },
    ],
    name: "AnimatedLayer",
  },
  Be = {
    parent: "Layer",
    functions: [
      { result: "", name: "refresh", parameters: [] },
      { result: "", name: "isLoading", parameters: [] },
      {
        result: "",
        name: "onAlbumArtLoaded",
        parameters: [["boolean", "success"]],
      },
    ],
    name: "AlbumArtLayer",
  },
  ye = {
    parent: "Button",
    functions: [
      { result: "", name: "onToggle", parameters: [["Boolean", "onoff"]] },
      { result: "int", name: "getCurCfgVal", parameters: [] },
    ],
    name: "ToggleButton",
  },
  De = {
    parent: "GuiObject",
    functions: [
      {
        result: "Group",
        name: "instantiate",
        parameters: [
          ["String", "group_id"],
          ["int", "num_groups"],
        ],
      },
      { result: "Int", name: "getNumItems", parameters: [] },
      { result: "Group", name: "enumItem", parameters: [["int", "num"]] },
      { result: "", name: "removeAll", parameters: [] },
      { result: "", name: "scrollToPercent", parameters: [["Int", "percent"]] },
      { result: "", name: "setRedraw", parameters: [["int", "redraw"]] },
    ],
    name: "GroupList",
  },
  Te = {
    parent: "Group",
    functions: [
      { result: "Int", name: "cfgGetInt", parameters: [] },
      { result: "", name: "cfgSetInt", parameters: [["Int", "intvalue"]] },
      { result: "String", name: "cfgGetString", parameters: [] },
      { result: "Float", name: "cfgGetFloat", parameters: [] },
      {
        result: "",
        name: "cfgSetFloat",
        parameters: [["Float", "floatvalue"]],
      },
      {
        result: "",
        name: "cfgSetString",
        parameters: [["String", "strvalue"]],
      },
      { result: "", name: "onCfgChanged", parameters: [] },
      { result: "String", name: "cfgGetGuid", parameters: [] },
      { result: "String", name: "cfgGetName", parameters: [] },
    ],
    name: "CfgGroup",
  },
  Ae = {
    parent: "GuiObject",
    functions: [{ result: "", name: "onResetQuery", parameters: [] }],
    name: "QueryList",
  },
  xe = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "setRedirection", parameters: [["GuiObject", "o"]] },
      { result: "GuiObject", name: "getRedirection", parameters: [] },
      {
        result: "",
        name: "setRegionFromMap",
        parameters: [
          ["Map", "regionmap"],
          ["Int", "threshold"],
          ["Boolean", "reverse"],
        ],
      },
      { result: "", name: "setRegion", parameters: [["Region", "reg"]] },
    ],
    name: "MouseRedir",
  },
  Fe = {
    parent: "GuiObject",
    functions: [
      { result: "String", name: "getItemSelected", parameters: [] },
      {
        result: "",
        name: "onSelect",
        parameters: [
          ["Int", "id"],
          ["Int", "hover"],
        ],
      },
      { result: "", name: "setListHeight", parameters: [["Int", "h"]] },
      { result: "", name: "openList", parameters: [] },
      { result: "", name: "closeList", parameters: [] },
      { result: "", name: "setItems", parameters: [["String", "lotsofitems"]] },
      { result: "Int", name: "addItem", parameters: [["String", "_text"]] },
      { result: "", name: "delItem", parameters: [["Int", "id"]] },
      { result: "Int", name: "findItem", parameters: [["String", "_text"]] },
      { result: "Int", name: "getNumItems", parameters: [] },
      {
        result: "",
        name: "selectItem",
        parameters: [
          ["Int", "id"],
          ["Int", "hover"],
        ],
      },
      { result: "String", name: "getItemText", parameters: [["Int", "id"]] },
      { result: "Int", name: "getSelected", parameters: [] },
      { result: "String", name: "getSelectedText", parameters: [] },
      { result: "String", name: "getCustomText", parameters: [] },
      { result: "", name: "deleteAllItems", parameters: [] },
      { result: "", name: "setNoItemText", parameters: [["String", "txt"]] },
    ],
    name: "DropDownList",
  },
  we = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "callme", parameters: [["String", "str"]] },
    ],
    name: "LayoutStatus",
  },
  Ee = {
    parent: "GuiObject",
    functions: [
      { result: "Int", name: "getCurPage", parameters: [] },
      { result: "", name: "setCurPage", parameters: [["Int", "a"]] },
    ],
    name: "TabSheet",
  },
  je = {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "addColumn",
        parameters: [
          ["String", "name"],
          ["Int", "width"],
          ["Int", "numeric"],
        ],
      },
      { result: "Int", name: "getNumColumns", parameters: [] },
      {
        result: "Int",
        name: "getColumnWidth",
        parameters: [["Int", "column"]],
      },
      {
        result: "",
        name: "setColumnWidth",
        parameters: [
          ["Int", "column"],
          ["Int", "newwidth"],
        ],
      },
      {
        result: "String",
        name: "getColumnLabel",
        parameters: [["Int", "column"]],
      },
      {
        result: "",
        name: "setColumnLabel",
        parameters: [
          ["Int", "column"],
          ["String", "newlabel"],
        ],
      },
      {
        result: "Int",
        name: "getColumnNumeric",
        parameters: [["Int", "column"]],
      },
      {
        result: "",
        name: "setColumnDynamic",
        parameters: [
          ["Int", "column"],
          ["Int", "isdynamic"],
        ],
      },
      {
        result: "Int",
        name: "isColumnDynamic",
        parameters: [["Int", "column"]],
      },
      { result: "", name: "invalidateColumns", parameters: [] },
      { result: "Int", name: "getNumItems", parameters: [] },
      { result: "Int", name: "getItemCount", parameters: [] },
      { result: "Int", name: "addItem", parameters: [["String", "label"]] },
      {
        result: "Int",
        name: "insertItem",
        parameters: [
          ["Int", "pos"],
          ["String", "label"],
        ],
      },
      { result: "Int", name: "getLastAddedItemPos", parameters: [] },
      {
        result: "",
        name: "setSubItem",
        parameters: [
          ["Int", "pos"],
          ["Int", "subpos"],
          ["String", "txt"],
        ],
      },
      { result: "", name: "deleteAllItems", parameters: [] },
      { result: "Int", name: "deleteByPos", parameters: [["Int", "pos"]] },
      {
        result: "String",
        name: "getItemLabel",
        parameters: [
          ["Int", "pos"],
          ["Int", "subpos"],
        ],
      },
      {
        result: "String",
        name: "getSubitemText",
        parameters: [
          ["Int", "pos"],
          ["Int", "subpos"],
        ],
      },
      {
        result: "",
        name: "setItemLabel",
        parameters: [
          ["Int", "pos"],
          ["String", "_text"],
        ],
      },
      { result: "Int", name: "invalidateItem", parameters: [["Int", "pos"]] },
      { result: "Int", name: "getFirstItemVisible", parameters: [] },
      { result: "Int", name: "getLastItemVisible", parameters: [] },
      {
        result: "",
        name: "setItemIcon",
        parameters: [
          ["Int", "pos"],
          ["String", "bitmapId"],
        ],
      },
      { result: "String", name: "getItemIcon", parameters: [["Int", "pos"]] },
      { result: "", name: "setMinimumSize", parameters: [["Int", "size"]] },
      { result: "Int", name: "getWantAutoDeselect", parameters: [] },
      {
        result: "",
        name: "setWantAutoDeselect",
        parameters: [["Int", "want"]],
      },
      { result: "", name: "onSetVisible", parameters: [["Int", "show"]] },
      { result: "", name: "setAutoSort", parameters: [["Int", "dosort"]] },
      { result: "Int", name: "setFontSize", parameters: [["Int", "size"]] },
      { result: "Int", name: "getFontSize", parameters: [] },
      { result: "Int", name: "getHeaderHeight", parameters: [] },
      { result: "Int", name: "getPreventMultipleSelection", parameters: [] },
      {
        result: "Int",
        name: "setPreventMultipleSelection",
        parameters: [["Int", "val"]],
      },
      { result: "", name: "setShowIcons", parameters: [["int", "showThem"]] },
      { result: "Int", name: "getShowIcons", parameters: [] },
      { result: "Int", name: "setIconWidth", parameters: [["int", "width"]] },
      { result: "Int", name: "setIconHeight", parameters: [["int", "width"]] },
      { result: "", name: "getIconWidth", parameters: [] },
      { result: "", name: "getIconHeight", parameters: [] },
      { result: "", name: "next", parameters: [] },
      { result: "", name: "previous", parameters: [] },
      { result: "", name: "pagedown", parameters: [] },
      { result: "", name: "pageup", parameters: [] },
      { result: "", name: "home", parameters: [] },
      { result: "", name: "end", parameters: [] },
      { result: "", name: "reset", parameters: [] },
      { result: "", name: "ensureItemVisible", parameters: [["Int", "pos"]] },
      { result: "Int", name: "scrollAbsolute", parameters: [["Int", "x"]] },
      { result: "Int", name: "scrollRelative", parameters: [["Int", "x"]] },
      { result: "", name: "scrollLeft", parameters: [["Int", "lines"]] },
      { result: "", name: "scrollRight", parameters: [["Int", "lines"]] },
      { result: "", name: "scrollUp", parameters: [["Int", "lines"]] },
      { result: "", name: "scrollDown", parameters: [["Int", "lines"]] },
      { result: "", name: "jumpToNext", parameters: [["Int", "c"]] },
      { result: "", name: "scrollToItem", parameters: [["Int", "pos"]] },
      { result: "", name: "selectCurrent", parameters: [] },
      { result: "", name: "selectFirstEntry", parameters: [] },
      { result: "Int", name: "getItemSelected", parameters: [["Int", "pos"]] },
      { result: "Int", name: "isItemFocused", parameters: [["Int", "pos"]] },
      { result: "Int", name: "getItemFocused", parameters: [] },
      { result: "", name: "setItemFocused", parameters: [["Int", "pos"]] },
      { result: "Int", name: "getFirstItemSelected", parameters: [] },
      {
        result: "Int",
        name: "getNextItemSelected",
        parameters: [["Int", "lastpos"]],
      },
      { result: "Int", name: "selectAll", parameters: [] },
      { result: "Int", name: "deselectAll", parameters: [] },
      { result: "Int", name: "invertSelection", parameters: [] },
      { result: "", name: "setSelectionStart", parameters: [["Int", "pos"]] },
      { result: "", name: "setSelectionEnd", parameters: [["Int", "pos"]] },
      {
        result: "",
        name: "setSelected",
        parameters: [
          ["Int", "pos"],
          ["Int", "selected"],
        ],
      },
      {
        result: "",
        name: "toggleSelection",
        parameters: [
          ["Int", "pos"],
          ["Int", "setfocus"],
        ],
      },
      { result: "", name: "resort", parameters: [] },
      { result: "Int", name: "getSortDirection", parameters: [] },
      { result: "Int", name: "getSortColumn", parameters: [] },
      { result: "", name: "setSortColumn", parameters: [["Int", "col"]] },
      { result: "", name: "setSortDirection", parameters: [["Int", "dir"]] },
      {
        result: "",
        name: "moveItem",
        parameters: [
          ["Int", "from"],
          ["Int", "to"],
        ],
      },
      { result: "", name: "onSelectAll", parameters: [] },
      { result: "", name: "onDelete", parameters: [] },
      { result: "", name: "onDoubleClick", parameters: [["Int", "itemnum"]] },
      { result: "", name: "onLeftClick", parameters: [["Int", "itemnum"]] },
      {
        result: "",
        name: "onSecondLeftClick",
        parameters: [["Int", "itemnum"]],
      },
      { result: "Int", name: "onRightClick", parameters: [["Int", "itemnum"]] },
      {
        result: "Int",
        name: "onColumnDblClick",
        parameters: [
          ["Int", "col"],
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      {
        result: "Int",
        name: "onColumnLabelClick",
        parameters: [
          ["Int", "col"],
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      {
        result: "",
        name: "onItemSelection",
        parameters: [
          ["Int", "itemnum"],
          ["Int", "selected"],
        ],
      },
      {
        result: "Int",
        name: "onIconLeftClick",
        parameters: [
          ["int", "itemnum"],
          ["int", "x"],
          ["int", "y"],
        ],
      },
    ],
    name: "GuiList",
  },
  ve = {
    parent: "GuiObject",
    functions: [
      { result: "Int", name: "onWantAutoContextMenu", parameters: [] },
      {
        result: "Int",
        name: "onMouseWheelUp",
        parameters: [
          ["Int", "clicked"],
          ["Int", "lines"],
        ],
      },
      {
        result: "Int",
        name: "onMouseWheelDown",
        parameters: [
          ["Int", "clicked"],
          ["Int", "lines"],
        ],
      },
      {
        result: "Int",
        name: "onContextMenu",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      { result: "Int", name: "onChar", parameters: [["Int", "c"]] },
      {
        result: "",
        name: "onItemRecvDrop",
        parameters: [["TreeItem", "item"]],
      },
      { result: "", name: "onLabelChange", parameters: [["TreeItem", "item"]] },
      {
        result: "",
        name: "onItemSelected",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "onItemDeselected",
        parameters: [["TreeItem", "item"]],
      },
      { result: "Int", name: "getNumRootItems", parameters: [] },
      {
        result: "TreeItem",
        name: "enumRootItem",
        parameters: [["Int", "which"]],
      },
      { result: "", name: "jumpToNext", parameters: [["Int", "c"]] },
      {
        result: "",
        name: "ensureItemVisible",
        parameters: [["TreeItem", "item"]],
      },
      { result: "Int", name: "getContentsWidth", parameters: [] },
      { result: "Int", name: "getContentsHeight", parameters: [] },
      {
        result: "TreeItem",
        name: "addTreeItem",
        parameters: [
          ["TreeItem", "item"],
          ["TreeItem", "par"],
          ["Int", "sorted"],
          ["Int", "haschildtab"],
        ],
      },
      {
        result: "Int",
        name: "removeTreeItem",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "moveTreeItem",
        parameters: [
          ["TreeItem", "item"],
          ["TreeItem", "newparent"],
        ],
      },
      { result: "", name: "deleteAllItems", parameters: [] },
      { result: "Int", name: "expandItem", parameters: [["TreeItem", "item"]] },
      {
        result: "",
        name: "expandItemDeferred",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "Int",
        name: "collapseItem",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "collapseItemDeferred",
        parameters: [["TreeItem", "item"]],
      },
      { result: "", name: "selectItem", parameters: [["TreeItem", "item"]] },
      {
        result: "",
        name: "selectItemDeferred",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "delItemDeferred",
        parameters: [["TreeItem", "item"]],
      },
      { result: "", name: "hiliteItem", parameters: [["TreeItem", "item"]] },
      { result: "", name: "unhiliteItem", parameters: [["TreeItem", "item"]] },
      { result: "TreeItem", name: "getCurItem", parameters: [] },
      {
        result: "TreeItem",
        name: "hitTest",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      { result: "", name: "editItemLabel", parameters: [["TreeItem", "item"]] },
      {
        result: "",
        name: "cancelEditLabel",
        parameters: [["Int", "destroyit"]],
      },
      { result: "", name: "setAutoEdit", parameters: [["Int", "ae"]] },
      { result: "Int", name: "getAutoEdit", parameters: [] },
      {
        result: "TreeItem",
        name: "getByLabel",
        parameters: [
          ["TreeItem", "item"],
          ["String", "name"],
        ],
      },
      { result: "", name: "setSorted", parameters: [["Int", "dosort"]] },
      { result: "Int", name: "getSorted", parameters: [] },
      { result: "", name: "sortTreeItems", parameters: [] },
      {
        result: "TreeItem",
        name: "getSibling",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "setAutoCollapse",
        parameters: [["Int", "doautocollapse"]],
      },
      { result: "Int", name: "setFontSize", parameters: [["Int", "newsize"]] },
      { result: "Int", name: "getFontSize", parameters: [] },
      {
        result: "Int",
        name: "getNumVisibleChildItems",
        parameters: [["TreeItem", "c"]],
      },
      { result: "Int", name: "getNumVisibleItems", parameters: [] },
      {
        result: "TreeItem",
        name: "enumVisibleItems",
        parameters: [["Int", "n"]],
      },
      {
        result: "TreeItem",
        name: "enumVisibleChildItems",
        parameters: [
          ["TreeItem", "c"],
          ["Int", "n"],
        ],
      },
      { result: "TreeItem", name: "enumAllItems", parameters: [["Int", "n"]] },
      {
        result: "Int",
        name: "getItemRectX",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "Int",
        name: "getItemRectY",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "Int",
        name: "getItemRectW",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "Int",
        name: "getItemRectH",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "TreeItem",
        name: "getItemFromPoint",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
    ],
    name: "GuiTree",
  },
  Le = {
    parent: "Object",
    functions: [
      { result: "Int", name: "getNumChildren", parameters: [] },
      { result: "", name: "setLabel", parameters: [["String", "label"]] },
      { result: "String", name: "getLabel", parameters: [] },
      { result: "", name: "ensureVisible", parameters: [] },
      { result: "TreeItem", name: "getNthChild", parameters: [["Int", "nth"]] },
      { result: "TreeItem", name: "getChild", parameters: [] },
      {
        result: "TreeItem",
        name: "getChildSibling",
        parameters: [["TreeItem", "_item"]],
      },
      { result: "TreeItem", name: "getSibling", parameters: [] },
      { result: "TreeItem", name: "getParent", parameters: [] },
      { result: "", name: "editLabel", parameters: [] },
      { result: "Int", name: "hasSubItems", parameters: [] },
      { result: "", name: "setSorted", parameters: [["Int", "issorted"]] },
      { result: "", name: "setChildTab", parameters: [["Int", "haschildtab"]] },
      { result: "Int", name: "isSorted", parameters: [] },
      { result: "Int", name: "isCollapsed", parameters: [] },
      { result: "Int", name: "isExpanded", parameters: [] },
      { result: "", name: "invalidate", parameters: [] },
      { result: "Int", name: "isSelected", parameters: [] },
      { result: "Int", name: "isHilited", parameters: [] },
      { result: "", name: "setHilited", parameters: [["Int", "ishilited"]] },
      { result: "Int", name: "collapse", parameters: [] },
      { result: "Int", name: "expand", parameters: [] },
      { result: "GuiTree", name: "getTree", parameters: [] },
      { result: "", name: "onTreeAdd", parameters: [] },
      { result: "", name: "onTreeRemove", parameters: [] },
      { result: "", name: "onSelect", parameters: [] },
      { result: "", name: "onDeselect", parameters: [] },
      { result: "Int", name: "onLeftDoubleClick", parameters: [] },
      { result: "Int", name: "onRightDoubleClick", parameters: [] },
      { result: "Int", name: "onChar", parameters: [["Int", "key"]] },
      { result: "", name: "onExpand", parameters: [] },
      { result: "", name: "onCollapse", parameters: [] },
      { result: "Int", name: "onBeginLabelEdit", parameters: [] },
      {
        result: "Int",
        name: "onEndLabelEdit",
        parameters: [["String", "newlabel"]],
      },
      {
        result: "Int",
        name: "onContextMenu",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
    ],
    name: "TreeItem",
  },
  Oe = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onOpenMenu", parameters: [] },
      { result: "", name: "onCloseMenu", parameters: [] },
      { result: "", name: "onSelectItem", parameters: [["String", "item"]] },
      { result: "", name: "openMenu", parameters: [] },
      { result: "", name: "closeMenu", parameters: [] },
    ],
    name: "MenuButton",
  },
  Ge = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "onToggle", parameters: [["int", "newstate"]] },
      { result: "", name: "setChecked", parameters: [["int", "checked"]] },
      { result: "Int", name: "isChecked", parameters: [] },
      { result: "", name: "setText", parameters: [["String", "txt"]] },
      { result: "String", name: "getText", parameters: [] },
    ],
    name: "CheckBox",
  },
  Me = {
    parent: "GuiObject",
    functions: [
      { result: "Int", name: "getContentsHeight", parameters: [] },
      { result: "", name: "newCell", parameters: [["String", "groupname"]] },
      { result: "", name: "nextRow", parameters: [] },
      { result: "", name: "deleteAll", parameters: [] },
    ],
    name: "Form",
  },
  Pe = {
    parent: "GuiObject",
    functions: [
      { result: "Int", name: "getPosition", parameters: [] },
      { result: "", name: "setPosition", parameters: [["Int", "position"]] },
      { result: "", name: "onSetPosition", parameters: [["Int", "position"]] },
    ],
    name: "Frame",
  },
  Re = {
    parent: "GuiObject",
    functions: [
      { result: "", name: "setMenuGroup", parameters: [["String", "groupId"]] },
      { result: "String", name: "getMenuGroup", parameters: [] },
      { result: "", name: "setMenu", parameters: [["String", "menuId"]] },
      { result: "String", name: "getMenu", parameters: [] },
      { result: "", name: "spawnMenu", parameters: [["int", "monitor"]] },
      { result: "", name: "cancelMenu", parameters: [] },
      { result: "", name: "setNormalId", parameters: [["String", "id"]] },
      { result: "", name: "setDownId", parameters: [["String", "id"]] },
      { result: "", name: "setHoverId", parameters: [["String", "id"]] },
      { result: "", name: "onOpenMenu", parameters: [] },
      { result: "", name: "onCloseMenu", parameters: [] },
      { result: "", name: "nextMenu", parameters: [] },
      { result: "", name: "previousMenu", parameters: [] },
    ],
    name: "Menu",
  },
  S = {
    "516549710D874a5191E3A6B53235F3E7": X,
    D6F50F6493FA49b793F1BA66EFAE3E98: Y,
    E90DC47B840D4ae7B02C040BD275F7FC: K,
    "00C074A0FEA249a0BE8DFABBDB161640": J,
    B2023AB5434D4ba1BEAE59637503F3C6: Z,
    "87C65778E74349fe85F909CC532AFD56": Q,
    "38603665461B42a7AA75D83F6667BF73": ee,
    F4787AF4B2BB4ef79CFBE74BA9BEA88D: te,
    "3A370C023CBF439f84F186885BCF1E36": re,
    "5D0C5BB67DE14b1fA70F8D1659941941": ae,
    A5376FA14E94411a83F605EC5EEA5F0A: ne,
    "4EE3E199C6364bec97CD78BC9C8628B0": se,
    "45BE95E520724191935CBB5FF9F117FD": me,
    "60906D4E537E482eB004CC9461885672": le,
    "403ABCC06F224bd68BA410C829932547": ie,
    "97AA3E4DF4D04fa8817B0AF22A454983": ue,
    "64E4BBFA81F449d9B0C0A85B2EC3BCFD": oe,
    "62B65E3F375E408d8DEA76814AB91B77": pe,
    CE4F97BE77B04e199956D49833C96C27: ge,
    A8C2200D51EB4b2aBA7F5D4BC65D4C71: ce,
    "8D1EBA38489E483eB9608D1F43C5C405": de,
    "0F08C940AF394b2380F3B8C48F7EBB59": Ie,
    EFAA8672310E41faB7DC85A9525BCB4B: fe,
    "7DFD324437514e7cBF4082AE5F3ADC33": Se,
    "5AB9FA159A7D4557ABC86557A6C67CA9": be,
    "698EDDCD8F1E4fec9B12F944F909FF45": Ce,
    "6B64CD275A264c4b8C59E6A70CF6493A": he,
    "6DCB05E48AC448c2B19349F0910EF54A": Be,
    B4DCCFFF81FE4bcc961B720FD5BE0FFF: ye,
    "01E28CE1B05911d5979FE4DE6F51760A": De,
    "80F0F8BD1BA542a6A0933236A00C8D4A": Te,
    CDCB785D81F242538F0561B872283CFA: Ae,
    "9B2E341B6C9840fa8B850C1B6EE89405": xe,
    "36D59B7103FD4af897950502B7DB267A": Fe,
    "7FD5F210ACC448dfA6A05451576CDC76": we,
    B5BAA53505B34dcbADC1E618D28F6896: Ee,
    "6129FEC1DAB74d51916501CA0C1B70DB": je,
    D59514F7ED3645e8980F3F4EA0522CD9: ve,
    "9B3B4B82667A420e8FFC794115809C02": Le,
    "1D8631C880D047929F98BD5D36B49136": Oe,
    C7ED319953194798986360B15A298CAA: Ge,
    "2D2D1376BE0A4CB9BC0C57E6E4C999F5": Me,
    E2BBC14D84F64173BDB3B2EB2F665550: Pe,
    "73C00594961F401B9B1B672427AC4165": Re,
  };
var j = {};
Object.values(S).forEach((e) => {
  j[e.name] = e;
});
function m(e, r) {
  return j[e].functions.find(({ name: a }) => a === r);
}
m("Timer", "isRunning").result = "boolean";
m("ToggleButton", "onToggle").parameters[0][1] = "onoff";
m("GuiTree", "onChar").parameters[0][0] = "string";
m("GuiList", "onSetVisible").parameters[0][0] = "boolean";
m("Wac", "onNotify").parameters = m("Object", "onNotify").parameters;
m("Wac", "onNotify").result = "int";
var v = S;
var ke = {
    parent: "Object",
    functions: [
      { result: "int", name: "getNumTracks", parameters: [] },
      { result: "int", name: "getCurrentIndex", parameters: [] },
      { result: "int", name: "getNumSelectedTracks", parameters: [] },
      {
        result: "int",
        name: "getNextSelectedTrack",
        parameters: [["int", "i"]],
      },
      { result: "", name: "showCurrentlyPlayingTrack", parameters: [] },
      { result: "", name: "showTrack", parameters: [["int", "item"]] },
      { result: "", name: "enqueueFile", parameters: [["string", "file"]] },
      { result: "", name: "clear", parameters: [] },
      { result: "", name: "removeTrack", parameters: [["int", "item"]] },
      {
        result: "",
        name: "swapTracks",
        parameters: [
          ["int", "item1"],
          ["int", "item2"],
        ],
      },
      { result: "", name: "moveUp", parameters: [["int", "item"]] },
      { result: "", name: "moveDown", parameters: [["int", "item"]] },
      {
        result: "",
        name: "moveTo",
        parameters: [
          ["int", "item"],
          ["int", "pos"],
        ],
      },
      { result: "", name: "playTrack", parameters: [["int", "item"]] },
      { result: "int", name: "getRating", parameters: [["int", "item"]] },
      {
        result: "",
        name: "setRating",
        parameters: [
          ["int", "item"],
          ["int", "rating"],
        ],
      },
      { result: "String", name: "getTitle", parameters: [["int", "item"]] },
      { result: "String", name: "getLength", parameters: [["int", "item"]] },
      {
        result: "String",
        name: "getMetaData",
        parameters: [
          ["int", "item"],
          ["String", "metadatastring"],
        ],
      },
      { result: "String", name: "getFileName", parameters: [["int", "item"]] },
      { result: "", name: "onPleditModified", parameters: [] },
    ],
    name: "PlEdit",
  },
  _e = {
    parent: "Object",
    functions: [
      { result: "int", name: "getNumItems", parameters: [] },
      { result: "String", name: "getItemName", parameters: [["int", "item"]] },
      { result: "", name: "showCurrentlyPlayingEntry", parameters: [] },
      { result: "", name: "refresh", parameters: [] },
      {
        result: "",
        name: "renameItem",
        parameters: [
          ["int", "item"],
          ["String", "name"],
        ],
      },
      { result: "", name: "enqueueItem", parameters: [["int", "item"]] },
      { result: "", name: "playItem", parameters: [["int", "item"]] },
    ],
    name: "PlDir",
  },
  L = {
    "345BEEBC0229492190BE6CB6A49A79D9": ke,
    "61A7ABAD7D7941f6B1D0E1808603A4F4": _e,
  };
var Ne = {
    parent: "Object",
    functions: [
      {
        result: "ConfigItem",
        name: "getItem",
        parameters: [["String", "item_name"]],
      },
      {
        result: "ConfigItem",
        name: "getItemByGuid",
        parameters: [["String", "item_guid"]],
      },
      {
        result: "ConfigItem",
        name: "newItem",
        parameters: [
          ["String", "item_name"],
          ["String", "item_guid"],
        ],
      },
    ],
    name: "Config",
  },
  We = {
    parent: "Object",
    functions: [
      {
        result: "ConfigAttribute",
        name: "getAttribute",
        parameters: [["String", "attr_name"]],
      },
      {
        result: "ConfigAttribute",
        name: "newAttribute",
        parameters: [
          ["String", "attr_name"],
          ["String", "default_value"],
        ],
      },
      {
        result: "String",
        name: "getGuid",
        parameters: [["String", "attr_name"]],
      },
      { result: "String", name: "getName", parameters: [] },
    ],
    name: "ConfigItem",
  },
  Ve = {
    parent: "Object",
    functions: [
      { result: "", name: "setData", parameters: [["String", "value"]] },
      { result: "String", name: "getData", parameters: [] },
      { result: "", name: "onDataChanged", parameters: [] },
      { result: "ConfigItem", name: "getParentItem", parameters: [] },
      { result: "String", name: "getAttributeName", parameters: [] },
    ],
    name: "ConfigAttribute",
  },
  O = {
    "593DBA22D0774976B952F4713655400B": Ne,
    D40302823AAB4d87878D12326FADFCD5: We,
    // "24DEC283B76E4a368CCC9E24C46B6C73": Ve,
    "24dec2834a36b76e249ecc8c736c6bc4": Ve,
  };
var C = p(p(p({}, v), L), O);
function h(e) {
  return B[He(e)];
}
var B = {};
Object.keys(C).forEach((e) => {
  B[e.toLowerCase()] = C[e];
});
var G = {};
Object.values(C).forEach((e) => {
  G[e.name] = e;
});
Object.values(B).forEach((e) => {
  let r = G[e.parent];
  if (r == null && e.parent !== "@{00000000-0000-0000-0000-000000000000}@")
    throw new Error(`Could not find parent class named ${e.parent}`);
  e.parentClass = r;
});
function He(e) {
  return e
    .replace(
      /(........)(....)(....)(..)(..)(..)(..)(..)(..)(..)(..)/,
      "$1$3$2$7$6$5$4$11$10$9$8"
    )
    .toLowerCase();
}
var y = q(require("path"));
function ze(e) {
  let r = e.getFilename();
  return y.default.dirname(r).split(y.default.sep).pop() === "makiClasses";
}
module.exports = function (e) {
  return ze(e)
    ? {
        ClassDeclaration(r) {
          let a = P(r);
          a == null
            ? e.report({
                node: r,
                message:
                  'Expected Maki class to declare a static property "GUID".',
              })
            : h(a) == null &&
              e.report({ node: r, message: "Invalid GUID value." });
        },
        MethodDefinition(r) {
          let n = r.parent.parent,
            i = r.key;
          if (i.type !== "Identifier") return;
          let k = i.name,
            D = P(n);
          if (D == null) return;
          let T = h(D);
          if (T == null) return;
          let c = T.functions.find((s) => s.name.toLowerCase() === k);
          if (c == null) return;
          let d = r.value.params,
            I = c.parameters,
            A = { start: r.value.body.loc.start, end: r.value.body.loc.start },
            x = c.result;
          if (x) {
            let s = M(x),
              l = R(r.value.returnType);
            if (l == null) {
              e.report({
                loc: A,
                message: `Missing return type for Maki method. Expected "${s}".`,
              });
              return;
            }
            if (l !== s) {
              e.report({
                loc: A,
                message: `Incorrect TypeScript return type for Maki method. Expected "${s}" but found "${l}".`,
              });
              return;
            }
          }
          if (d.length !== I.length) {
            e.report({
              node: r,
              message: `Incorrect arity for Maki method. Expected ${I.length} arguments but found ${d.length}.`,
            });
            return;
          }
          for (let [s, l] of d.entries()) {
            let [_, $e] = I[s],
              f = M(_),
              u = R(l.typeAnnotation);
            if (u == null) {
              e.report({
                node: l,
                message: "Maki argument missing type annotation.",
              });
              continue;
            }
            if (f != null && f !== u) {
              e.report({
                node: u,
                message: `Incorrect TypeScript type for Maki method argument. Expected "${f}" but found "${u}".`,
              });
              continue;
            }
          }
        },
      }
    : {};
};
function M(e) {
  switch (e.toLowerCase()) {
    case "int":
    case "double":
    case "float":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "guiobject":
      return "GuiObj";
    case "layout":
      return "Layout";
    case "container":
      return "Container";
    case "group":
      return "Group";
    case "wac":
      return "Wac";
    default:
      throw new Error(`Missing maki type: ${e}`);
  }
}
function P(e) {
  let r = e.body.body.find((i) => i.static);
  if (r == null) return null;
  let a = r.value;
  if (a.type !== "Literal") return null;
  let n = a.value;
  return typeof n != "string" ? null : n;
}
function R(e) {
  if (e == null) return null;
  let r = e.typeAnnotation;
  switch (r.type) {
    case "TSTypeReference":
      return r.typeName.name;
    case "TSNumberKeyword":
      return "number";
    case "TSStringKeyword":
      return "string";
    case "TSBooleanKeyword":
      return "boolean";
    default:
      return null;
  }
}
