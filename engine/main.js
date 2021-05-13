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

    console.info("loading root scene", window.scene);
    await window.scene.init();
    console.info("done");

    console.info("starting game loop");
    window.requestAnimationFrame(gameLoop);
}