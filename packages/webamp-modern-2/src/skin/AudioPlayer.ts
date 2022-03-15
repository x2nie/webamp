import { clamp, Emitter } from "../utils";
// import {jsmediatags} from "./vendor/jsmediatags.min.js";
// import MediaTagReader from "jsmediatags/build2/MediaTagReader";
// import * as jsmediatags from 'jsmediatags';
// import { Tags } from "jsmediatags/types";
// import * as ID3 from 'music-metadata-browser';
import { parse } from 'id3-parser';
import { convertFileToBuffer, fetchFileAsBuffer } from 'id3-parser/lib/universal/helpers';
import universalParse from 'id3-parser/lib/universal';

const BANDS = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

export const STATUS_PAUSED = -1;
export const STATUS_STOPPED = 0;
export const STATUS_PLAYING = 1;

export class AudioPlayer {
  _input: HTMLInputElement = document.createElement("input");
  _audio: HTMLAudioElement = document.createElement("audio");
  _context: AudioContext;
  __preamp: GainNode;
  _bands: GainNode[] = [];
  _source: MediaElementAudioSourceNode;
  _eqValues: { [kind: string]: number } = {};
  _eqNodes: { [kind: string]: number } = {};
  _eqEmitter: Emitter = new Emitter();
  __isStop: boolean = true; //becaue we can't audio.stop() currently
  //events aka addEventListener()
  _listeners = new Map();
  _onceListeners = new Map();
  _triggerdLabels = new Map();
  _trackInfo: {};
  _albumArtUrl : string = null;

  constructor() {
    this._context = this._context = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Fix for iOS and Chrome (Canary) which require that the context be created
    // or resumed by a user interaction.
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    // https://gist.github.com/laziel/7aefabe99ee57b16081c
    // Via: https://stackoverflow.com/a/43395068/1263117
    // TODO #leak
    if (this._context.state === "suspended") {
      const resume = async () => {
        await this._context.resume();

        if (this._context.state === "running") {
          // TODO: Add this to the disposable
          document.body.removeEventListener("touchend", resume, false);
          document.body.removeEventListener("click", resume, false);
          document.body.removeEventListener("keydown", resume, false);
        }
      };

      document.body.addEventListener("touchend", resume, false);
      document.body.addEventListener("click", resume, false);
      document.body.addEventListener("keydown", resume, false);
    }
    this._audio.src = "/assets/Just_Plain_Ant_-_05_-_Stumble.mp3";
    this.readId3( this._audio.src )
    //"https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Auto-Pilot_-_03_-_Seventeen.mp3";
    this._input.type = "file";

    this._source = this._context.createMediaElementSource(this._audio);

    this.__preamp = this._context.createGain();

    const connectionNodes: AudioNode[] = [this._source, this.__preamp];

    BANDS.forEach((band, i) => {
      const filter = this._context.createBiquadFilter();
      this._bands.push(filter);

      if (i === 0) {
        // The first filter, includes all lower frequencies
        filter.type = "lowshelf";
      } else if (i === BANDS.length - 1) {
        // The last filter, includes all higher frequencies
        filter.type = "highshelf";
      } else {
        filter.type = "peaking";
      }
      filter.frequency.value = band;
      filter.gain.value = 0;
      connectionNodes.push(filter);
    });

    connectionNodes.push(this._context.destination);

    let current = connectionNodes[0];
    for (let i = 1; i < connectionNodes.length; i++) {
      let next = connectionNodes[i];
      current.connect(next);
      current = next;
    }

    // document.body.appendChild(this._input);
    // TODO: dispose
    this._input.onchange = (e) => {
      const file = this._input.files[0];
      if (file == null) {
        return;
      }
      this._audio.src = URL.createObjectURL(file);
      this.play();
    };

    //temporary: in the end of playing mp3, lets stop.
    //TODO: in future, when ended: play next mp3
    this._audio.addEventListener("ended", ()=> this.stop());
  }

