import { GameObject } from "../../../engine/src/gameObject";

/*  A CanvasTile   
*/
class CanvasTile{

    constructor(w, h){
        this.width = w;
        this.height = h;
        var myCanvas = document.createElement("canvas");
        myCanvas.width = w;
        myCanvas.height = h;
        this.cnvs = myCanvas
        this.cntx = myCanvas.getContext('2d');
    }

}


/*  A TileSet is a canvas that holds an image to be broken up by
    regions with a width of tileW and a height of tileH
*/  
class TileSet{

    /*  source: canvas or image
        tileW: pixel width of tile at 1:1 zoom
        tileH: pixel hieght of tile at 1:1 zoom
    */
    constructor(source, tileW, tileH){
        this.tileW = tileW;
        this.tileH = tileH;
        this.canvas = document.createElement("canvas");
        var ctx = this.canvas.getContext("2d");
        ctx.drawImage()
    }

    getTile(index){
        //use index to calculate the source x and y offset
        var sx = 0;
        var sy = 0;

        var cnvs = document.createElement("canvas");
        cnvs.width = this.tileW;
        cnvs.height = this.tileH;
        var ctx = cnvs.getContext("2d");

        // draw onto new canvas at 
        ctx.drawImage(this.canvas, sx, sy, this.tileW, this.tileH, 0, 0)
    }

}


/*  A TileImage is a composite canvas made by using a 
    2d Array to retrieve sections from a TileSet and 
    arranging them on a new canvas
*/
class TileImage{

}