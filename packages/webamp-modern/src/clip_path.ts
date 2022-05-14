import { Edges } from "./skin/Clippath";

document.getElementById("clickable").onclick = (ev) => {
  alert("click on green!");
};
document.getElementById("img1").onclick = (event) => {
  alert("click on IMAGE.");
  event.stopPropagation();
};

const GRIDSIZE = 4;
// const CELLSIZE = 15;
const SCALE = 30; //px

function prepareGrid() {
  const grid = document.getElementById("grid");
  grid.style.width = `${GRIDSIZE * SCALE}px`;
  grid.style.height = `${GRIDSIZE * SCALE}px`;
  grid.style.setProperty("--cell-size", `${SCALE + 1}px`);
  const img = document.getElementById("result") as HTMLImageElement;
  const zoom = document.getElementById("zoom") as HTMLDivElement;
  zoom.style.transform = `scale(${SCALE})`;

  const border = document.getElementById("border") as HTMLDivElement;
  border.style.width = `${GRIDSIZE * SCALE}px`;
  border.style.height = `${GRIDSIZE * SCALE}px`;

  const canvas: HTMLCanvasElement = document.getElementById(
    "working"
  ) as HTMLCanvasElement;
  canvas.width = GRIDSIZE;
  canvas.height = GRIDSIZE;
  canvas.setAttribute("width", String(GRIDSIZE));
  canvas.setAttribute("height", String(GRIDSIZE));
  const ctx = canvas.getContext("2d");

  //? default paint
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

  //? red dot
  const dot = document.getElementById('dot') as HTMLElement;
  const coordinateHover = (e: MouseEvent) => {
    const el = e.target as HTMLDivElement;
    const [x,y] = el.textContent.split(', ').map((v)=> parseInt(v));
    dot.style.left = `${x*SCALE}px`
    dot.style.top = `${y*SCALE}px`
  }

  //? onClick
  const toggleCell = (e: MouseEvent) => {
    const el = e.target as HTMLDivElement;
    var color: number[];
    if (el.classList.contains("black")) {
      el.classList.remove("black");
      color = [255, 0, 255];
    } else {
      el.classList.add("black");
      color = [0, 0, 0];
    }
    const id = parseInt(el.getAttribute("id"));
    const x: number = id % GRIDSIZE;
    const y: number = Math.floor(id / GRIDSIZE);
    const idata = ctx.createImageData(1, 1);
    const data = idata.data;
    data[0] = color[0];
    data[1] = color[1];
    data[2] = color[2];
    data[3] = 255;
    ctx.putImageData(idata, x, y);

    //? IMG
    img.setAttribute("src", canvas.toDataURL());

    //? Coordinates
    const showCoordinates = (el: string, data: string) => {
      const El = document.getElementById(el);
      El.textContent = "";
      const rows = data.replace(/px/gi, "").replace(/\,\s/gi, "\n").replace(/\ /g,', ').split("\n");
      for (const row of rows) {
        const div = document.createElement("div");
        div.textContent = row;
        div.addEventListener('mousemove', coordinateHover)

        El.appendChild(div);
      }
    };

    const edge = new Edges();
    edge.parseCanvasTransparencyByColor(canvas, "#ff00ff");

    showCoordinates('top', edge.gettop());
    showCoordinates('right', edge.getright());
    showCoordinates('bottom', edge.getbottom());
    showCoordinates('left', edge.getleft());

    // document.getElementById("top").textContent = edge
    //   .gettop()
    //   .replace(/px/gi, "")
    //   .replace(/\,\s/gi, "\n");
    // document.getElementById("right").textContent = edge
    //   .getright()
    //   .replace(/px/gi, "")
    //   .replace(/\,\s/gi, "\n");
    // document.getElementById("bottom").textContent = edge
    //   .getbottom()
    //   .replace(/px/gi, "")
    //   .replace(/\,\s/gi, "\n");
    // document.getElementById("left").textContent = edge
    //   .getleft()
    //   .replace(/px/gi, "")
    //   .replace(/\,\s/gi, "\n");

    //? ZOOM
    zoom.style.clipPath = edge.getPolygon();
  }; // eof onClick

  for (var i = 0; i < GRIDSIZE * GRIDSIZE; i++) {
    const div = document.createElement("div");
    div.setAttribute("id", `${i}`);
    div.addEventListener("click", toggleCell);

    grid.appendChild(div);

    const x: number = i % GRIDSIZE;
    const y: number = Math.floor(i / GRIDSIZE);
    if (x == 0 && y == 0) {
      div.classList.add("x-0-axis");
      div.style.setProperty("--0-axis", `'0'`);
    }
    if (y == 0) {
      div.textContent = String(x);
      div.classList.add("x-axis");
      div.style.setProperty("--x-axis", `'${x + 1}'`);
    }
    if (x == 0) {
      div.textContent = String(y);
      div.classList.add("y-axis");
      div.style.setProperty("--y-axis", `'${y}'`);
      if (y == GRIDSIZE - 1) {
        div.classList.add("y-axis-z");
        div.style.setProperty("--y-axis-z", `'${y + 1}'`);
      }
    }

    //debug/default
    if (i < (GRIDSIZE * GRIDSIZE) / 2) {
      //HALF
      div.classList.add("black");
    }
  }

  toggleCell({ target: document.getElementById("1") } as unknown as MouseEvent);
  // img.setAttribute("src", canvas.toDataURL());

  //debug
  // zoom.style.clipPath = `polygon(
  //   0px 0px, 
  //   3px 0px, 
  //   3px 3px, 
  //   0px 3px)`;
}

function main() {
  prepareGrid();
  return;

  const oriImg = document.getElementById("img1");
  const preferedWidth = parseInt(oriImg.getAttribute("data-width"));
  const preferedHeight = parseInt(oriImg.getAttribute("data-height"));
  const img2 = new Image();
  img2.onload = (ev) => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = img2.width;
    canvas.height = img2.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img2, 0, 0);
    const edge = new Edges();
    edge.parseCanvasTransparency(canvas, preferedWidth, preferedHeight);
    document.getElementById("top").textContent = edge
      .gettop()
      .replace(/px/gi, "")
      .replace(/\,\s/gi, "\n");
    document.getElementById("right").textContent = edge
      .getright()
      .replace(/px/gi, "")
      .replace(/\,\s/gi, "\n");
    document.getElementById("bottom").textContent = edge
      .getbottom()
      .replace(/px/gi, "")
      .replace(/\,\s/gi, "\n");
    document.getElementById("left").textContent = edge
      .getleft()
      .replace(/px/gi, "")
      .replace(/\,\s/gi, "\n");
    document.getElementById("app").style.clipPath = edge.getPolygon();
  };
  img2.setAttribute("src", oriImg.getAttribute("src"));
}

main();
