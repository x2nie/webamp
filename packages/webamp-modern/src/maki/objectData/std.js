export default {
  "516549710D874a5191E3A6B53235F3E7": {
    parent: "@{00000000-0000-0000-0000-000000000000}@",
    functions: [
      {
        result: "String",
        name: "getClassName",
        parameters: [],
      },
      {
        result: "String",
        name: "getId",
        parameters: [],
      },
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
  D6F50F6493FA49b793F1BA66EFAE3E98: {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "onScriptLoaded",
        parameters: [],
      },
      {
        result: "",
        name: "onScriptUnloading",
        parameters: [],
      },
      {
        result: "",
        name: "onQuit",
        parameters: [],
      },
      {
        result: "",
        name: "onSetXuiParam",
        parameters: [
          ["String", "param"],
          ["String", "value"],
        ],
      },
      {
        result: "",
        name: "onKeyDown",
        parameters: [["String", "key"]],
      },
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
      {
        result: "",
        name: "onShowLayout",
        parameters: [["Layout", "_layout"]],
      },
      {
        result: "",
        name: "onHideLayout",
        parameters: [["Layout", "_layout"]],
      },
      {
        result: "",
        name: "onViewPortChanged",
        parameters: [
          ["int", "width"],
          ["int", "height"],
        ],
      },
      {
        result: "",
        name: "onStop",
        parameters: [],
      },
      {
        result: "",
        name: "onPlay",
        parameters: [],
      },
      {
        result: "",
        name: "onPause",
        parameters: [],
      },
      {
        result: "",
        name: "onResume",
        parameters: [],
      },
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
      {
        result: "",
        name: "onUrlChange",
        parameters: [["String", "url"]],
      },
      {
        result: "",
        name: "onInfoChange",
        parameters: [["String", "info"]],
      },
      {
        result: "",
        name: "onStatusMsg",
        parameters: [["String", "msg"]],
      },
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
      {
        result: "",
        name: "onEqChanged",
        parameters: [["int", "newstatus"]],
      },
      {
        result: "",
        name: "onEqFreqChanged",
        parameters: [["int", "isiso"]],
      },
      {
        result: "",
        name: "onVolumeChanged",
        parameters: [["int", "newvol"]],
      },
      {
        result: "",
        name: "onSeek",
        parameters: [["int", "newpos"]],
      },
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
      {
        result: "Int",
        name: "getNumContainers",
        parameters: [],
      },
      {
        result: "Container",
        name: "enumContainer",
        parameters: [["Int", "num"]],
      },
      {
        result: "String",
        name: "enumEmbedGUID",
        parameters: [["int", "num"]],
      },
      {
        result: "Wac",
        name: "getWac",
        parameters: [["String", "wac_guid"]],
      },
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
      {
        result: "String",
        name: "getPlayItemString",
        parameters: [],
      },
      {
        result: "Int",
        name: "getPlayItemLength",
        parameters: [],
      },
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
      {
        result: "String",
        name: "getPlayItemDisplayTitle",
        parameters: [],
      },
      {
        result: "Int",
        name: "getCurrentTrackRating",
        parameters: [],
      },
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
      {
        result: "",
        name: "playFile",
        parameters: [["String", "playitem"]],
      },
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
      {
        result: "String",
        name: "getDownloadPath",
        parameters: [],
      },
      {
        result: "",
        name: "setDownloadPath",
        parameters: [["String", "new_path"]],
      },
      {
        result: "",
        name: "enqueueFile",
        parameters: [["String", "playitem"]],
      },
      {
        result: "Int",
        name: "getLeftVuMeter",
        parameters: [],
      },
      {
        result: "Int",
        name: "getRightVuMeter",
        parameters: [],
      },
      {
        result: "Int",
        name: "getVolume",
        parameters: [],
      },
      {
        result: "",
        name: "setVolume",
        parameters: [["Int", "vol"]],
      },
      {
        result: "",
        name: "play",
        parameters: [],
      },
      {
        result: "",
        name: "stop",
        parameters: [],
      },
      {
        result: "",
        name: "pause",
        parameters: [],
      },
      {
        result: "",
        name: "next",
        parameters: [],
      },
      {
        result: "",
        name: "previous",
        parameters: [],
      },
      {
        result: "",
        name: "eject",
        parameters: [],
      },
      {
        result: "",
        name: "seekTo",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "getPosition",
        parameters: [],
      },
      {
        result: "",
        name: "setEqBand",
        parameters: [
          ["int", "band"],
          ["Int", "value"],
        ],
      },
      {
        result: "",
        name: "setEqPreamp",
        parameters: [["Int", "value"]],
      },
      {
        result: "",
        name: "setEq",
        parameters: [["Int", "onoff"]],
      },
      {
        result: "Int",
        name: "getEqBand",
        parameters: [["int", "band"]],
      },
      {
        result: "int",
        name: "getEqPreamp",
        parameters: [],
      },
      {
        result: "int",
        name: "getEq",
        parameters: [],
      },
      {
        result: "int",
        name: "getMousePosX",
        parameters: [],
      },
      {
        result: "int",
        name: "getMousePosY",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getDateYear",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateMonth",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateDay",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateDow",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateDoy",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateHour",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateMin",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateSec",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDateDst",
        parameters: [["Int", "datetime"]],
      },
      {
        result: "Int",
        name: "getDate",
        parameters: [],
      },
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
      {
        result: "int",
        name: "strlen",
        parameters: [["string", "str"]],
      },
      {
        result: "string",
        name: "strupper",
        parameters: [["string", "str"]],
      },
      {
        result: "string",
        name: "strlower",
        parameters: [["string", "str"]],
      },
      {
        result: "string",
        name: "urlEncode",
        parameters: [["string", "url"]],
      },
      {
        result: "string",
        name: "urlDecode",
        parameters: [["string", "url"]],
      },
      {
        result: "string",
        name: "parseATF",
        parameters: [["string", "topass"]],
      },
      {
        result: "string",
        name: "removePath",
        parameters: [["string", "str"]],
      },
      {
        result: "string",
        name: "getPath",
        parameters: [["string", "str"]],
      },
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
      {
        result: "double",
        name: "sin",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "cos",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "tan",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "asin",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "acos",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "atan",
        parameters: [["double", "value"]],
      },
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
      {
        result: "double",
        name: "sqr",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "log10",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "ln",
        parameters: [["double", "value"]],
      },
      {
        result: "double",
        name: "sqrt",
        parameters: [["double", "value"]],
      },
      {
        result: "int",
        name: "random",
        parameters: [["int", "max"]],
      },
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
      {
        result: "String",
        name: "getParam",
        parameters: [],
      },
      {
        result: "Group",
        name: "getScriptGroup",
        parameters: [],
      },
      {
        result: "Int",
        name: "getViewportWidth",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getMonitorWidth",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getViewportHeight",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getMonitorHeight",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getMonitorLeft",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getMonitorTop",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getViewportLeft",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getViewportTop",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getCurAppLeft",
        parameters: [],
      },
      {
        result: "Int",
        name: "getCurAppTop",
        parameters: [],
      },
      {
        result: "Int",
        name: "getCurAppWidth",
        parameters: [],
      },
      {
        result: "Int",
        name: "getCurAppHeight",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isAppActive",
        parameters: [],
      },
      {
        result: "String",
        name: "getSkinName",
        parameters: [],
      },
      {
        result: "",
        name: "switchSkin",
        parameters: [["String", "skinname"]],
      },
      {
        result: "Int",
        name: "isLoadingSkin",
        parameters: [],
      },
      {
        result: "",
        name: "lockUI",
        parameters: [],
      },
      {
        result: "",
        name: "unlockUI",
        parameters: [],
      },
      {
        result: "Browser",
        name: "getMainBrowser",
        parameters: [],
      },
      {
        result: "",
        name: "popMainBrowser",
        parameters: [],
      },
      {
        result: "",
        name: "navigateUrl",
        parameters: [["String", "url"]],
      },
      {
        result: "",
        name: "navigateUrlBrowser",
        parameters: [["String", "url"]],
      },
      {
        result: "Boolean",
        name: "onOpenURL",
        parameters: [["string", "url"]],
      },
      {
        result: "Boolean",
        name: "isObjectValid",
        parameters: [["Object", "o"]],
      },
      {
        result: "Int",
        name: "integer",
        parameters: [["Double", "d"]],
      },
      {
        result: "Double",
        name: "frac",
        parameters: [["Double", "d"]],
      },
      {
        result: "Int",
        name: "getTimeOfDay",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getStatus",
        parameters: [],
      },
      {
        result: "Int",
        name: "isKeyDown",
        parameters: [["int", "vk_code"]],
      },
      {
        result: "",
        name: "setClipboardText",
        parameters: [["String", "_text"]],
      },
      {
        result: "String",
        name: "Chr",
        parameters: [["Int", "charnum"]],
      },
      {
        result: "String",
        name: "translate",
        parameters: [["String", "str"]],
      },
      {
        result: "String",
        name: "getString",
        parameters: [
          ["String", "table"],
          ["int", "id"],
        ],
      },
      {
        result: "String",
        name: "getLanguageId",
        parameters: [],
      },
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
      {
        result: "",
        name: "systemMenu",
        parameters: [],
      },
      {
        result: "",
        name: "windowMenu",
        parameters: [],
      },
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
      {
        result: "",
        name: "hideWindow",
        parameters: [["GuiObject", "hw"]],
      },
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
      {
        result: "",
        name: "invokeDebugger",
        parameters: [],
      },
      {
        result: "int",
        name: "hasVideoSupport",
        parameters: [],
      },
      {
        result: "Int",
        name: "isVideo",
        parameters: [],
      },
      {
        result: "Int",
        name: "isVideoFullscreen",
        parameters: [],
      },
      {
        result: "Int",
        name: "getIdealVideoWidth",
        parameters: [],
      },
      {
        result: "Int",
        name: "getIdealVideoHeight",
        parameters: [],
      },
      {
        result: "Int",
        name: "isMinimized",
        parameters: [],
      },
      {
        result: "",
        name: "minimizeApplication",
        parameters: [],
      },
      {
        result: "",
        name: "restoreApplication",
        parameters: [],
      },
      {
        result: "",
        name: "activateApplication",
        parameters: [],
      },
      {
        result: "Int",
        name: "getPlaylistLength",
        parameters: [],
      },
      {
        result: "Int",
        name: "getPlaylistIndex",
        parameters: [],
      },
      {
        result: "",
        name: "clearPlaylist",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isDesktopAlphaAvailable",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isTransparencyAvailable",
        parameters: [],
      },
      {
        result: "Int",
        name: "onShowNotification",
        parameters: [],
      },
      {
        result: "String",
        name: "getSongInfoText",
        parameters: [],
      },
      {
        result: "String",
        name: "getSongInfoTextTranslated",
        parameters: [],
      },
      {
        result: "Int",
        name: "getVisBand",
        parameters: [
          ["int", "channel"],
          ["int", "band"],
        ],
      },
      {
        result: "Double",
        name: "getRuntimeVersion",
        parameters: [],
      },
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
      {
        result: "boolean",
        name: "isProVersion",
        parameters: [],
      },
      {
        result: "String",
        name: "getWinampVersion",
        parameters: [],
      },
      {
        result: "Int",
        name: "getBuildNumber",
        parameters: [],
      },
      {
        result: "int",
        name: "getFileSize",
        parameters: [["String", "fullfilename"]],
      },
    ],
    name: "System",
  },
  E90DC47B840D4ae7B02C040BD275F7FC: {
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
      {
        result: "",
        name: "onHideLayout",
        parameters: [["Layout", "_layout"]],
      },
      {
        result: "",
        name: "onShowLayout",
        parameters: [["Layout", "_layout"]],
      },
      {
        result: "Layout",
        name: "getLayout",
        parameters: [["String", "layout_id"]],
      },
      {
        result: "Int",
        name: "getNumLayouts",
        parameters: [],
      },
      {
        result: "Layout",
        name: "enumLayout",
        parameters: [["Int", "num"]],
      },
      {
        result: "",
        name: "switchToLayout",
        parameters: [["String", "layout_id"]],
      },
      {
        result: "",
        name: "show",
        parameters: [],
      },
      {
        result: "",
        name: "hide",
        parameters: [],
      },
      {
        result: "",
        name: "close",
        parameters: [],
      },
      {
        result: "",
        name: "toggle",
        parameters: [],
      },
      {
        result: "Int",
        name: "isDynamic",
        parameters: [],
      },
      {
        result: "",
        name: "setName",
        parameters: [["String", "name"]],
      },
      {
        result: "String",
        name: "getName",
        parameters: [],
      },
      {
        result: "String",
        name: "getGuid",
        parameters: [],
      },
      {
        result: "Layout",
        name: "getCurLayout",
        parameters: [],
      },
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
  "00C074A0FEA249a0BE8DFABBDB161640": {
    parent: "Object",
    functions: [
      {
        result: "String",
        name: "getGuid",
        parameters: [],
      },
      {
        result: "String",
        name: "getName",
        parameters: [],
      },
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
      {
        result: "",
        name: "show",
        parameters: [],
      },
      {
        result: "",
        name: "hide",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isVisible",
        parameters: [],
      },
      {
        result: "",
        name: "onNotify",
        parameters: [
          ["String", "notifstr"],
          ["Int", "a"],
          ["Int", "b"],
        ],
      },
      {
        result: "",
        name: "onShow",
        parameters: [],
      },
      {
        result: "",
        name: "onHide",
        parameters: [],
      },
      {
        result: "",
        name: "setStatusBar",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "getStatusBar",
        parameters: [],
      },
    ],
    name: "Wac",
  },
  B2023AB5434D4ba1BEAE59637503F3C6: {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "addItem",
        parameters: [["Any", "_object"]],
      },
      {
        result: "",
        name: "removeItem",
        parameters: [["int", "pos"]],
      },
      {
        result: "Any",
        name: "enumItem",
        parameters: [["int", "pos"]],
      },
      {
        result: "Int",
        name: "findItem",
        parameters: [["Any", "_object"]],
      },
      {
        result: "Int",
        name: "findItem2",
        parameters: [
          ["Any", "_object"],
          ["int", "startItem"],
        ],
      },
      {
        result: "int",
        name: "getNumItems",
        parameters: [],
      },
      {
        result: "",
        name: "removeAll",
        parameters: [],
      },
    ],
    name: "List",
  },
  "87C65778E74349fe85F909CC532AFD56": {
    parent: "Object",
    functions: [
      {
        result: "boolean",
        name: "getItem",
        parameters: [["int", "n"]],
      },
      {
        result: "",
        name: "setItem",
        parameters: [
          ["int", "n"],
          ["boolean", "val"],
        ],
      },
      {
        result: "",
        name: "setSize",
        parameters: [["int", "s"]],
      },
      {
        result: "int",
        name: "getSize",
        parameters: [],
      },
    ],
    name: "BitList",
  },
  "38603665461B42a7AA75D83F6667BF73": {
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
      {
        result: "",
        name: "loadMap",
        parameters: [["String", "bitmapid"]],
      },
      {
        result: "Int",
        name: "getWidth",
        parameters: [],
      },
      {
        result: "Int",
        name: "getHeight",
        parameters: [],
      },
      {
        result: "Region",
        name: "getRegion",
        parameters: [],
      },
    ],
    name: "Map",
  },
  F4787AF4B2BB4ef79CFBE74BA9BEA88D: {
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
      {
        result: "",
        name: "addSeparator",
        parameters: [],
      },
      {
        result: "Int",
        name: "popAtXY",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "Int",
        name: "popAtMouse",
        parameters: [],
      },
      {
        result: "Int",
        name: "getNumCommands",
        parameters: [],
      },
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
  "3A370C023CBF439f84F186885BCF1E36": {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "add",
        parameters: [["Region", "reg"]],
      },
      {
        result: "",
        name: "sub",
        parameters: [["Region", "reg"]],
      },
      {
        result: "",
        name: "offset",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "stretch",
        parameters: [["double", "r"]],
      },
      {
        result: "",
        name: "copy",
        parameters: [["Region", "reg"]],
      },
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
      {
        result: "Int",
        name: "getBoundingBoxX",
        parameters: [],
      },
      {
        result: "Int",
        name: "getBoundingBoxY",
        parameters: [],
      },
      {
        result: "Int",
        name: "getBoundingBoxW",
        parameters: [],
      },
      {
        result: "Int",
        name: "getBoundingBoxH",
        parameters: [],
      },
    ],
    name: "Region",
  },
  "5D0C5BB67DE14b1fA70F8D1659941941": {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "onTimer",
        parameters: [],
      },
      {
        result: "",
        name: "setDelay",
        parameters: [["int", "millisec"]],
      },
      {
        result: "Int",
        name: "getDelay",
        parameters: [],
      },
      {
        result: "",
        name: "start",
        parameters: [],
      },
      {
        result: "",
        name: "stop",
        parameters: [],
      },
      {
        result: "",
        name: "isRunning",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSkipped",
        parameters: [],
      },
    ],
    name: "Timer",
  },
  A5376FA14E94411a83F605EC5EEA5F0A: {
    parent: "Object",
    functions: [
      {
        result: "Int",
        name: "setFeed",
        parameters: [["String", "feed_id"]],
      },
      {
        result: "",
        name: "releaseFeed",
        parameters: [],
      },
      {
        result: "",
        name: "onFeedChange",
        parameters: [["String", "new_feeddata"]],
      },
    ],
    name: "FeedWatcher",
  },
  "4EE3E199C6364bec97CD78BC9C8628B0": {
    parent: "Object",
    functions: [
      {
        result: "",
        name: "show",
        parameters: [],
      },
      {
        result: "",
        name: "hide",
        parameters: [],
      },
      {
        result: "int",
        name: "isVisible",
        parameters: [],
      },
      {
        result: "",
        name: "onSetVisible",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "",
        name: "setAlpha",
        parameters: [["int", "alpha"]],
      },
      {
        result: "int",
        name: "getAlpha",
        parameters: [],
      },
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
      {
        result: "",
        name: "onEnterArea",
        parameters: [],
      },
      {
        result: "",
        name: "onLeaveArea",
        parameters: [],
      },
      {
        result: "",
        name: "setEnabled",
        parameters: [["boolean", "onoff"]],
      },
      {
        result: "boolean",
        name: "getEnabled",
        parameters: [],
      },
      {
        result: "",
        name: "onEnable",
        parameters: [["boolean", "onoff"]],
      },
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
      {
        result: "int",
        name: "getLeft",
        parameters: [],
      },
      {
        result: "int",
        name: "getTop",
        parameters: [],
      },
      {
        result: "int",
        name: "getWidth",
        parameters: [],
      },
      {
        result: "int",
        name: "getHeight",
        parameters: [],
      },
      {
        result: "",
        name: "setTargetX",
        parameters: [["int", "x"]],
      },
      {
        result: "",
        name: "setTargetY",
        parameters: [["int", "y"]],
      },
      {
        result: "",
        name: "setTargetW",
        parameters: [["int", "w"]],
      },
      {
        result: "",
        name: "setTargetH",
        parameters: [["int", "r"]],
      },
      {
        result: "",
        name: "setTargetA",
        parameters: [["int", "alpha"]],
      },
      {
        result: "",
        name: "setTargetSpeed",
        parameters: [["float", "insecond"]],
      },
      {
        result: "",
        name: "gotoTarget",
        parameters: [],
      },
      {
        result: "",
        name: "onTargetReached",
        parameters: [],
      },
      {
        result: "",
        name: "cancelTarget",
        parameters: [],
      },
      {
        result: "",
        name: "reverseTarget",
        parameters: [["int", "reverse"]],
      },
      {
        result: "",
        name: "onStartup",
        parameters: [],
      },
      {
        result: "boolean",
        name: "isGoingToTarget",
        parameters: [],
      },
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
      {
        result: "",
        name: "init",
        parameters: [["Group", "parent"]],
      },
      {
        result: "",
        name: "bringToFront",
        parameters: [],
      },
      {
        result: "",
        name: "bringToBack",
        parameters: [],
      },
      {
        result: "",
        name: "bringAbove",
        parameters: [["GuiObject", "guiobj"]],
      },
      {
        result: "",
        name: "bringBelow",
        parameters: [["GuiObject", "guiobj"]],
      },
      {
        result: "Int",
        name: "getGuiX",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiY",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiW",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiH",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiRelatX",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiRelatY",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiRelatW",
        parameters: [],
      },
      {
        result: "Int",
        name: "getGuiRelatH",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isActive",
        parameters: [],
      },
      {
        result: "GuiObject",
        name: "getParent",
        parameters: [],
      },
      {
        result: "Layout",
        name: "getParentLayout",
        parameters: [],
      },
      {
        result: "GuiObject",
        name: "getTopParent",
        parameters: [],
      },
      {
        result: "int",
        name: "runModal",
        parameters: [],
      },
      {
        result: "",
        name: "endModal",
        parameters: [["int", "retcode"]],
      },
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
      {
        result: "String",
        name: "getName",
        parameters: [],
      },
      {
        result: "int",
        name: "clientToScreenX",
        parameters: [["int", "x"]],
      },
      {
        result: "int",
        name: "clientToScreenY",
        parameters: [["int", "y"]],
      },
      {
        result: "int",
        name: "clientToScreenW",
        parameters: [["int", "w"]],
      },
      {
        result: "int",
        name: "clientToScreenH",
        parameters: [["int", "h"]],
      },
      {
        result: "int",
        name: "screenToClientX",
        parameters: [["int", "x"]],
      },
      {
        result: "int",
        name: "screenToClientY",
        parameters: [["int", "y"]],
      },
      {
        result: "int",
        name: "screenToClientW",
        parameters: [["int", "w"]],
      },
      {
        result: "int",
        name: "screenToClientH",
        parameters: [["int", "h"]],
      },
      {
        result: "int",
        name: "getAutoWidth",
        parameters: [],
      },
      {
        result: "int",
        name: "getAutoHeight",
        parameters: [],
      },
      {
        result: "",
        name: "setFocus",
        parameters: [],
      },
      {
        result: "",
        name: "onChar",
        parameters: [["String", "c"]],
      },
      {
        result: "",
        name: "onAccelerator",
        parameters: [["String", "accel"]],
      },
      {
        result: "Boolean",
        name: "isMouseOverRect",
        parameters: [],
      },
      {
        result: "Object",
        name: "getInterface",
        parameters: [["String", "interface_guid"]],
      },
      {
        result: "",
        name: "onDragEnter",
        parameters: [],
      },
      {
        result: "",
        name: "onDragOver",
        parameters: [
          ["int", "x"],
          ["int", "y"],
        ],
      },
      {
        result: "",
        name: "onDragLeave",
        parameters: [],
      },
      {
        result: "",
        name: "onKeyDown",
        parameters: [["int", "vk_code"]],
      },
      {
        result: "",
        name: "onKeyUp",
        parameters: [["int", "vk_code"]],
      },
      {
        result: "",
        name: "onGetFocus",
        parameters: [],
      },
      {
        result: "",
        name: "onKillFocus",
        parameters: [],
      },
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
  "45BE95E520724191935CBB5FF9F117FD": {
    parent: "GuiObject",
    functions: [
      {
        result: "GuiObject",
        name: "getObject",
        parameters: [["String", "object_id"]],
      },
      {
        result: "Int",
        name: "getNumObjects",
        parameters: [],
      },
      {
        result: "GuiObject",
        name: "enumObject",
        parameters: [["Int", "num"]],
      },
      {
        result: "",
        name: "onCreateObject",
        parameters: [["GuiObject", "newobj"]],
      },
      {
        result: "Int",
        name: "getMousePosX",
        parameters: [],
      },
      {
        result: "Int",
        name: "getMousePosY",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isLayout",
        parameters: [],
      },
    ],
    name: "Group",
  },
  "60906D4E537E482eB004CC9461885672": {
    parent: "Group",
    functions: [
      {
        result: "",
        name: "onDock",
        parameters: [["int", "side"]],
      },
      {
        result: "",
        name: "onUndock",
        parameters: [],
      },
      {
        result: "",
        name: "onScale",
        parameters: [["Double", "newscalevalue"]],
      },
      {
        result: "Double",
        name: "getScale",
        parameters: [],
      },
      {
        result: "",
        name: "setScale",
        parameters: [["Double", "scalevalue"]],
      },
      {
        result: "",
        name: "setDesktopAlpha",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "getDesktopAlpha",
        parameters: [],
      },
      {
        result: "Container",
        name: "getContainer",
        parameters: [],
      },
      {
        result: "",
        name: "center",
        parameters: [],
      },
      {
        result: "",
        name: "onMove",
        parameters: [],
      },
      {
        result: "",
        name: "onEndMove",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "getSnapAdjustTop",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSnapAdjustRight",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSnapAdjustLeft",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSnapAdjustBottom",
        parameters: [],
      },
      {
        result: "",
        name: "setRedrawOnResize",
        parameters: [["int", "wantredrawonresize"]],
      },
      {
        result: "",
        name: "beforeRedock",
        parameters: [],
      },
      {
        result: "",
        name: "redock",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isTransparencySafe",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isLayoutAnimationSafe",
        parameters: [],
      },
      {
        result: "",
        name: "onMouseEnterLayout",
        parameters: [],
      },
      {
        result: "",
        name: "onMouseLeaveLayout",
        parameters: [],
      },
      {
        result: "",
        name: "onSnapAdjustChanged",
        parameters: [],
      },
    ],
    name: "Layout",
  },
  "403ABCC06F224bd68BA410C829932547": {
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
      {
        result: "",
        name: "setRegion",
        parameters: [["Region", "reg"]],
      },
      {
        result: "GuiObject",
        name: "getContent",
        parameters: [],
      },
      {
        result: "String",
        name: "getGuid",
        parameters: [],
      },
      {
        result: "String",
        name: "getComponentName",
        parameters: [],
      },
      {
        result: "",
        name: "onGetWac",
        parameters: [["Wac", "wacobj"]],
      },
      {
        result: "",
        name: "onGiveUpWac",
        parameters: [["Wac", "wacobj"]],
      },
      {
        result: "Wac",
        name: "getWac",
        parameters: [],
      },
      {
        result: "",
        name: "setAcceptWac",
        parameters: [["Boolean", "onoff"]],
      },
    ],
    name: "WindowHolder",
  },
  "97AA3E4DF4D04fa8817B0AF22A454983": {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "getMaxHeight",
        parameters: [],
      },
      {
        result: "Int",
        name: "getMaxWidth",
        parameters: [],
      },
      {
        result: "Int",
        name: "setScroll",
        parameters: [["int", "x"]],
      },
      {
        result: "Int",
        name: "getScroll",
        parameters: [],
      },
      {
        result: "Int",
        name: "getNumChildren",
        parameters: [],
      },
      {
        result: "GuiObject",
        name: "enumChildren",
        parameters: [["int", "n"]],
      },
    ],
    name: "ComponentBucket",
  },
  "64E4BBFA81F449d9B0C0A85B2EC3BCFD": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onEnter",
        parameters: [],
      },
      {
        result: "",
        name: "onAbort",
        parameters: [],
      },
      {
        result: "",
        name: "onIdleEditUpdate",
        parameters: [],
      },
      {
        result: "",
        name: "onEditUpdate",
        parameters: [],
      },
      {
        result: "",
        name: "setText",
        parameters: [["String", "txt"]],
      },
      {
        result: "",
        name: "setAutoEnter",
        parameters: [["boolean", "onoff"]],
      },
      {
        result: "Int",
        name: "getAutoEnter",
        parameters: [],
      },
      {
        result: "String",
        name: "getText",
        parameters: [],
      },
      {
        result: "",
        name: "selectAll",
        parameters: [],
      },
      {
        result: "",
        name: "enter",
        parameters: [],
      },
      {
        result: "",
        name: "setIdleEnabled",
        parameters: [["boolean", "onoff"]],
      },
      {
        result: "Int",
        name: "getIdleEnabled",
        parameters: [],
      },
    ],
    name: "Edit",
  },
  "62B65E3F375E408d8DEA76814AB91B77": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onSetPosition",
        parameters: [["int", "newpos"]],
      },
      {
        result: "",
        name: "onPostedPosition",
        parameters: [["int", "newpos"]],
      },
      {
        result: "",
        name: "onSetFinalPosition",
        parameters: [["int", "pos"]],
      },
      {
        result: "",
        name: "setPosition",
        parameters: [["int", "pos"]],
      },
      {
        result: "Int",
        name: "getPosition",
        parameters: [],
      },
      {
        result: "",
        name: "lock",
        parameters: [],
      },
      {
        result: "",
        name: "unlock",
        parameters: [],
      },
    ],
    name: "Slider",
  },
  CE4F97BE77B04e199956D49833C96C27: {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onFrame",
        parameters: [],
      },
      {
        result: "",
        name: "setRealtime",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "getRealtime",
        parameters: [],
      },
      {
        result: "Int",
        name: "getMode",
        parameters: [],
      },
      {
        result: "",
        name: "setMode",
        parameters: [["Int", "mode"]],
      },
      {
        result: "",
        name: "nextMode",
        parameters: [],
      },
    ],
    name: "Vis",
  },
  A8C2200D51EB4b2aBA7F5D4BC65D4C71: {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "navigateUrl",
        parameters: [["String", "url"]],
      },
      {
        result: "",
        name: "back",
        parameters: [],
      },
      {
        result: "",
        name: "forward",
        parameters: [],
      },
      {
        result: "",
        name: "stop",
        parameters: [],
      },
      {
        result: "",
        name: "refresh",
        parameters: [],
      },
      {
        result: "",
        name: "home",
        parameters: [],
      },
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
      {
        result: "",
        name: "onDocumentReady",
        parameters: [["String", "url"]],
      },
      {
        result: "String",
        name: "getDocumentTitle",
        parameters: [],
      },
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
      {
        result: "",
        name: "scrape",
        parameters: [],
      },
      {
        result: "string",
        name: "onMediaLink",
        parameters: [["string", "url"]],
      },
    ],
    name: "Browser",
  },
  "8D1EBA38489E483eB9608D1F43C5C405": {
    parent: "GuiObject",
    functions: [],
    name: "EqVis",
  },
  "0F08C940AF394b2380F3B8C48F7EBB59": {
    parent: "GuiObject",
    functions: [],
    name: "Status",
  },
  EFAA8672310E41faB7DC85A9525BCB4B: {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "setText",
        parameters: [["String", "txt"]],
      },
      {
        result: "",
        name: "setAlternateText",
        parameters: [["String", "txt"]],
      },
      {
        result: "String",
        name: "getText",
        parameters: [],
      },
      {
        result: "int",
        name: "getTextWidth",
        parameters: [],
      },
      {
        result: "",
        name: "onTextChanged",
        parameters: [["String", "newtxt"]],
      },
    ],
    name: "Text",
  },
  "7DFD324437514e7cBF4082AE5F3ADC33": {
    parent: "GuiObject",
    functions: [],
    name: "Title",
  },
  "5AB9FA159A7D4557ABC86557A6C67CA9": {
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
      {
        result: "",
        name: "fx_onInit",
        parameters: [],
      },
      {
        result: "",
        name: "fx_onFrame",
        parameters: [],
      },
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
      {
        result: "",
        name: "setRegion",
        parameters: [["Region", "reg"]],
      },
      {
        result: "",
        name: "fx_setEnabled",
        parameters: [["boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getEnabled",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setWrap",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getWrap",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setRect",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getRect",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setBgFx",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getBgFx",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setClear",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getClear",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setSpeed",
        parameters: [["Int", "msperframe"]],
      },
      {
        result: "Int",
        name: "fx_getSpeed",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setRealtime",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getRealtime",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setLocalized",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getLocalized",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setBilinear",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getBilinear",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setAlphaMode",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "fx_getAlphaMode",
        parameters: [],
      },
      {
        result: "",
        name: "fx_setGridSize",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      {
        result: "",
        name: "fx_update",
        parameters: [],
      },
      {
        result: "",
        name: "fx_restart",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isInvalid",
        parameters: [],
      },
    ],
    name: "Layer",
  },
  "698EDDCD8F1E4fec9B12F944F909FF45": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onActivate",
        parameters: [["int", "activated"]],
      },
      {
        result: "",
        name: "onLeftClick",
        parameters: [],
      },
      {
        result: "",
        name: "onRightClick",
        parameters: [],
      },
      {
        result: "",
        name: "setActivated",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "",
        name: "setActivatedNoCallback",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "Boolean",
        name: "getActivated",
        parameters: [],
      },
      {
        result: "",
        name: "leftClick",
        parameters: [],
      },
      {
        result: "",
        name: "rightClick",
        parameters: [],
      },
    ],
    name: "Button",
  },
  "6B64CD275A264c4b8C59E6A70CF6493A": {
    parent: "Layer",
    functions: [
      {
        result: "",
        name: "onPlay",
        parameters: [],
      },
      {
        result: "",
        name: "onPause",
        parameters: [],
      },
      {
        result: "",
        name: "onResume",
        parameters: [],
      },
      {
        result: "",
        name: "onStop",
        parameters: [],
      },
      {
        result: "",
        name: "onFrame",
        parameters: [["Int", "framenum"]],
      },
      {
        result: "",
        name: "setSpeed",
        parameters: [["Int", "msperframe"]],
      },
      {
        result: "",
        name: "gotoFrame",
        parameters: [["int", "framenum"]],
      },
      {
        result: "",
        name: "setStartFrame",
        parameters: [["Int", "framenum"]],
      },
      {
        result: "",
        name: "setEndFrame",
        parameters: [["int", "framenum"]],
      },
      {
        result: "",
        name: "setAutoReplay",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "",
        name: "play",
        parameters: [],
      },
      {
        result: "",
        name: "stop",
        parameters: [],
      },
      {
        result: "",
        name: "pause",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isPlaying",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isPaused",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "isStopped",
        parameters: [],
      },
      {
        result: "Int",
        name: "getStartFrame",
        parameters: [],
      },
      {
        result: "Int",
        name: "getEndFrame",
        parameters: [],
      },
      {
        result: "Int",
        name: "getLength",
        parameters: [],
      },
      {
        result: "Int",
        name: "getDirection",
        parameters: [],
      },
      {
        result: "Boolean",
        name: "getAutoReplay",
        parameters: [],
      },
      {
        result: "Int",
        name: "getCurFrame",
        parameters: [],
      },
      {
        result: "",
        name: "setRealtime",
        parameters: [["Boolean", "onoff"]],
      },
    ],
    name: "AnimatedLayer",
  },
  "6DCB05E48AC448c2B19349F0910EF54A": {
    parent: "Layer",
    functions: [
      {
        result: "",
        name: "refresh",
        parameters: [],
      },
      {
        result: "",
        name: "isLoading",
        parameters: [],
      },
      {
        result: "",
        name: "onAlbumArtLoaded",
        parameters: [["boolean", "success"]],
      },
    ],
    name: "AlbumArtLayer",
  },
  B4DCCFFF81FE4bcc961B720FD5BE0FFF: {
    parent: "Button",
    functions: [
      {
        result: "",
        name: "onToggle",
        parameters: [["Boolean", "onoff"]],
      },
      {
        result: "int",
        name: "getCurCfgVal",
        parameters: [],
      },
    ],
    name: "ToggleButton",
  },
  "01E28CE1B05911d5979FE4DE6F51760A": {
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
      {
        result: "Int",
        name: "getNumItems",
        parameters: [],
      },
      {
        result: "Group",
        name: "enumItem",
        parameters: [["int", "num"]],
      },
      {
        result: "",
        name: "removeAll",
        parameters: [],
      },
      {
        result: "",
        name: "scrollToPercent",
        parameters: [["Int", "percent"]],
      },
      {
        result: "",
        name: "setRedraw",
        parameters: [["int", "redraw"]],
      },
    ],
    name: "GroupList",
  },
  "80F0F8BD1BA542a6A0933236A00C8D4A": {
    parent: "Group",
    functions: [
      {
        result: "Int",
        name: "cfgGetInt",
        parameters: [],
      },
      {
        result: "",
        name: "cfgSetInt",
        parameters: [["Int", "intvalue"]],
      },
      {
        result: "String",
        name: "cfgGetString",
        parameters: [],
      },
      {
        result: "Float",
        name: "cfgGetFloat",
        parameters: [],
      },
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
      {
        result: "",
        name: "onCfgChanged",
        parameters: [],
      },
      {
        result: "String",
        name: "cfgGetGuid",
        parameters: [],
      },
      {
        result: "String",
        name: "cfgGetName",
        parameters: [],
      },
    ],
    name: "CfgGroup",
  },
  CDCB785D81F242538F0561B872283CFA: {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onResetQuery",
        parameters: [],
      },
    ],
    name: "QueryList",
  },
  "9B2E341B6C9840fa8B850C1B6EE89405": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "setRedirection",
        parameters: [["GuiObject", "o"]],
      },
      {
        result: "GuiObject",
        name: "getRedirection",
        parameters: [],
      },
      {
        result: "",
        name: "setRegionFromMap",
        parameters: [
          ["Map", "regionmap"],
          ["Int", "threshold"],
          ["Boolean", "reverse"],
        ],
      },
      {
        result: "",
        name: "setRegion",
        parameters: [["Region", "reg"]],
      },
    ],
    name: "MouseRedir",
  },
  "36D59B7103FD4af897950502B7DB267A": {
    parent: "GuiObject",
    functions: [
      {
        result: "String",
        name: "getItemSelected",
        parameters: [],
      },
      {
        result: "",
        name: "onSelect",
        parameters: [
          ["Int", "id"],
          ["Int", "hover"],
        ],
      },
      {
        result: "",
        name: "setListHeight",
        parameters: [["Int", "h"]],
      },
      {
        result: "",
        name: "openList",
        parameters: [],
      },
      {
        result: "",
        name: "closeList",
        parameters: [],
      },
      {
        result: "",
        name: "setItems",
        parameters: [["String", "lotsofitems"]],
      },
      {
        result: "Int",
        name: "addItem",
        parameters: [["String", "_text"]],
      },
      {
        result: "",
        name: "delItem",
        parameters: [["Int", "id"]],
      },
      {
        result: "Int",
        name: "findItem",
        parameters: [["String", "_text"]],
      },
      {
        result: "Int",
        name: "getNumItems",
        parameters: [],
      },
      {
        result: "",
        name: "selectItem",
        parameters: [
          ["Int", "id"],
          ["Int", "hover"],
        ],
      },
      {
        result: "String",
        name: "getItemText",
        parameters: [["Int", "id"]],
      },
      {
        result: "Int",
        name: "getSelected",
        parameters: [],
      },
      {
        result: "String",
        name: "getSelectedText",
        parameters: [],
      },
      {
        result: "String",
        name: "getCustomText",
        parameters: [],
      },
      {
        result: "",
        name: "deleteAllItems",
        parameters: [],
      },
      {
        result: "",
        name: "setNoItemText",
        parameters: [["String", "txt"]],
      },
    ],
    name: "DropDownList",
  },
  "7FD5F210ACC448dfA6A05451576CDC76": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "callme",
        parameters: [["String", "str"]],
      },
    ],
    name: "LayoutStatus",
  },
  B5BAA53505B34dcbADC1E618D28F6896: {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "getCurPage",
        parameters: [],
      },
      {
        result: "",
        name: "setCurPage",
        parameters: [["Int", "a"]],
      },
    ],
    name: "TabSheet",
  },
  "6129FEC1DAB74d51916501CA0C1B70DB": {
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
      {
        result: "Int",
        name: "getNumColumns",
        parameters: [],
      },
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
      {
        result: "",
        name: "invalidateColumns",
        parameters: [],
      },
      {
        result: "Int",
        name: "getNumItems",
        parameters: [],
      },
      {
        result: "Int",
        name: "getItemCount",
        parameters: [],
      },
      {
        result: "Int",
        name: "addItem",
        parameters: [["String", "label"]],
      },
      {
        result: "Int",
        name: "insertItem",
        parameters: [
          ["Int", "pos"],
          ["String", "label"],
        ],
      },
      {
        result: "Int",
        name: "getLastAddedItemPos",
        parameters: [],
      },
      {
        result: "",
        name: "setSubItem",
        parameters: [
          ["Int", "pos"],
          ["Int", "subpos"],
          ["String", "txt"],
        ],
      },
      {
        result: "",
        name: "deleteAllItems",
        parameters: [],
      },
      {
        result: "Int",
        name: "deleteByPos",
        parameters: [["Int", "pos"]],
      },
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
      {
        result: "Int",
        name: "invalidateItem",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "getFirstItemVisible",
        parameters: [],
      },
      {
        result: "Int",
        name: "getLastItemVisible",
        parameters: [],
      },
      {
        result: "",
        name: "setItemIcon",
        parameters: [
          ["Int", "pos"],
          ["String", "bitmapId"],
        ],
      },
      {
        result: "String",
        name: "getItemIcon",
        parameters: [["Int", "pos"]],
      },
      {
        result: "",
        name: "setMinimumSize",
        parameters: [["Int", "size"]],
      },
      {
        result: "Int",
        name: "getWantAutoDeselect",
        parameters: [],
      },
      {
        result: "",
        name: "setWantAutoDeselect",
        parameters: [["Int", "want"]],
      },
      {
        result: "",
        name: "onSetVisible",
        parameters: [["Int", "show"]],
      },
      {
        result: "",
        name: "setAutoSort",
        parameters: [["Int", "dosort"]],
      },
      {
        result: "Int",
        name: "setFontSize",
        parameters: [["Int", "size"]],
      },
      {
        result: "Int",
        name: "getFontSize",
        parameters: [],
      },
      {
        result: "Int",
        name: "getHeaderHeight",
        parameters: [],
      },
      {
        result: "Int",
        name: "getPreventMultipleSelection",
        parameters: [],
      },
      {
        result: "Int",
        name: "setPreventMultipleSelection",
        parameters: [["Int", "val"]],
      },
      {
        result: "",
        name: "setShowIcons",
        parameters: [["int", "showThem"]],
      },
      {
        result: "Int",
        name: "getShowIcons",
        parameters: [],
      },
      {
        result: "Int",
        name: "setIconWidth",
        parameters: [["int", "width"]],
      },
      {
        result: "Int",
        name: "setIconHeight",
        parameters: [["int", "width"]],
      },
      {
        result: "",
        name: "getIconWidth",
        parameters: [],
      },
      {
        result: "",
        name: "getIconHeight",
        parameters: [],
      },
      {
        result: "",
        name: "next",
        parameters: [],
      },
      {
        result: "",
        name: "previous",
        parameters: [],
      },
      {
        result: "",
        name: "pagedown",
        parameters: [],
      },
      {
        result: "",
        name: "pageup",
        parameters: [],
      },
      {
        result: "",
        name: "home",
        parameters: [],
      },
      {
        result: "",
        name: "end",
        parameters: [],
      },
      {
        result: "",
        name: "reset",
        parameters: [],
      },
      {
        result: "",
        name: "ensureItemVisible",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "scrollAbsolute",
        parameters: [["Int", "x"]],
      },
      {
        result: "Int",
        name: "scrollRelative",
        parameters: [["Int", "x"]],
      },
      {
        result: "",
        name: "scrollLeft",
        parameters: [["Int", "lines"]],
      },
      {
        result: "",
        name: "scrollRight",
        parameters: [["Int", "lines"]],
      },
      {
        result: "",
        name: "scrollUp",
        parameters: [["Int", "lines"]],
      },
      {
        result: "",
        name: "scrollDown",
        parameters: [["Int", "lines"]],
      },
      {
        result: "",
        name: "jumpToNext",
        parameters: [["Int", "c"]],
      },
      {
        result: "",
        name: "scrollToItem",
        parameters: [["Int", "pos"]],
      },
      {
        result: "",
        name: "selectCurrent",
        parameters: [],
      },
      {
        result: "",
        name: "selectFirstEntry",
        parameters: [],
      },
      {
        result: "Int",
        name: "getItemSelected",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "isItemFocused",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "getItemFocused",
        parameters: [],
      },
      {
        result: "",
        name: "setItemFocused",
        parameters: [["Int", "pos"]],
      },
      {
        result: "Int",
        name: "getFirstItemSelected",
        parameters: [],
      },
      {
        result: "Int",
        name: "getNextItemSelected",
        parameters: [["Int", "lastpos"]],
      },
      {
        result: "Int",
        name: "selectAll",
        parameters: [],
      },
      {
        result: "Int",
        name: "deselectAll",
        parameters: [],
      },
      {
        result: "Int",
        name: "invertSelection",
        parameters: [],
      },
      {
        result: "",
        name: "setSelectionStart",
        parameters: [["Int", "pos"]],
      },
      {
        result: "",
        name: "setSelectionEnd",
        parameters: [["Int", "pos"]],
      },
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
      {
        result: "",
        name: "resort",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSortDirection",
        parameters: [],
      },
      {
        result: "Int",
        name: "getSortColumn",
        parameters: [],
      },
      {
        result: "",
        name: "setSortColumn",
        parameters: [["Int", "col"]],
      },
      {
        result: "",
        name: "setSortDirection",
        parameters: [["Int", "dir"]],
      },
      {
        result: "",
        name: "moveItem",
        parameters: [
          ["Int", "from"],
          ["Int", "to"],
        ],
      },
      {
        result: "",
        name: "onSelectAll",
        parameters: [],
      },
      {
        result: "",
        name: "onDelete",
        parameters: [],
      },
      {
        result: "",
        name: "onDoubleClick",
        parameters: [["Int", "itemnum"]],
      },
      {
        result: "",
        name: "onLeftClick",
        parameters: [["Int", "itemnum"]],
      },
      {
        result: "",
        name: "onSecondLeftClick",
        parameters: [["Int", "itemnum"]],
      },
      {
        result: "Int",
        name: "onRightClick",
        parameters: [["Int", "itemnum"]],
      },
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
  D59514F7ED3645e8980F3F4EA0522CD9: {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "onWantAutoContextMenu",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "onChar",
        parameters: [["Int", "c"]],
      },
      {
        result: "",
        name: "onItemRecvDrop",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "onLabelChange",
        parameters: [["TreeItem", "item"]],
      },
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
      {
        result: "Int",
        name: "getNumRootItems",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "enumRootItem",
        parameters: [["Int", "which"]],
      },
      {
        result: "",
        name: "jumpToNext",
        parameters: [["Int", "c"]],
      },
      {
        result: "",
        name: "ensureItemVisible",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "Int",
        name: "getContentsWidth",
        parameters: [],
      },
      {
        result: "Int",
        name: "getContentsHeight",
        parameters: [],
      },
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
      {
        result: "",
        name: "deleteAllItems",
        parameters: [],
      },
      {
        result: "Int",
        name: "expandItem",
        parameters: [["TreeItem", "item"]],
      },
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
      {
        result: "",
        name: "selectItem",
        parameters: [["TreeItem", "item"]],
      },
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
      {
        result: "",
        name: "hiliteItem",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "unhiliteItem",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "TreeItem",
        name: "getCurItem",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "hitTest",
        parameters: [
          ["Int", "x"],
          ["Int", "y"],
        ],
      },
      {
        result: "",
        name: "editItemLabel",
        parameters: [["TreeItem", "item"]],
      },
      {
        result: "",
        name: "cancelEditLabel",
        parameters: [["Int", "destroyit"]],
      },
      {
        result: "",
        name: "setAutoEdit",
        parameters: [["Int", "ae"]],
      },
      {
        result: "Int",
        name: "getAutoEdit",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "getByLabel",
        parameters: [
          ["TreeItem", "item"],
          ["String", "name"],
        ],
      },
      {
        result: "",
        name: "setSorted",
        parameters: [["Int", "dosort"]],
      },
      {
        result: "Int",
        name: "getSorted",
        parameters: [],
      },
      {
        result: "",
        name: "sortTreeItems",
        parameters: [],
      },
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
      {
        result: "Int",
        name: "setFontSize",
        parameters: [["Int", "newsize"]],
      },
      {
        result: "Int",
        name: "getFontSize",
        parameters: [],
      },
      {
        result: "Int",
        name: "getNumVisibleChildItems",
        parameters: [["TreeItem", "c"]],
      },
      {
        result: "Int",
        name: "getNumVisibleItems",
        parameters: [],
      },
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
      {
        result: "TreeItem",
        name: "enumAllItems",
        parameters: [["Int", "n"]],
      },
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
  "9B3B4B82667A420e8FFC794115809C02": {
    parent: "Object",
    functions: [
      {
        result: "Int",
        name: "getNumChildren",
        parameters: [],
      },
      {
        result: "",
        name: "setLabel",
        parameters: [["String", "label"]],
      },
      {
        result: "String",
        name: "getLabel",
        parameters: [],
      },
      {
        result: "",
        name: "ensureVisible",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "getNthChild",
        parameters: [["Int", "nth"]],
      },
      {
        result: "TreeItem",
        name: "getChild",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "getChildSibling",
        parameters: [["TreeItem", "_item"]],
      },
      {
        result: "TreeItem",
        name: "getSibling",
        parameters: [],
      },
      {
        result: "TreeItem",
        name: "getParent",
        parameters: [],
      },
      {
        result: "",
        name: "editLabel",
        parameters: [],
      },
      {
        result: "Int",
        name: "hasSubItems",
        parameters: [],
      },
      {
        result: "",
        name: "setSorted",
        parameters: [["Int", "issorted"]],
      },
      {
        result: "",
        name: "setChildTab",
        parameters: [["Int", "haschildtab"]],
      },
      {
        result: "Int",
        name: "isSorted",
        parameters: [],
      },
      {
        result: "Int",
        name: "isCollapsed",
        parameters: [],
      },
      {
        result: "Int",
        name: "isExpanded",
        parameters: [],
      },
      {
        result: "",
        name: "invalidate",
        parameters: [],
      },
      {
        result: "Int",
        name: "isSelected",
        parameters: [],
      },
      {
        result: "Int",
        name: "isHilited",
        parameters: [],
      },
      {
        result: "",
        name: "setHilited",
        parameters: [["Int", "ishilited"]],
      },
      {
        result: "Int",
        name: "collapse",
        parameters: [],
      },
      {
        result: "Int",
        name: "expand",
        parameters: [],
      },
      {
        result: "GuiTree",
        name: "getTree",
        parameters: [],
      },
      {
        result: "",
        name: "onTreeAdd",
        parameters: [],
      },
      {
        result: "",
        name: "onTreeRemove",
        parameters: [],
      },
      {
        result: "",
        name: "onSelect",
        parameters: [],
      },
      {
        result: "",
        name: "onDeselect",
        parameters: [],
      },
      {
        result: "Int",
        name: "onLeftDoubleClick",
        parameters: [],
      },
      {
        result: "Int",
        name: "onRightDoubleClick",
        parameters: [],
      },
      {
        result: "Int",
        name: "onChar",
        parameters: [["Int", "key"]],
      },
      {
        result: "",
        name: "onExpand",
        parameters: [],
      },
      {
        result: "",
        name: "onCollapse",
        parameters: [],
      },
      {
        result: "Int",
        name: "onBeginLabelEdit",
        parameters: [],
      },
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
  "1D8631C880D047929F98BD5D36B49136": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onOpenMenu",
        parameters: [],
      },
      {
        result: "",
        name: "onCloseMenu",
        parameters: [],
      },
      {
        result: "",
        name: "onSelectItem",
        parameters: [["String", "item"]],
      },
      {
        result: "",
        name: "openMenu",
        parameters: [],
      },
      {
        result: "",
        name: "closeMenu",
        parameters: [],
      },
    ],
    name: "MenuButton",
  },
  C7ED319953194798986360B15A298CAA: {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "onToggle",
        parameters: [["int", "newstate"]],
      },
      {
        result: "",
        name: "setChecked",
        parameters: [["int", "checked"]],
      },
      {
        result: "Int",
        name: "isChecked",
        parameters: [],
      },
      {
        result: "",
        name: "setText",
        parameters: [["String", "txt"]],
      },
      {
        result: "String",
        name: "getText",
        parameters: [],
      },
    ],
    name: "CheckBox",
  },
  "2D2D1376BE0A4CB9BC0C57E6E4C999F5": {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "getContentsHeight",
        parameters: [],
      },
      {
        result: "",
        name: "newCell",
        parameters: [["String", "groupname"]],
      },
      {
        result: "",
        name: "nextRow",
        parameters: [],
      },
      {
        result: "",
        name: "deleteAll",
        parameters: [],
      },
    ],
    name: "Form",
  },
  E2BBC14D84F64173BDB3B2EB2F665550: {
    parent: "GuiObject",
    functions: [
      {
        result: "Int",
        name: "getPosition",
        parameters: [],
      },
      {
        result: "",
        name: "setPosition",
        parameters: [["Int", "position"]],
      },
      {
        result: "",
        name: "onSetPosition",
        parameters: [["Int", "position"]],
      },
    ],
    name: "Frame",
  },
  "73C00594961F401B9B1B672427AC4165": {
    parent: "GuiObject",
    functions: [
      {
        result: "",
        name: "setMenuGroup",
        parameters: [["String", "groupId"]],
      },
      {
        result: "String",
        name: "getMenuGroup",
        parameters: [],
      },
      {
        result: "",
        name: "setMenu",
        parameters: [["String", "menuId"]],
      },
      {
        result: "String",
        name: "getMenu",
        parameters: [],
      },
      {
        result: "",
        name: "spawnMenu",
        parameters: [["int", "monitor"]],
      },
      {
        result: "",
        name: "cancelMenu",
        parameters: [],
      },
      {
        result: "",
        name: "setNormalId",
        parameters: [["String", "id"]],
      },
      {
        result: "",
        name: "setDownId",
        parameters: [["String", "id"]],
      },
      {
        result: "",
        name: "setHoverId",
        parameters: [["String", "id"]],
      },
      {
        result: "",
        name: "onOpenMenu",
        parameters: [],
      },
      {
        result: "",
        name: "onCloseMenu",
        parameters: [],
      },
      {
        result: "",
        name: "nextMenu",
        parameters: [],
      },
      {
        result: "",
        name: "previousMenu",
        parameters: [],
      },
    ],
    name: "Menu",
  },
};
