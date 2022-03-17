export class Edges {
    top:string = '';
    right:string = '';
    bottom:string = '';
    left:string = '';

    parseCanvasTransparency(canvas: HTMLCanvasElement) {
        const w = canvas.width;
        const h = canvas.height;
        console.log(w,h)
        const ctx = canvas.getContext('2d');
        const points = [];
        const data = ctx.getImageData(0,0,w,h).data;
        var x,y,lastX, lastY; 
        var first:boolean, found:boolean, lastfounded:boolean;

        //? return true if not transparent
        function fine(ax,ay):boolean{
            return data[(ax + (ay * w))*4+3] != 0;
            // return data[(ax + (ay * w))*4+3] == 255;
        }

        function post(ax:number, ay:number) {
            points.push(`${ax}px ${ay}px`)
            // points.push(`x:${ax} y:${ay}`)
        }
        
        //? top -------------------------------------------------
        lastY = 0; first=true;
        for (x = 0; x < w; x++) {       //? scan top, left->right
            found = false;
            for(y = 0; y < h; y++){     //? find most top of non-transparent
                if(fine(x,y)) {
                    found = true;
                    // if(!first && y!= lastY){
                    //     post(lastX, lastY);
                    // }
                    if(first || y!= lastY || x==w-1){
                        first = false;
                        post(x,y);
                        lastY = y;
                    }
                    break;
                }
            }
            if(!found && lastfounded){
                post(lastX, lastY);
            }
            lastX = x;
            lastfounded = found;
        }
        this.top = points.join(', \n')

        //? bottom -------------------------------------------------
        points.splice(0, points.length)
        lastY = h-1; first=true;
        for (x = w-1; x >= 0; x--) {       //? scan bottom, right->left
            for(y = h-1; y >=0; y--){     //? find most top of non-transparent
                if(fine(x,y)) {
                    if(!first && y!= lastY){
                        post(lastX, lastY);
                    }
                    if(first || y!= lastY || x==0){
                        first = false;
                        post(x,y);
                        lastY = y;
                    }
                    break;
                }
            }
            lastX = x;
        }
        this.bottom = points.join(', \n')
    }
}