import { assume, integerToTime, num, toBool } from "../../utils";
import AUDIO_PLAYER, { Track } from "../AudioPlayer";
// import * as musicMetadata from 'music-metadata-browser';
import { parse } from "id3-parser";
import {
  convertFileToBuffer,
  fetchFileAsBuffer,
} from "id3-parser/lib/universal/helpers";
import { parseMetaData } from "../AudioMetadata";
import { UIRoot } from "../../UIRoot";
import ConfigAttribute from "./ConfigAttribute";
import { Emitter } from "@lib/Emitter";
import BaseObject from "./BaseObject";
import { uiRegistry } from "@lib/registry";
import { xml, onMounted, onWillUnmount } from "@odoo/owl";
import { UI } from "./GuiObj";
import { promptForFileReferences } from "@lib/webamp2";

// import * as jsmediatags from 'jsmediatags';
export class PlaylistUI extends UI {
  static template = xml`
    <t t-call="ui">
      <!-- <div style="border:1px solid yellow;">asdf</div> -->
      <ol class="content-list">
        <t t-set="current" t-value="pl.getCurrentIndex()"/>
        <li t-foreach="[...Array(pl.getNumTracks()).keys()]" t-as="i" t-key="i"
          t-att-class="{'current': i==current}"
          t-att-offset="i"
          t-on-dblclick="runTrack"
        >
          <span t-out="i+1"/>. 
          <span t-out="pl.getTitle(i)"/>
          <span t-out="pl.getLength(i)"/>
          <!-- <t t-out="window.JSON.stringify(track)"/> -->
        </li>
      </ol>
    </t>`;

  setup() {
    super.setup();
    this.refresh = this.refresh.bind(this);
    onMounted(() => {
      this.pl.on("trackchange", this.refresh);
    });
    onWillUnmount(() => {
      this.pl.off("trackchange", this.refresh);
    });
  }

  get pl(): PlEdit {
    return this.env.playlist as PlEdit;
  }
  tracks() {
    return this.pl._tracks;
  }

  refresh() {
    console.log("refreshed");
    this.render();
  }

  runTrack(ev: MouseEvent) {
    // debugger
    const offset = Number(
      (ev.currentTarget as HTMLElement).getAttribute("offset")
    );
    console.log("running track #", offset);
    this.pl.playTrack(offset);
  }

  style(): string {
    let style = super.style();
    style += "border:1px solid red;";
    style += "--color-pledit-text-current:blue;";
    return style;
  }
}
uiRegistry.add("pl", PlaylistUI);

/**
 * Non GUI element.
 * Hold tracs.
 * It still exist (not interfered) when skin changed
 */
export class PlEdit extends BaseObject {
  static GUID = "345beebc49210229b66cbe90d9799aa4";
  // taken from lib/pldir.mi
  static guid = "{345BEEBC-0229-4921-90BE-6CB6A49A79D9}";
  // _uiRoot: UIRoot;
  _tracks: Track[] = [];
  _trackCounter: number = 1;
  _currentIndex: number = -1;
  _selection: number[] = [];
  _shuffleAttrib: ConfigAttribute;
  _repeatAttrib: ConfigAttribute;
  _shuffle: boolean;
  _repeat: number = 0; // 0=off | 1=all | -1=track
  _eventListener: Emitter = new Emitter();

  // constructor(uiRoot: UIRoot) {
  //   this._uiRoot = uiRoot;
  //   this._listenShuffleRepeat();
  // }

  initialize() {
    this._shuffleChanged(); //trigger to get value from cache storage
    this._repeatChanged(); //trigger to get value from cache storage
  }

  // shortcut of this.Emitter
  on(event: string, callback: Function): Function {
    return this._eventListener.on(event, callback);
  }
  trigger(event: string, ...args: any[]) {
    this._eventListener.trigger(event, ...args);
  }
  off(event: string, callback: Function) {
    this._eventListener.off(event, callback);
  }