  async readId3(track:string) {
    let url;

    

      if (track.startsWith('http')) {
          url = track;
      } else if (track.startsWith('/')) {
          url = window.location.origin + track;
      } else {
          url = window.location.origin + window.location.pathname + track;
      }

      universalParse(url).then(tag => {
        console.log('ID3:',tag);
        const byteArray = new Uint8Array(tag.image.data);
        const blob = new Blob([byteArray], { type: tag.image.mime });
        this._albumArtUrl = URL.createObjectURL(blob);
        // const url = `url(data:${tag.image.mime};base64,${base64})`;
      });
    /* try {
      let url;

      if (track.startsWith('http')) {
          url = track;
      } else if (track.startsWith('/')) {
          url = window.location.origin + track;
      } else {
          url = window.location.origin + window.location.pathname + track;
      }
      const options = {
        duration: true,
        skipPostHeaders: true, // avoid unnecessary data to be read
      };
      const metadata = await ID3.fetchFromUrl(url, options)// await genMediaTags(file, await requireMusicMetadata());
      // There's more data here, but we don't have a use for it yet:
      const { artist, title, album, picture } = metadata.common;
      const { numberOfChannels, bitrate, sampleRate } = metadata.format;
      // let albumArtUrl = null;
      if (picture && picture.length >= 1) {
        const byteArray = new Uint8Array(picture[0].data);
        const blob = new Blob([byteArray], { type: picture[0].format });
        this._albumArtUrl = URL.createObjectURL(blob);
      }
      console.log('MP3ID3', metadata)
      
    } catch (e) {
      //dispatch({ type: MEDIA_TAG_REQUEST_FAILED, id });
      console.warn('Failed to read ID3:', e)
    } */
    /*return new Promise((resolve, reject) => {
        let url;

        if (track.startsWith('http')) {
            url = track;
        } else if (track.startsWith('/')) {
            url = window.location.origin + track;
        } else {
            url = window.location.origin + window.location.pathname + track;
        }

        

        jsmediatags.read(url, {
            onSuccess: (tags) => {
              console.log('ID3:',tags)
                let trackInfo = this._trackInfo = tags.tags;

                // if (trackInfo.artist && trackInfo.title) {
                //     trackInfo.name = `${trackInfo.artist} - ${trackInfo.title}`;
                // }

                // if (trackInfo.title) {
                //     trackInfo.titleOrFilename = trackInfo.title;
                // }

                // if (trackInfo.artist) {
                //     trackInfo.artistOrFilename = trackInfo.artist;
                // }

                // if (trackInfo.track) {
                //     trackInfo.trackNumber = parseInt(trackInfo.track.split('/')[0]);
                // }

                if (trackInfo.picture) {
                    let base64 = btoa(String.fromCharCode.apply(null, trackInfo.picture.data));

                    trackInfo.picture = Object.assign(trackInfo.picture, {
                        base64: 'data:' + trackInfo.picture.format + ';base64,' + base64
                    });

                    // trackInfo.albumCover = trackInfo.picture;
                }

                // if (tags.tags.TYER || tags.tags.TDRC) {
                //     trackInfo.year = tags.tags.TYER ? parseInt(tags.tags.TYER.data) : (
                //         tags.tags.TDRC ? parseInt(tags.tags.TDRC.data) : null
                //     )
                // }

                // trackInfo._loaded = true;

                resolve(trackInfo);
            },
            onError: (error) => {
              console.log('ID3:',error)
                reject(error);
            }
        });
    }); */
  }

  // 0-1
  getVolume(): number {
    return this._audio.volume;
  }
  play() {
    this.__isStop = false;
    this._audio.play();
    this.trigger('play');
    this.trigger('statchanged');
  }
  stop() {
    this.__isStop = true; // needed to make threestate
    if(this._audio.paused) {this._audio.play()}; // for trigger the event change
    this._audio.pause();
    this._audio.currentTime = 0;
    this.trigger('stop');
    this.trigger('statchanged');
  }
  pause() {
    this.__isStop = false; // needed to make threestate
    this._audio.pause();
    this.trigger('pause');
    this.trigger('statchanged');
  }

  eject() {
    this._input.click();
  }

  next() {}

  previous() {}

  // 0-1
  setVolume(volume: number) {
    this._audio.volume = volume;
  }

  seekTo(secs: number) {
    this._audio.currentTime = secs;
  }

  seekToPercent(percent: number) {
    this._audio.currentTime = this._audio.duration * percent;
  }

  // In seconds
  getCurrentTime(): number {
    return this._audio.currentTime;
  }

  getCurrentTimePercent(): number {
    return this._audio.currentTime / this._audio.duration;
  }

  getState(): number {
    if(!!this.__isStop) { // To distinc with pause
      return STATUS_STOPPED; 
    }
    const audio = this._audio;
    if(!audio.ended && !audio.paused) {
      return STATUS_PLAYING
    } 
    else
    if(audio.ended){
      return STATUS_STOPPED
    } 
    else 
    if(audio.paused){
      return STATUS_PAUSED
    } 
  }

  // doStateChanged() {
  //   this.trigger('play')
  // }

  // onStateChange(cb: () => void): () => void {
  //   const handler = () => {
  //     // console.log('audio.onPlay!')
  //     cb();
  //   }
  //   this._audio.addEventListener("playing", handler);
  //   this._audio.addEventListener("pause", handler);
  //   this._audio.addEventListener("ended", handler);
  //   const dispose = () => {
  //     this._audio.removeEventListener("playing", handler);
  //     this._audio.removeEventListener("pause", handler);
  //     this._audio.removeEventListener("ended", handler);
  //   };
  //   return dispose;
  // }

