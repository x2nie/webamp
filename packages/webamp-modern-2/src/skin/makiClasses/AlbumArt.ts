import Layer from "./Layer";

// http://wiki.winamp.com/wiki/XML_GUI_Objects#.3Clayer.2F.3E
export default class AlbumArt extends Layer {
  static GUID = "6dcb05e448c28ac4f04993b14af50e91";
  

  refresh() {
    //TODO
  }

  isloading(): number {
    return 1;
  }

  onAlbumArtLoaded(success:boolean){
    return true; //TODO 
  }

}
