import { EventEmitter } from "../../../engine/src/utils.js";
import { canvas } from "../../../engine/main.js";


export class InterfaceTile{

    constructor(x, y, w, h, enableEvents=false){
        this.xOffset = x;
        this.yOffset = y;
        this.screenX = 0;
        this.screenY = 0;
        this.w = w;
        this.h = h;

        this.image = image;
        this.parent = null;
        this.children = [];

        this.events = null;
        if(enableEvents){
            this.initializeEvents();
        }
    }


    /*  x,y is the calculated screen position of parent, so that 
        child can calculate their own screen position 
    */
    draw(x, y, ctx){
        this.screenX = x + this.xOffset;
        this.screenY = y + this.yOffset;
        ctx.drawImage(this.image, screenX, screenY);
        this.children.forEach(child=>{child.draw(screenX, screenY, ctx)});
    }

    attachToParent(parent){
        this.parent = parent;
        parent.children.push(this);
    }

    initializeEvents(){
        this.events = new EventEmitter();
        canvas.addEventListener("mousedown", event=>{
            var mx = event.clientX - canvas.offsetLeft;
            var my = event.clientY - canvas.offsetTop;
            if(this.mouseIsOver(mx, my)){
                this.events.trigger("clicked", null);
            }
        });
        this.gameCanvas.addEventListener('mousemove', event => {
            var mx = event.clientX - canvas.offsetLeft;
            var my = event.clientY - canvas.offsetTop;
            if(this.mouseIsOver(mx, my)){
                this.events.trigger("mouseover", null);
            }
        });
    }

    mouseIsOver(mx, my){
        return this.screenX <= mx && mx <= this.screenX + this.w && this.screenY <= my && my <= this.screenY + this.h
    }

}