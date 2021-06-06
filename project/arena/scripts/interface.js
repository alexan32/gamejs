import { EventBus } from "../../../engine/src/utils.js";
import { input } from "../../../engine/main.js";
import { GameObject } from "../../../engine/src/gameObject.js";
import { environment as env } from "../environment.js";


export class InterfaceRoot extends GameObject{

    constructor(rootTile){
        super();
        this.rootTile = rootTile;
        this.initialized = false;
        this.renderLayer = env.uiLayer;
    }

    update(dt){}

    draw(ctx){
        if(this.initialized){
            this.rootTile.draw(ctx, 0, 0);
        }
    }

    show(){
        this.rootTile.initialize();
        this.initialized = true;
    }

    hide(){
        this.rootTile.destroy();
        this.initialized = false;
    }

    getTileById(id){
        var targetTile = null;
        var done = false;
        var seen = [this.rootTile];
        while(!done){
            var current = seen.shift()
            if(current){
                if(current.id === id){
                    targetTile = current;
                    break;
                }else{
                    seen.concat(current.children);
                }
            }else{
                done = true;
            }
        }
        return targetTile;
    }

}

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

        this.subscriptions["mousedown"] = input.events.on("mousedown", this.onMouseDown.bind(this), this.eventOverTile.bind(this));
    }

    eventOverTile(event){
        return (event.x >= this.screenX 
            && event.x <= this.screenX + this.w 
            && event.y >= this.screenY 
            && event.y <= this.screenY + this.h
        );
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

    initialize(){
        this.subscriptions["mousedown"] = input.events.on("mousedown", this.onMouseDown.bind(this), this.eventOverTile.bind(this));
        this.children.forEach(child=>{
            child.initialize();
        });
    }

    destroy(){
        this.subscriptions["mousedown"].unsubscribe();
        this.children.forEach(child=>{
            child.destroy();
        });
    }

}