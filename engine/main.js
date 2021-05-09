// move to config file
import { objectRegister } from "./src/gameObject.js";
import { Input } from "./src/input.js";

export let canvas = document.getElementById("gameScreen");
export let input = new Input(canvas);

let ctx;
let deltaTime;
let oldTimeStamp;
window.scene = null;
window.onload = init();

console.log("Hello from engine!");

function gameLoop(timeStamp){
    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    update(deltaTime);
    draw(ctx);

    window.requestAnimationFrame(gameLoop);
};


function update(dt){
    for (var key in objectRegister.objects){
        if(objectRegister.objects.hasOwnProperty(key)){
            objectRegister.objects[key].update(dt);
        }
    }
}


function draw(ctx){
    ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
    for(let i=0; i<objectRegister.renderList.length; i++){
        objectRegister.renderList[i].draw(ctx);
    }
}


async function init(){
    ctx = canvas.getContext('2d');      

    input = new Input(canvas);

    canvas.addEventListener("click", start);
    console.info("Engine init complete. Waiting for interaction.");
};

async function start(){
    canvas.removeEventListener("click", start);

    console.info("loading root scene");
    await window.scene.init();
    console.info("done");

    console.info("starting game loop");
    window.requestAnimationFrame(gameLoop);
}

// export class Engine{

//     constructor(width, height){
//         console.log("Hello from engine!");
//         this.ctx = null;
//         this.deltaTime = 0;
//         this.oldTimeStamp = 0;

//         this.width = width;
//         this.height = height;

//         window.onload = this.init();
//     }

//     async init(){
//         canvas.setAttribute("width", this.width);
//         canvas.setAttribute("height", this.height);
//         this.ctx = canvas.getContext('2d'); 
//         canvas.addEventListener("click", this.start);
//         console.info("Engine init complete. Waiting for interaction.");
//     };
    
//     async start(){
//         console.log(this)
//         canvas.removeEventListener("click", this.start);

//         console.info("loading root scene");
//         await window.scene.init();
//         console.info("done");
    
//         console.info("starting game loop");
//         window.requestAnimationFrame(this.gameLoop);
//     };

//     gameLoop(timeStamp){
//         this.deltaTime = (timeStamp - this.oldTimeStamp) / 1000;
//         this.oldTimeStamp = timeStamp;
    
//         this.update(this.deltaTime);
//         this.draw(this.ctx);
    
//         window.requestAnimationFrame(this.gameLoop);
//     };

//     update(dt){
//         for (var key in objectRegister.objects){
//             if(objectRegister.objects.hasOwnProperty(key)){
//                 objectRegister.objects[key].update(dt);
//             }
//         }
//     };

//     draw(ctx){
//         ctx.clearRect(0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"));
//         for(let i=0; i<objectRegister.renderList.length; i++){
//             objectRegister.renderList[i].draw(ctx);
//         }
//     };
// }