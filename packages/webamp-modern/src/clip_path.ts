import { Edges } from "./skin/Clippath";

document.getElementById("clickable").onclick = (ev) => {
  alert("click on green!");
};
document.getElementById("img1").onclick = (event) => {
  alert("click on IMAGE.");
  event.stopPropagation();
};

function prepareGrid() {
  const grid = document.getElementById("grid");
  const img = document.getElementById("result") as HTMLImageElement;
  const canvas: HTMLCanvasElement = document.getElementById(
    "working"
  ) as HTMLCanvasElement;
  canvas.width = 10;
  canvas.height = 10;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ff00ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (var i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.setAttribute("id", `${i}`);

    div.addEventListener("click", (e: MouseEvent) => {
      const el = e.target as HTMLDivElement;
      var color: number;
      if (el.classList.contains("black")) {
        el.classList.remove("black");
        color = 0;
      } else {
        el.classList.add("black");
        color = 255;
      }
      const id = parseInt(el.getAttribute("id"));
      const x: number = id % 10;
      const y: number = Math.floor(id / 10);
      const idata = ctx.createImageData(1, 1);
      const data = idata.data;
      data[0] = color;
      data[1] = color;
      data[2] = color;
      data[3] = 255;
      ctx.putImageData(idata, x, y);
      
      // const urlData = ctx.getImageData(0,0,canvas.width, canvas.height)
      img.setAttribute("src", canvas.toDataURL());
    });
    grid.appendChild(div);
  }
  
  img.setAttribute("src", canvas.toDataURL());
}

function main() {
  prepareGrid();

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
