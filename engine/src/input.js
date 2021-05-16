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
            down: false
        };
        this.events = new EventEmitter();
        this.setEventBehavior();
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
        window.addEventListener('mouseup', event => this.onMouseup(event));
        window.addEventListener('mousedown', event => this.onMousedown(event));
    }

    onMousemove(event){
        this.mouse.x = event.clientX - this.gameCanvas.offsetLeft;
        this.mouse.y = event.clientY - this.gameCanvas.offsetTop;
    }

    onMousedown(event){
        this.mouse.down = true;
    }

    onMouseup(event){
        this.mouse.down = false;
    }

}