  //? ======= shuffle & Repeat Changes =======
  _listenShuffleRepeat() {
    // const [guid, attrib] = cfgattrib.split(";");
    const guid = "{45F3F7C1-A6F3-4EE6-A15E-125E92FC3F8D}"; // pl
    const configItem = this._uiRoot.CONFIG.getitem(guid);
    this._shuffleAttrib = configItem.getattribute("shuffle");
    this._repeatAttrib = configItem.getattribute("repeat");
    //TODO: dispose it
    this._shuffleAttrib.on(
      "datachanged",
      this._shuffleChanged
      // ()=>{
      // const sshuffle = shuffleAttrib.getdata()
      // this._shuffle = toBool(sshuffle)
      // console.log('shuffle:',this._shuffle)
      // }
    );
    this._repeatAttrib.on(
      "datachanged",
      this._repeatChanged
      // ()=>{
      // const srepeat = repeatAttrib.getdata()
      // this._repeat = num(srepeat)
      // console.log('repeat:',this._repeat)
      // }
    );
  }
  _shuffleChanged = () => {
    const sshuffle = this._shuffleAttrib.getdata();
    this._shuffle = toBool(sshuffle);
    console.log("shuffle:", this._shuffle);
  };
  _repeatChanged = () => {
    const srepeat = this._repeatAttrib.getdata();
    this._repeat = num(srepeat);
    console.log("repeat:", this._repeat);
  };

  //? ======= General PlEdit Information =======
  getNumTracks(): number {
    return this._tracks.length;
  }

  getCurrentIndex(): number {
    return this._currentIndex;
  }

  getnumselectedtracks(): number {
    return this._selection.length;
  }

  getnextselectedtrack(i: number): number {
    const current = this._selection.indexOf(i);
    const next = this._selection[current + 1];
    return next;
  }

  //? ======= Manipulate PlEdit View =======
  // Scrolls the PL to the currently playling
  // item (mostly used with onKeyDown: space)
  showcurrentlyplayingtrack(): void {
    // return unimplementedWarning("showcurrentlyplayingtrack");
  }

  showtrack(item: number): void {
    // return unimplementedWarning("showtrack");
  }

  addTrack(track: Track) {
    if (!track.id) {
      this._trackCounter++;
      track.id = this._trackCounter;
    }
    this._tracks.push(track);

    // set audio source if it is the first
    if (this._tracks.length == 1) {
      this._setPlayingTrack(0, false);
    }

    this.trigger("trackchange"); //let PL(gui) show the change.

    if (!track.metadata) {
      parseMetaData(track, () => {
        this.trigger("trackchange");
      });
    }
  }

  enqueueFile(file: string): void {
    const newTrack: Track = { filename: file };
    this.addTrack(newTrack);
  }

  clear(): void {
    this._selection = [];
    this._tracks = [];
    this._currentIndex = null;
  }

  removetrack(item: number): void {
    // return unimplementedWarning("removetrack");
  }

  swaptracks(item1: number, item2: number): void {
    // return unimplementedWarning("swaptracks");
  }

  moveup(item: number): void {
    // return unimplementedWarning("moveup");
  }

  movedown(item: number): void {
    // return unimplementedWarning("movedown");
  }

  moveto(item: number, pos: number): void {
    // return unimplementedWarning("moveto");
  }

  currentTrack(): Track | null {
    if (this._currentIndex < 0) {
      return null;
    }
    return this._tracks[this._currentIndex];
  }

  _setPlayingTrack(item: number, play:boolean): void {
    this._currentIndex = item;
    const track = this._tracks[item];
    const url = track.file ? URL.createObjectURL(track.file) : track.filename;
    this.attributes.audio.setAudioSource(url);
    if(play){
      this.attributes.audio.play();
    }
    this.trigger("trackchange");
  }

  playTrack(item: number): void {
    this._setPlayingTrack(item, true)
    // this._currentIndex = item;
    // const track = this._tracks[item];
    // const url = track.file ? URL.createObjectURL(track.file) : track.filename;
    // this.attributes.audio.setAudioSource(url);
    // this.attributes.audio.play();
    // this.trigger("trackchange");
  }

  next() {
    const currentTrack = this.getCurrentIndex();
    //TODO: check if "repeat" is take account
    if (currentTrack < this.getNumTracks() - 1) {
      this.playTrack(currentTrack + 1);
    }
    this.attributes.audio.play();
  }

