import { EventBus } from "../../../engine/src/utils.js";
import {input} from "../../../engine/main.js";


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
        this.initialDraw = true;

        this.events = new EventBus();
        this.subscriptions = {};
        const eventOverTile = (event)=>{
            return (event.x >= this.screenX 
                && event.x <= this.screenX + this.w 
                && event.y >= this.screenY 
                && event.y <= this.screenY + this.h
            )
        }

        this.subscriptions["mousedown"] = input.events.on("mousedown", this.onMouseDown.bind(this), eventOverTile.bind(this));
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

    onMouseDown(event){
        console.log(event);
    }

    destroy(){
        this.subscriptions["mousedown"].unsubscribe();
        this.children.forEach(child=>{
            child.destroy();
        });
    }

}