  getEq(kind: string): number {
    switch (kind) {
      case "preamp":
        return (this.__preamp.gain.value + 12) / 24;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
        const bandIndex = Number(kind) - 1;
        const filter = this._bands[bandIndex];
        const value = (filter.gain.value + 12) / 24;
        return value;
      default:
        console.warn(`Tried to get unknown EQ kind: ${kind}`);
        return 0;
    }
  }

  setEq(kind: string, value: number) {
    // console.log({ kind, value });
    const db = value * 24 - 12;
    switch (kind) {
      case "preamp": {
        this.__preamp.gain.value = db;
        this._eqValues[kind] = db;
        this._eqEmitter.trigger(kind);
        break;
      }
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
        const bandIndex = Number(kind) - 1;
        const filter = this._bands[bandIndex];
        filter.gain.value = db;
        this._eqEmitter.trigger(kind);
        break;
      default:
        console.warn(`Tried to set unknown EQ kind: ${kind}`);
    }
  }

  onEqChange(kind: string, cb: () => void): () => void {
    switch (kind) {
      case "preamp":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "10":
        return this._eqEmitter.on(kind, cb);
      default:
        console.warn(`Tried to bind to an unknown EQ kind: ${kind}`);
    }
  }

  onCurrentTimeChange(cb: () => void): () => void {
    const handler = () => cb();
    this._audio.addEventListener("timeupdate", handler);
    const dispose = () => {
      this._audio.removeEventListener("timeupdate", handler);
    };
    return dispose;
  }

  onSeek(cb: () => void): () => void {
    const handler = () => cb();
    this._audio.addEventListener("seeked", handler);
    const dispose = () => {
      this._audio.removeEventListener("seeked", handler);
    };
    return dispose;
  }

  onVolumeChanged(cb: () => void): () => void {
    const handler = () => cb();
    this._audio.addEventListener("volumechange", handler);
    const dispose = () => {
      this._audio.removeEventListener("volumechange", handler);
    };
    return dispose;
  }

  //* this only custom listerner ================================

  // execute the callback everytime the label is trigger
  on(label:string, callback, checkPast = false): ()=>void {
    this._listeners.has(label) || this._listeners.set(label, []);
    this._listeners.get(label).push(callback);
    if (checkPast)
        this._fCheckPast(label, callback);
    const dispose = () => {
      this.off(label, callback);
    };
    return dispose;
  }

  // remove the callback for a label
  off(label:string, callback) {
    // if (callback === true) {
    //     // remove listeners for all callbackfunctions
    //     this._listeners.delete(label);
    //     this._onceListeners.delete(label);
    // } else {
        // remove listeners only with match callbackfunctions
        let _off = (inListener) => {
            let listeners = inListener.get(label);
            if (listeners) {
                inListener.set(label, listeners.filter((value) => !(value === callback)));
            }
        };
        _off(this._listeners);
        _off(this._onceListeners);
    // }
}


  // help-function for onReady and onceReady
  // the callbackfunction will execute, 
  // if the label has already been triggerd with the last called parameters
  _fCheckPast(label, callback) {
    if (this._triggerdLabels.has(label)) {
        callback(this._triggerdLabels.get(label));
        return true;
    } else {
        return false;
    }
  }

  // execute the callback onetime the label is trigger
  once(label:string, callback, checkPast = false) {
      this._onceListeners.has(label) || this._onceListeners.set(label, []);
      if (!(checkPast && this._fCheckPast(label, callback))) {
          // label wurde nocht nicht aufgerufen und 
          // der callback in _fCheckPast nicht ausgeführt
          this._onceListeners.get(label).push(callback);
      }
  }
 
  // trigger the event with the label 
  trigger(label:string, ...args: any[]) {
      let res = false;
      this._triggerdLabels.set(label, args); // save all triggerd labels for onready and onceready
      let _trigger = (inListener, label, ...args) => {
          let listeners = inListener.get(label);
          if (listeners && listeners.length) {
              listeners.forEach((listener) => {
                  listener(...args);
              });
              res = true;
          }
      };
      _trigger(this._onceListeners, label, ...args);
      _trigger(this._listeners, label, ...args);
      this._onceListeners.delete(label); // callback for once executed, so delete it.
      return res;
  }
  // onStop( cb: ()=>void): ()=>void {
  //   const handler = () => {
  //     cb(); //guard
  //   }
  //   return this.on('stop', handler);
  // }

  /* sample --------------------------
  // execute the callback everytime the label is trigger
  // check if the label had been already called 
  // and if so excute the callback immediately
  onReady(label:string, callback) {
    this.on(label, callback, true);
  }

  // execute the callback onetime the label is trigger
  // or execute the callback if the label had been called already
  onceReady(label, callback) {
      this.once(label, callback, true);
  } */



  // Current track length in seconds
  getLength(): number {
    return this._audio.duration;
  }
}

const AUDIO_PLAYER = new AudioPlayer();

export default AUDIO_PLAYER;
