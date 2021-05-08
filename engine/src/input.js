export class Input{

    constructor(canvas){
        this.gameCanvas = canvas
        this.pressed = {};
        this.mouse = {
            x: 0,
            y: 0,
            down: false
        };
        window.addEventListener("keydown", event =>{
            this.pressed[event.code] = true;
            // console.log(pressed);
        });
        window.addEventListener("keyup", event =>{
            delete this.pressed[event.code];
            // console.log(pressed);
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