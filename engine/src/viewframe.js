import { canvas } from "../main.js";
import { GameObject } from "./gameObject.js";
import { Coord, rectangleContains, rectanglesIntersect } from "./utils.js";

export class ViewFrame extends GameObject{
    
    /*  world: the x/y of the frames top left corner, measured in pixels.
        enforceBoundary: whether or no the "camera" should continue to move beyond the map boundaries.
        noBoundary: if map is smaller than canvas, boundaries cannot be enforced.
        boundary: the bounding rectangle. Viewframes world position cannot be outside.
    */
    constructor(){
        super();
        this.world = new Coord(0, 0);
        this.target = null;
        this.initialized = false;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    initialize(mapWidthInPixels, mapHeightInPixels, enforceBoundary=false){
        this.enforceBoundary = enforceBoundary;
        this.noBoundaryX = canvas.width > mapWidthInPixels;
        this.noBoundaryY = canvas.height > mapHeightInPixels;
        this.boundary = {
            x: 0,
            y: 0,
            w: mapWidthInPixels - canvas.width,
            h: mapHeightInPixels - canvas.height
        };
    }

    update(dt){
        if(this.target != null){
            this.centerOnPosition(this.target.x + this.xOffset, this.target.y + this.yOffset);
        }
    }

    setTarget(target, xOffset=0, yOffset=0){
        this.target = target;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
    }

    centerOnPosition(x, y){
        // find the viewFrame top left relative to x, y
        x -= Math.floor(0.5 * canvas.width);
        y -= Math.floor(0.5 * canvas.height); 
        // perform boundary check
        if(!this.noBoundaryX && this.enforceBoundary){
            x = (x < this.boundary.x) ? this.boundary.x : x;
            x = (x > this.boundary.w) ? this.boundary.w : x;
        }
        if(!this.noBoundaryY && this.enforceBoundary){
            y = (y < this.boundary.y) ? this.boundary.y : y;
            y = (y > this.boundary.h) ? this.boundary.h : y;
        }
        // set position
        this.world.x = x;
        this.world.y = y;
    }

    drawImage(image, x, y, ctx){
        var v1 = {"x": this.world.x, "y": this.world.y};
        var v2 = {"x": this.world.x + canvas.width, "y": this.world.y + canvas.height};
        var i1 = {"x": x, "y": y};
        var i2 = {"x": x + image.width, "y": y + image.height};

        // image rectangle is ___ of view rectangle
        var left = v2.x <= i1.x;
        var right = i2.x <= v1.x;
        var above = v2.x <= i1.y;
        var below = v1.y <= i2.y;

        if(rectangleContains(v1, v2, i1, i2)){
            // image is fully in frame
            ctx.drawImage(image, x - this.world.x, y - this.world.y);
        }else if(rectangleContains(i1, i2, v1, v2)){
            // frame is fully in image
            ctx.drawImage(image, this.world.x, this.world.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        } else {
            var sx;
            var sy;
            var sw;
            var sh;
            if(v1.x < i1.x && i1.x < v2.x){
                sx = 0;
                sw = i2.x - v2.x;
            }else if(v1.x < i2.x && i2.x < v2.x){
                sx = Math.abs(v1.x - i1.x);
                sw = i2.x - v1.x;
                console.log(sx, sw)
            }
            if(v1.y < i1.y && i1.y < v2.y){
                sy = 0;
                sh = v2.y - i1.y;
            }
            else if(v1.y < i2.y && i2.y < v2.y){
                sy = Math.abs(v1.y - i1.y);
                sh = i2.y - v1.y;
            }
            ctx.drawImage(image, sx, sy, sw, sh, x - this.world.x, y - this.world.y, sw, sh);
        }
    }

    contains(v1, v2, i1, i2){

    }

}