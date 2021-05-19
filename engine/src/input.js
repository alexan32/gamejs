import { EventEmitter } from "./utils.js";

export class Input{

    /*  Provides solution for common input needs. To customize behavior, 
        replace the default behavior, overwrite the setEventBehavior() function.

        Default Events:
        - noKeyInput: fires when there is no keyboard buttons being pressed.
        - noDirectionalInput: fires when there are no wasd or arrow keys pressed.
    */

    constructor(canvas){
        this.gameCanvas = canvas;
        this.pressed = {};
        this.directional = {};
        this.mouse = {
            x: 0,
            y: 0,
            down: false,
            held: false
        };
        this.events = new EventEmitter();
        this.setEventBehavior();
        this.heldTimeout = null;
    }

    // overwrite to set create custom input behavior.
    setEventBehavior(){
        this.gameCanvas.addEventListener("keydown", event =>{
            this.pressed[event.code] = true;
            if(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) != -1){
                this.directional[event.code] = true;
            }
        });
        this.gameCanvas.addEventListener("keyup", event =>{
            delete this.pressed[event.code];
            if(Object.keys(this.pressed).length === 0){
                this.events.trigger("noKeyInput");
            }
            if(this.directional.hasOwnProperty(event.code)){
                delete this.directional[event.code];
                if(Object.keys(this.directional).length === 0){
                    this.events.trigger("noDirectionalInput");
                }
            }
        });

        this.gameCanvas.addEventListener('mousemove', event => this.onMousemove(event));
        this.gameCanvas.addEventListener('mouseup', event => this.onMouseup());
        this.gameCanvas.addEventListener('mousedown', event => this.onMousedown());
    }

    onMousemove(event){
        var x = event.clientX - this.gameCanvas.offsetLeft;
        var y = event.clientY - this.gameCanvas.offsetTop;
        this.mouse.x = x;
        this.mouse.y = y;
        this.events.trigger("mousemove", this.mouse);
    }

    onMousedown(){
        this.mouse.down = true;
        this.events.trigger("mousedown", this.mouse);
        this.heldTimeout = setTimeout(()=>{this.onMouseHeld(this.mouse)}, 500);
    }

    onMouseup(){
        this.mouse.down = false;
        this.mouse.held = false;
        this.events.trigger("mouseup", this.mouse);
        clearTimeout(this.heldTimeout);
    }

    onMouseHeld(mouse){
        mouse.held = true;
        this.events.trigger("mouseheld", this.mouse);
    }

}


/*  Use this object to filter out mouse events for a 
    subregion of the canvas. mouse detector events will only
    trigger when a mouse event occurs within a subregion of
    the canvas.
*/
export class MouseDetector{

    constructor(x, y, w, h, input){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.events = new EventEmitter();
        this.input = input;
        input.events.on("mousedown", this.onMouseDown);
        input.events.on("mouseup", this.onMouseUp);
        input.events.on("mousemove", this.onMouseMove);
        input.events.on("mouseheld", this.onMouseHeld);
        // this.inBounds = (event)=>{
        //     return this.x <= event.x && this.y <= event.y && this.x + this.w >=event.x && this.y + this.h >= event.y;
        // }
    }

    onMouseDown(event){
        if(this.x <= event.x && this.y <= event.y && this.x + this.w >=event.x && this.y + this.h >= event.y)
            this.events.trigger("mousedown", event);
    }

    onMouseUp(event){
        if(this.x <= event.x && this.y <= event.y && this.x + this.w >=event.x && this.y + this.h >= event.y)
            this.events.trigger("mouseup", event);
    }

    onMouseMove(event){
        if(this.x <= event.x && this.y <= event.y && this.x + this.w >=event.x && this.y + this.h >= event.y)
            this.events.trigger("mousedown", event);
    }

    onMouseHeld(event){
        if(this.x <= event.x && this.y <= event.y && this.x + this.w >=event.x && this.y + this.h >= event.y)
            this.events.trigger("mouseheld", event);
    }

    destroy(){
        this.input.events.removeCallback("mousedown", this.onMouseDown);
        this.input.events.removeCallback("mouseup", this.onMouseUp);
        this.input.events.removeCallback("mousemove", this.onMouseMove);
        this.input.events.removeCallback("mouseheld", this.onMouseHeld);
    }

}