import { GameObject } from "../../../engine/src/gameObject";
import { Coord } from "../../../engine/src/utils";


export class InterfaceTile{

    constructor(x, y, w, h){
        this.xOffset = x;
        this.yOffset = y;
        this.w = w;
        this.h = h;
        this.image = image;
        this.parent = null;
        this.children = [];
    }

    /*  tile position is stored relative to parent.
        getPosition works up tile tree to root, which has
        an on screen position, and calculates the on screen 
        position of the tile using that. 
    */
    getPosition(){

    }

    draw(ctx){
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    drawChildren(){

    }

    attachToParent(parent){
        this.parent = parent;
        parent.children.push(this);
    }

}