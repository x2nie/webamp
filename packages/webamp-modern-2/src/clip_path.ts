import { Edges } from "./skin/Clippath";

function main(){
    const oriImg = document.getElementById("img1");
    const img2 = new Image()
    img2.onload = (ev) =>{
        const canvas = document.createElement('canvas');
        canvas.width = img2.width;
        canvas.height = img2.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img2, 0,0)
        const edge = new Edges();
        edge.parseCanvasTransparency(canvas);
        document.getElementById('top').textContent = edge.top;
    }
    img2.setAttribute('src', oriImg.getAttribute('src'))
    
}

main()