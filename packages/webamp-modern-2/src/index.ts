import JSZip from "jszip";
// This module is imported early here in order to avoid a circular dependency.
import { classResolver } from "./skin/resolver";
import SkinParser from "./skin/parse";
import UI_ROOT from "./UIRoot";
import { removeAllChildNodes } from "./utils";
import { addDropHandler } from "./dropTarget";

function hack() {
  // Without this Snowpack will try to treeshake out resolver causing a circular
  // dependency.
  classResolver("A funny joke about why this is needed.");
}

addDropHandler(loadSkin);

const STATUS = document.getElementById("status");

function setStatus(status: string) {
  STATUS.innerText = status;
}

async function main() {
  setStatus("Downloading skin...");
  // const response = await fetch("assets/CornerAmp_Redux.wal");
  // const response = await fetch("assets/Default_winamp3_build499.wal");
  // const response = await fetch("assets/makio.wal");
  // const response = await fetch("assets/Nullsoft.Winamp.2000.SP4.v1.4-RC2-lite.wal");
  // const response = await fetch("assets/MMD3.wal");
  const response = await fetch("assets/wacup-modern-skin.wal");
  // const response = await fetch("assets/wacupmodern.wal");
  // const response = await fetch("assets/wa3_default.wal"); // official winamp 5.8
  // const response = await fetch("assets/WinampModern.wal"); // official winamp 5.8
  // const response = await fetch("assets/WinampModernPP.wal");
  // const response = await fetch("assets/octave_v1_by_boostr29_d1a8nu.wal");
  // const response = await fetch("assets/ClassicModern.wal");
  // const response = await fetch("assets/Enkera.wal");
  // const response = await fetch("assets/simpletutorial1.1.wal");
  const data = await response.blob();
  await loadSkin(data);
}

async function loadSkin(skinData: Blob) {
  UI_ROOT.reset();
  document.body.appendChild(UI_ROOT.getRootDiv());

  setStatus("Loading .wal archive...");
  const zip = await JSZip.loadAsync(skinData);
  UI_ROOT.setZip(zip);

  setStatus("Parsing XML and initializing images...");
  const parser = new SkinParser(UI_ROOT);

  // This is always the same as the global singleton.
  const uiRoot = await parser.parse();

  const start = performance.now();
  uiRoot.enableDefaultGammaSet();
  const end = performance.now();
  console.log(`Loading initial gamma took: ${(end - start) / 1000}s`);

  setStatus("Rendering skin for the first time...");
  uiRoot.draw();

  setStatus("Initializing Maki...");
  console.log('Initializing Maki', 
  '##############################')

  for (const container of uiRoot.getContainers()) {
    console.log(
      '=============================',
      `loading container: ${container.getId()}`, 
    )
    // setTimeout(() => {
    container.init();
    // }, 1300);

  }
  setStatus("");
  // UI_ROOT.setZip(null);
}

main();
