import { canvas } from "../main.js";
import { GameObject } from "./gameObject.js";
import { Coord, rectangleContains, rectanglesIntersect } from "./utils.js";

export class ViewFrame extends GameObject{
    
    /*  worldPosition: the x/y of the frames top left corner, measured in pixels.
        enforceBoundary: whether or no the "camera" should continue to move beyond the map boundaries.
        noBoundary: if map is smaller than canvas, boundaries cannot be enforced.
        boundary: the bounding rectangle. Viewframes worldPosition position cannot be outside.
    */
    constructor(){
        super();
        this.worldPosition = new Coord(0, 0);
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
        this.worldPosition.x = x;
        this.worldPosition.y = y;
    }

    drawImage(image, x, y, ctx){
        var v1 = {"x": this.worldPosition.x, "y": this.worldPosition.y};
        var v2 = {"x": this.worldPosition.x + canvas.width, "y": this.worldPosition.y + canvas.height};
        var i1 = {"x": x, "y": y};
        var i2 = {"x": x + image.width, "y": y + image.height};

        var renderStrategy = "?";

        if(rectangleContains(v1, v2, i1, i2)){
            // image is fully in frame
            renderStrategy = "subtractView";
            ctx.drawImage(image, x - this.worldPosition.x, y - this.worldPosition.y);
        }else if(rectangleContains(i1, i2, v1, v2)){
            // frame is fully in image
            renderStrategy = "sliceInterior";
            ctx.drawImage(image, this.worldPosition.x, this.worldPosition.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        } else if(rectanglesIntersect(v1, v2, i1, i2)){
            // image and frame partially intersect
            renderStrategy = "sliceExterior";
            var sx;
            var sy;
            var sw;
            var sh;
            if(i1.x <= v1.x && v1.x <= i2.x){
                sx = v1.x - i1.x
                sw = i2.x - v1.x;
                x = 0;
            }else if(v1.x <= i1.x && i1.x <= v2.x){
                sx = 0;
                sw = v2.x - i1.x;
                x = i1.x - v1.x;
            }
            if(v1.y < i1.y && i1.y < v2.y){
                sy = v1.y - i1.y;
                sh = i2.y - v1.y;
                y = 0;
            }
            else if(v1.y <= i2.y && i2.y <= v2.y){
                sy = v1.y - i1.y;
                sh = i2.y - v1.y;
                y = 0;
            }
            ctx.drawImage(image, sx, sy, sw, sh, x, y, sw, sh);
        }
    }

}