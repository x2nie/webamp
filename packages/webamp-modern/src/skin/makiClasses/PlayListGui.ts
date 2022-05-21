import UI_ROOT from "../../UIRoot";
import { removeAllChildNodes } from "../../utils";
import Group from "./Group";
import Slider, { ActionHandler } from "./Slider";

export default class PlayListGui extends Group {
  static GUID = "45F3F7C14ee6A6F35E125EA18D3FFC92";
  // static guid = "{45F3F7C1-A6F3-4EE6-A15E-125E92FC3F8D}";
  _selectedIndex: number = -1;
  _contentPanel: HTMLDivElement = document.createElement("div");
  _slider: Slider = new Slider();

  getElTag(): string {
    return "group";
  }

  init() {
    super.init();
    UI_ROOT.playlist.on("trackchange", this.refresh);
    this._contentPanel.addEventListener("scroll", this._contentScrolled);
    this.refresh();
  }

  _prepareScrollbar() {
    this._slider.setXmlAttributes({
      orientation: "v",
      x: "-10",
      relatx: "1",
      y: "0",
      w: "8",
      h: "0",
      relath: "1",
    });
    this._slider.setThumbSize(8, 18);
    const sliderHandler = new PlaylistScrollActionHandler(this._slider, this);
    this._slider.setActionHandler(sliderHandler);
    this._slider.getDiv().classList.add("scrollbar");
    // this._slider.draw();
    this.addChild(this._slider);
  }

  _contentScrolled = () => {
    const list = this._contentPanel;
    const newPercent = list.scrollTop / (list.scrollHeight - list.clientHeight);
    this._slider.setposition((1 - newPercent) * 255);
  };

  _scrollTo(percent: number) {
    const list = this._contentPanel;
    const newScrollTop = percent * (list.scrollHeight - list.clientHeight);
    list.scrollTop = newScrollTop;
  }

  // experimental, brutal, just to see reflection of PlayList changes
  refresh = () => {
    removeAllChildNodes(this._contentPanel);
    const pl = UI_ROOT.playlist;
    const currentTrack = pl.getcurrentindex();
    for (let i = 0; i < pl.getnumtracks(); i++) {
      const line = document.createElement("div");
      if (i == currentTrack) {
        line.classList.add("current");
      }
      if (i == this._selectedIndex) {
        line.classList.add("selected");
      }
      line.addEventListener("click", (ev: MouseEvent) => {
        this._selectedIndex = i;
        this.refresh();
      });
      line.addEventListener("dblclick", (ev: MouseEvent) => {
        UI_ROOT.playlist.playtrack(i);
        UI_ROOT.audio.play();
        this.refresh();
      });
      line.textContent = `${i + 1}. ${pl.gettitle(i)}`;
      this._contentPanel.appendChild(line);
    }
  };

  itemClick = () => {};

  draw() {
    this._prepareScrollbar();
    super.draw();
    this._div.appendChild(this._contentPanel);

    this._contentPanel.classList.add("content-list");
    this._div.setAttribute("tabindex", "0");
    this._div.classList.add("pl");
    this._div.classList.add("list");
    this._div.style.pointerEvents = "auto";
  }
}

class PlaylistScrollActionHandler extends ActionHandler {
  _pl: PlayListGui;
  _scrolling: boolean = false;

  constructor(slider: Slider, pl: PlayListGui) {
    super(slider);
    this._pl = pl;
  }

  onLeftMouseDown(x: number, y: number): void {
    this._scrolling = true;
  }
  onLeftMouseUp(x: number, y: number): void {
    this._scrolling = false;
  }

  onsetposition(position: number): void {
    if (this._scrolling) {
      this._pl._scrollTo(1 - position / 255);
    }
  }
}
