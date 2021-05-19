import { EventEmitter } from "../../../engine/src/utils.js";
import { viewFrame, canvas, input} from "../../../engine/main.js";
import { MouseDetector } from "../../../engine/src/input.js";


export class InterfaceTile{

    constructor(image, xOffset, yOffset, w, h, id=null){
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.w = w;
        this.h = h;
        this.screenX = 0;
        this.screenY = 0;
        this.id = id;

        // this.mouseDetector = new MouseDetector(0, 0, w, h, input);
        this.events = new EventEmitter();
        input.events.on("mousedown", this.onMouseDown);
        input.events.on("mouseup", this.onMouseUp);
        input.events.on("mousemove", this.onMouseMove);
        input.events.on("mouseheld", this.onMouseHeld);

        this.image = image;
        this.parent = null;
        this.children = [];
        this.initialDraw = true;
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
        if(this.screenX <= event.x && this.screenY <= event.y && this.screenX + this.w >=event.x && this.screenY + this.h >= event.y)
            this.events.trigger("mousedown", event);
    }

    onMouseUp(event){
        if(this.screenX <= event.x && this.screenY <= event.y && this.screenX + this.w >=event.x && this.screenY + this.h >= event.y)
            this.events.trigger("mouseup", event);
    }

    onMouseMove(event){
        if(this.screenX <= event.x && this.screenY <= event.y && this.screenX + this.w >=event.x && this.screenY + this.h >= event.y)
            this.events.trigger("mousedown", event);
    }

    onMouseHeld(event){
        if(this.screenX <= event.x && this.screenY <= event.y && this.screenX + this.w >=event.x && this.screenY + this.h >= event.y)
            this.events.trigger("mouseheld", event);
    }

    destroy(){
        input.events.removeCallback("mousedown", this.onMouseDown);
        input.events.removeCallback("mouseup", this.onMouseUp);
        input.events.removeCallback("mousemove", this.onMouseMove);
        input.events.removeCallback("mouseheld", this.onMouseHeld);
    }

}