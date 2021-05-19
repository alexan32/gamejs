import { EventEmitter } from "../../../engine/src/utils.js";
import { viewFrame, canvas} from "../../../engine/main.js";


export class InterfaceTile{

    constructor(image, xOffset, yOffset, w, h, id=null){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.w = w;
        this.h = h;
        this.screenX = 0;
        this.screenY = 0;
        this.id = id;

        this.image = image;
        this.parent = null;
        this.children = [];
    }


    /*  x,y is the calculated screen position of parent, so that 
        child can calculate their own screen position 
    */
    draw(ctx, x, y){
        this.screenX = x + this.xOffset;
        this.screenY = y + this.yOffset;
        ctx.drawImage(this.image, this.screenX, this.screenY, this.w, this.h);

        this.children.forEach(child=>{child.draw(ctx, this.screenX, this.screenY)});
    }

    setParent(parent){
        this.parent = parent;
        parent.children.push(this);
    }

}