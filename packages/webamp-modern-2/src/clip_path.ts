import { Edges } from "./skin/Clippath";

document.getElementById('clickable').onclick = ev=>{
    alert('click on green!')
}
document.getElementById('img1').onclick = event=>{
    alert('click on IMAGE.')
    event.stopPropagation()
}

function main(){
    const oriImg = document.getElementById("img1");
    const img2 = new Image()
    img2.onload = (ev) =>{
        // const canvas = document.createElement('canvas');
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        canvas.width = img2.width;
        canvas.height = img2.height;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.drawImage(img2, 0,0)
        const edge = new Edges();
        edge.parseCanvasTransparency(canvas);
        document.getElementById('top').textContent = edge.top;
        document.getElementById('bottom').textContent = edge.bottom;
        document.getElementById('app').style.clipPath = `polygon(${edge.top}, ${edge.bottom})`;
    }
    img2.setAttribute('src', oriImg.getAttribute('src'))
    
}

main()