  previous() {
    const currentTrack = this.getCurrentIndex();
    if (currentTrack > 0) {
      this.playTrack(currentTrack - 1);
    }
    this.attributes.audio.play();
    //TODO: check if "repeat" is take account
  }

  getCurrentTrackTitle(): string {
    if (this._currentIndex < 0) {
      return "";
    }
    return this.getTitle(this._currentIndex);
  }

  getrating(item: number): number {
    return this._tracks[item].rating ?? 0;
  }

  setrating(item: number, rating: number): void {
    this._tracks[item].rating = rating;
  }

  getTitle(item: number): string {
    const track = this._tracks[item];
    if (track.metadata) {
      return `${track.metadata.artist} - ${track.metadata.title}`;
    }
    return this._tracks[item].filename.split("/").pop();
  }

  getLength(item: number): string {
    return integerToTime(this._tracks[item].duration || 0);
    // return unimplementedWarning("getlength");
  }

  // getmetadata(item: number, metadatastring: string): string {
  //   // return unimplementedWarning("getmetadata");
  // }

  // getfilename(item: number): string {
  //   // return unimplementedWarning("getfilename");
  // }

  onpleditmodified(): void {
    // return unimplementedWarning("onpleditmodified");
  }

  async appendFiles(clear:boolean=false, directory:boolean=false) {
    const files = await promptForFileReferences({ accept: "audio/*, video/*", directory });
    // console.log(files);
    if (files.length) {
      if(clear){
        this.clear();
      }
      for (var i = 0; i < files.length; i++) {
        const newTrack: Track = {
          filename: files[i].name,
          file: files[i],
        };
        this.addTrack(newTrack);
      }
      this.attributes.audio.play()
    }
  }

  async appendFolder(clear:boolean=false) {
    return this.appendFiles(clear, true)
  }

  // async fetchMediaDuration(track: Track, callback: Function):Promise<void> {
  //   try {
  //     const audioTrackUrl = track.file ? URL.createObjectURL(track.file) : track.filename;
  //     track.duration = await genMediaDuration(audioTrackUrl);

  //     // const options = {
  //     //   duration: true,
  //     //   skipPostHeaders: true, // avoid unnecessary data to be read
  //     // };
  //     // // const metadata = await musicMetadata.fetchFromUrl(audioTrackUrl, options);
  //     // // console.log('mm-meta:', metadata)
  //     // musicMetadata.fetchFromUrl(audioTrackUrl, options).then((metadata)=>{
  //     //   console.log('mm-meta:', metadata)
  //     // });
  //     fetchFileAsBuffer(audioTrackUrl).then(parse).then(tag => {
  //       console.log('id3:',tag);
  //     });
  //     callback()
  //   } catch (e) {
  //     // TODO: Should we update the state to indicate that we don't know the length?
  //     console.warn('ERROR:',e)
  //   }
  // }
}

export const PLEDIT = new PlEdit("pledit", { audio: AUDIO_PLAYER });

/**
 * The PlaylistDirectory object is simply a list with all the saved playlist from the media library.
 * Please remember that this object is always on top of other objects,
 * so you'll have to hide it via maki if you dont want it to be visible.
 * This object was introduced in Winamp 5.5(skinversion 1.3)
 */
// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3CPlaylistDirectory.2F.3E
export class PlDir {
  static GUID = "61a7abad41f67d7980e1d0b1f4a40386";
  // taken from lib/pldir.mi

  showcurrentlyplayingentry(): void {
    // return unimplementedWarning("showcurrentlyplayingentry");
  }

  // getnumitems(): number {
  //   // return unimplementedWarning("getnumitems");
  // }

  // getitemname(item: number): string {
  //   // return unimplementedWarning("getitemname");
  // }

  refresh(): void {
    // return unimplementedWarning("refresh");
  }

  renameitem(item: number, name: string): void {
    // return unimplementedWarning("renameitem");
  }

  enqueueitem(item: number): void {
    // return unimplementedWarning("enqueueitem");
  }

  playitem(item: number): void {
    // return unimplementedWarning("playitem");
  }
}
