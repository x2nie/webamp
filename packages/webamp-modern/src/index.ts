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

// const DEFAULT_SKIN = "assets/skins/MMD3.wal"
const DEFAULT_SKIN = "assets/skins/WinampModern566.wal";

// type Webamp = window.WebampModern
var webamp: IWebampModern;

async function main() {
  // Purposefully don't await, let this load in parallel.
  const skinLoading = initializeSkinListMenu();

  const skinPath = getUrlQuery(window.location, "skin") || DEFAULT_SKIN;
  // changeSkinByUrl();

  const option: Options = {
    skin: skinPath,
    tracks: [
      "assets/Just_Plain_Ant_-_05_-_Stumble.mp3",
      // "assets/440-square.wav",
      // "assets/winampvis-MAX.wav",
      // "assets/winampvis.wav",
      "assets/Just_Plain_Ant_-_05_-_Stumble.mp3",
    ],
  };

  setStatus("Downloading MP3...");
  webamp = new window.WebampModern(document.getElementById("web-amp"), option);
  webamp.onLogMessage(setStatus);
  skinLoading.then((skins)=> webamp.setSkins(skins))

  // var webamp2 = new window.WebampModern(document.getElementById("web-amp"), {...option, skin:"assets/skins/MMD3.wal"});
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

  let bankskin1 = [];
  // try {
  //   const response = await fetch("https://api.webampskins.org/graphql", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //     mode: "cors",
  //     credentials: "include",
  //     body: JSON.stringify({ query, variables: {} }),
  //   });
  //   const data = await response.json();
  //   bankskin1 = data.data.modern_skins.nodes;
  // } catch (e) {
  //   console.warn('faile to load skins from api.webampskins.org')
  // }

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
    // MODERN
    { name: "[Winamp] default", url: DEFAULT_SKIN },
    { name: "[Winamp] 5 (Live Editing)", url: "assets/skins/WinampModernThinger.zip" },
    { name: "[Winamp] MMD3", url: "assets/skins/MMD3.wal" },
    { name: "[Winamp] 3", url: "assets/skins/Default_winamp3_build499.wal" },
    // { name: "Paused after 3 seconds playing", url: "assets/skins/3sPaused/" },
    // { name: "[Winamp] MMD3+Thinger", url: "assets/skins/MMD3+Thinger/" },
    // { name: "[Folder] MMD3", url: "assets/skins/extracted/MMD3/" },
    // { name: "[Winamp] BigBento", url: "assets/skins/BigBento/" },
    { name: "CornerAmp_Redux", url: "assets/skins/CornerAmp_Redux.wal" },

    
    // CLASSIC
    { name: "[Winamp Classic]", url: "assets/skins/base-2.91.wsz" },
    {
      name: "[Winamp Classic] MacOSXAqua1-5",
      url: "assets/skins/MacOSXAqua1-5.698dd4ab.wsz",
    },
    {
      name: "[Winamp Classic] Green-Dimension-V2",
      url: "assets/skins/Green-Dimension-V2.6f88d5c3.wsz",
    },

    // WINDOWS MEDIA PLAYER
    {
      name: "[wmp] Quicksilver WindowsMediaPlayer!",
      url: "assets/skins/Quicksilver.wmz",
    },
    { name: "[wmp] Windows XP", url: "assets/skins/Windows-XP.wmz" },
    {
      name: "[wmp] Famous Headspace",
      url: "assets/skins/Headspace.wmz",
    },
    {
      name: "[wmp] Disney Mix Central",
      url: "assets/skins/DisneyMixCentral.wmz",
    },

    // AUDION
    {
      name: "[Audion Face] Smoothface 2",
      url: "assets/skins/Smoothface2.face",
    },
    {
      name: "[Audion Face] Gizmo 2.0",
      url: "assets/skins/Gizmo2.0.face",
    },
    {
      name: "[Audion Face] Tokyo Bay",
      url: "assets/skins/TokyoBay.face",
    },

    // K-JOFOL
    { name: "[K-Jofol] Default", url: "assets/skins/Default.kjofol" },
    {
      name: "[K-Jofol] Illusion 1.0",
      url: "assets/skins/Illusion1-0.kjofol",
    },
    {
      name: "[K-Jofol] K-Nine 05r",
      url: "assets/skins/K-Nine05r.kjofol",
    },
    { name: "[K-Jofol] Limus 2.0", url: "assets/skins/Limus2-0.zip" },

    // SONIQUE
    { name: "[Sonique] Default", url: "assets/skins/sonique.sgf" },
    {
      name: "[Sonique] Scifi-Stories",
      url: "assets/skins/scifi-stories.sgf",
    },
    {
      name: "[Sonique] Panthom (SkinBuilder)",
      url: "assets/skins/phantom.sgf",
    },
    { name: "[Sonique] ChainZ and", url: "assets/skins/ChainZ-and.sgf" },

    // COWON JET-AUDIO
    {
      name: "[JetAudio] Small Bar",
      url: "assets/skins/DefaultBar_s.jsk",
    },
    { name: "[Cowon JetAudio] Gold", url: "assets/skins/Gold.uib" },

    // AIMP
    { name: "[AIMP] Flo-4K", url: "assets/skins/AIMP-Flo-4K.acs5" },
  ];

  const skins = [...internalSkins, ...bankskin1];
  

  for (const skin of skins) {
    const option = document.createElement("option");
    option.value = skin.url;
    option.textContent = skin.name;
    if (current === skin.url) {
      option.selected = true;
      downloadLink.href = skin.url;
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

  return skins
}

main();
