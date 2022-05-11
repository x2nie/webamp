import { WebAmpModern, IWebampModern, Options } from "./WebampModernInteface";

declare global {
  interface Window {
    WebampModern: typeof WebAmpModern;
  }
}

function getUrlQuery(location: Location, variable: string): string {
  return new URL(location.href).searchParams.get(variable);
}

// temporary disable:
// addDropHandler(loadSkin);

const STATUS = document.getElementById("status");

function setStatus(status: string) {
  STATUS.innerText = status;
}

// const DEFAULT_SKIN = "assets/MMD3.wal"
const DEFAULT_SKIN = "assets/WinampModern566.wal";

// type Webamp = window.WebampModern
var webamp: IWebampModern;

async function main() {
  // Purposefully don't await, let this load in parallel.
  initializeSkinListMenu();

  const skinPath = getUrlQuery(window.location, "skin") || DEFAULT_SKIN;
  // changeSkinByUrl();

  const option: Options = {
    skin: skinPath,
    tracks: [
      "assets/Just_Plain_Ant_-_05_-_Stumble.mp3",
      "assets/Just_Plain_Ant_-_05_-_Stumble.mp3",
      "assets/Just_Plain_Ant_-_05_-_Stumble.mp3",
    ],
  };

  setStatus("Downloading MP3...");
  webamp = new window.WebampModern(document.getElementById("web-amp"), option);
  webamp.onLogMessage(setStatus);

  setStatus("");
}

async function changeSkinByUrl() {
  setStatus("Downloading skin...");
  const skinPath = getUrlQuery(window.location, "skin") || DEFAULT_SKIN;
  webamp.switchSkin(skinPath);
  setStatus("");
}

function gql(strings: TemplateStringsArray): string {
  return strings[0];
}

async function initializeSkinListMenu() {
  const query = gql`
    query {
      modern_skins(first: 1000) {
        nodes {
          filename
          download_url
        }
      }
    }
  `;

  const response = await fetch("https://api.webampskins.org/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    credentials: "include",
    body: JSON.stringify({ query, variables: {} }),
  });

  const data = await response.json();

  const select = document.createElement("select");
  select.style.position = "absolute";
  select.style.bottom = "0";
  select.style.width = "300px";

  const downloadLink = document.createElement("a");
  downloadLink.style.position = "absolute";
  downloadLink.style.bottom = "0";
  downloadLink.style.left = "320px";
  downloadLink.text = "Download";

  const current = getUrlQuery(window.location, "skin");

  const internalSkins = [
    { filename: "default", download_url: "" },
    { filename: "MMD3", download_url: "assets/MMD3.wal" },
    { filename: "[Folder] MMD3", download_url: "assets/extracted/MMD3/" },
    { filename: "[Classic]", download_url: "assets/base-2.91.wsz" },
    { filename: "[wmp] Quicksilver WindowsMediaPlayer!", download_url: "assets/Quicksilver.wmz" },
    { filename: "[wmp] Windows XP", download_url: "assets/Windows-XP.wmz" },
    { filename: "CornerAmp_Redux", download_url: "assets/CornerAmp_Redux.wal" },
  ];

  const skins = [...internalSkins, ...data.data.modern_skins.nodes];

  for (const skin of skins) {
    const option = document.createElement("option");
    option.value = skin.download_url;
    option.textContent = skin.filename;
    if (current === skin.download_url) {
      option.selected = true;
      downloadLink.href = skin.download_url;
    }
    select.appendChild(option);
  }

  select.addEventListener("change", (e: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set("skin", e.target.value);
    // window.location.replace(url.href);
    const title = e.target.text;
    const newPath = url.href.substring(url.origin.length);

    // https://stackoverflow.com/questions/3338642/updating-address-bar-with-new-url-without-hash-or-reloading-the-page
    window.history.pushState({ pageTitle: title }, title, newPath);
    changeSkinByUrl();

    downloadLink.href = e.target.value;
  });

  window.onpopstate = function (e) {
    if (e.state) {
      document.title = e.state.pageTitle;
    }
    changeSkinByUrl();
  };

  document.body.appendChild(select);
  document.body.appendChild(downloadLink);
}

main();
