import { SKIN_CDN, SCREENSHOT_CDN } from "./constants";

export function screenshotUrlFromHash(hash) {
  return `${SCREENSHOT_CDN}/screenshots/${hash}.png`;
}

export function skinUrlFromHash(hash) {
  return `${SKIN_CDN}/skins/${hash}.wsz`;
}

export function getWindowSize() {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0],
    x = e.clientWidth || g.clientWidth || w.innerWidth,
    y = e.clientHeight || g.clientHeight || w.innerHeight;

  return {
    windowWidth: x,
    windowHeight: y,
  };
}

export function eventIsLinkClick(event) {
  return (
    !event.defaultPrevented && // onClick prevented default
    event.button === 0 &&
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  );
}

export function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

// https://github.com/captbaritone/webamp/blob/7fe34a4658e543fccabacf3c516709ae3501b2ec/packages/webamp/js/fileUtils.ts
export async function promptForFileReferences({ accept, directory = false }) {
  return new Promise((resolve) => {
    // Does this represent a memory leak somehow?
    // Can this fail? Do we ever reject?
    const fileInput = document.createElement("input");
    if (accept) fileInput.setAttribute("accept", accept);
    fileInput.type = "file";
    fileInput.multiple = true;
    // @ts-ignore Non-standard
    fileInput.webkitdirectory = directory;
    // @ts-ignore Non-standard
    fileInput.directory = directory;
    // @ts-ignore Non-standard
    fileInput.mozdirectory = directory;
    // Not entirely sure why this is needed, since the input
    // was just created, but somehow this helps prevent change
    // events from getting swallowed.
    // https://stackoverflow.com/a/12102992/1263117

    // @ts-ignore Technically you can't set this to null, it has to be a string.
    // But I don't feel like retesting it, so I'll leave it as null
    fileInput.value = null;
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      resolve(files);
    });
    fileInput.click();
  });
}

let i = 0;
export function uniqueId() {
  return i++;
}

export function filenameIsReadme(filename) {
  return (
    filename.match(/\.txt$/) &&
    ![
      "genex.txt",
      "genexinfo.txt",
      "gen_gslyrics.txt",
      "region.txt",
      "pledit.txt",
      "viscolor.txt",
      "winampmb.txt",
      "gen_ex help.txt",
      "mbinner.txt",
      // Skinning Updates.txt ?
    ].some((name) => filename.match(new RegExp(name, "i")))
  );
}
