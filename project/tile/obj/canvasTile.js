import { GameObject } from "../../../engine/src/gameObject.js";

/*  A TileSet is a canvas that holds an image meant to be broken up into
    subregions with a width of tileW and a height of tileH
*/  
export class TileSet{

    /*  source: canvas or image
        tileW: pixel width of tile at 1:1 zoom
        tileH: pixel hieght of tile at 1:1 zoom
    */
    constructor(sourceImage, tileW, tileH){
        this.sourceImage = sourceImage;
        this.tileW = tileW;
        this.tileH = tileH;
        this.numColumns = sourceImage.width/tileW;
        this.numRows = sourceImage.height/tileH
        this.numTiles = this.numColumns * this.numRows;
        this.tiles = [];

        for(let i=0; i<this.numTiles; i++){
            this.tiles.push(this.buildTile(i));
        }
    }

    getTile(i){
        return this.tiles[i];
    }

    /*  Returns a canvas containing a subregion of the TileSets canvas.
        index: number used to indicate which region to retrieve.
    */
    buildTile(index){
        var imgRow = Math.floor(index / this.numColumns) | 0;
        var imgCol = (index % (this.sourceImage.width / this.tileW)) | 0;
        // console.log(`index: ${index}, imgRow: ${imgRow}, imgCol: ${imgCol}`)
        
        var sx = imgCol * this.tileW;
        var sy = imgRow * this.tileH;

        var cnvs = document.createElement("canvas");
        cnvs.width = this.tileW;
        cnvs.height = this.tileH;
        var ctx = cnvs.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.sourceImage, sx, sy, this.tileW, this.tileH, 0, 0, this.tileW, this.tileH);
        return cnvs;
    }

}


/*  A TileImage is a composite canvas made by using a 
    2d Array to retrieve sections from a TileSet and 
    arranging them on a new canvas
*/
export class TiledImage{

    /*  map: 2d array of numbers. Each number refers to a tile in the tileset
        tileset: Tileset object
    */
    constructor(map, tileset){
        var cnvs = document.createElement("canvas");
        cnvs.width = map[0].length * tileset.tileW;
        cnvs.height = map.length * tileset.tileH;
        this.canvas = cnvs;
        var ctx = this.canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        this.ctx = ctx;
        this.buildImage(map, tileset);
    }

    /*  Instead of using object values, entering parameters will allow you to
        overlap the initially created canvas with other maps and tilesets, allowing you 
        to generate a layered image.
        map: 2d array of numbers, each refering to a tile in the tileset.
        tileset: Tileset object
        skip: Array of numbers. if a number from the map is in the skip array, its tile
        will not be drawn to the canvas.
    */  
    buildImage(map, tileset, skip=[]){

        for(var y=0; y<map.length; y++){
            for(var x=0; x<map[y].length; x++){
                if(skip.indexOf(map[y][x]) === -1){
                    var tile = tileset.getTile(map[y][x]);
                    this.ctx.drawImage(tile, x*tileset.tileW, y*tileset.tileH, tileset.tileW, tileset.tileH);
                }
            }
        }
    }

}


/*  An animation is series of frames that are rendered in succession. 
*/
export class SpriteAnimation{

    constructor(frames=[], oscillate=false){
        this.frames = frames;
        this.timePassed = 0;
        this.currentFrame = 0;
        this.oscillate = oscillate;
        this.increment = 1;
        this.frameRate = 100;
    }

    update(dt){
        this.timePassed += dt * 1000;
        if(this.timePassed >= this.frameRate){
            this.incrementFrame();
        }
    }

    incrementFrame(){
        this.currentFrame += this.increment;
        if(this.oscillate && (this.currentFrame == this.frames.length - 1 || this.currentFrame == 0)){
            this.increment *= -1;
        }else if(this.currentFrame >= this.frames.length){
            this.currentFrame = 0;
        }
        this.timePassed = 0;
    }

    getCurrentFrame(){
        return this.frames[this.currentFrame];
    }

    setFrame(i){
        this.currentFrame = i;
        this.timePassed = 0;
        this.increment = 1;
    }

}