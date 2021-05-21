import { EventBus } from "./utils.js";

export class Input{

    /*  Provides solution for common input needs. To customize behavior, 
        replace the default behavior, overwrite the setEventBehavior() function.

        Default Events:
        - noKeyInput: fires when there is no keyboard buttons being pressed.
        - noDirectionalInput: fires when there are no wasd or arrow keys pressed.
        - mouseup
        - mousedown
        - mouseheld
        - mousemove
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
        this.events = new EventBus();
        this.setEventBehavior();
        this.heldTimeout = null;
    }

    // overwrite to set create custom input behavior.
    setEventBehavior(){
        window.addEventListener("keydown", event =>{
            this.pressed[event.code] = true;
            if(["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) != -1){
                this.directional[event.code] = true;
            }
        });
        window.addEventListener("keyup", event =>{
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
        this.gameCanvas.addEventListener('mouseup', () => this.onMouseup());
        this.gameCanvas.addEventListener('mousedown', () => this.onMousedown());
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