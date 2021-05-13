
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
        this.numTiles = this.numColumns * (sourceImage.height/tileH);
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
        this.ctx = this.canvas.getContext("2d");
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


//prevents view from moving off the map
export var ViewFrame = {

    boundary: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    },
    //top left pixel coords of view
    position: {
        x: 0,
        y: 0
    },
    xMin: null,
    xMax: null,
    yMin: null,
    yMax: null,
    targetObject: null,

    //mapWidth & mapHeight measured in tiles
    setBoundary: function(mapWidth, mapHeight){
        console.log("init ViewFrame with mapWidth:", mapWidth, " and mapHeight: ", mapHeight);
        this.boundary.right = (mapWidth * env.tileSize) - env.viewWidth;
        this.boundary.bottom = (mapHeight * env.tileSize) - env.viewHeight;
        console.log(this.boundary);
    },

    centerOnCoords: function(posX, posY){
        this.position = this.sanitize(posX + 0.5*env.tileSize - 0.5*env.viewWidth, posY + 0.5*env.tileSize - 0.5*env.viewHeight);
    },

    //check boundaries, prevent float graphical bugs
    sanitize: function(posX, posY){
        if(posX < this.boundary.left){
            posX = this.boundary.left;
        }else if(posX > this.boundary.right){
            posX = this.boundary.right;
        }
        if(posY < this.boundary.top){
            posY = this.boundary.top;
        }else if(posY > this.boundary.bottom){
            posY = this.boundary.bottom;
        }
        return {x: Math.floor(posX), y: Math.floor(posY)};
    },

    update(delta){
        if(this.targetObject){
            let {x, y} = this.targetObject.getPixelCoords();
            this.centerOnCoords(x, y);
        }
        this.xMin = Math.floor(this.position.x / env.tileSize);
        this.xMax = this.xMin + env.viewWidth / env.tileSize;
        this.yMin = Math.floor(this.position.y / env.tileSize);
        this.yMax = this.yMin + env.viewHeight / env.tileSize;
    },

    setTargetObject(x){
        this.targetObject = x;
    }
}