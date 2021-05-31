// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { input } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js";
import { loadImage, readJsonFile } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js";
import { TiledImage, TileSet, SpriteAnimation } from "../obj/canvasTile.js";
import { buildCreatureAnimations } from "../obj/entity.js";
import { scene2 } from "./scene2.js";

console.log("Hello from scene!");

window.scene = {
    "init": init,
    "destroy": destroy
};

let local;

function init() {
    return new Promise(async resolve => {

        // let level = readJsonFile("../animation/assets/level.json");
        // let img = await loadImage("../animation/assets/tiles.png");
        // let sheet = await loadImage("../animation/assets/knight.png");

        // let tileset = new TileSet(img, 16, 16);
        // let background = new TiledImage(level.map, tileset);

        let spriteImage = await loadImage("../animation/assets/image/knight.png");
        let spritesheet = new TileSet(spriteImage, 32, 32);
        let animations = buildCreatureAnimations(spritesheet);
        let index = 0;

        var animation = animations[0];
        // animation.frameRate = 300;
        animation.playInLoop();

        setInterval(()=>{
            index = index == 11 ? 0 : index + 1;
            animation = animations[index];
            animation.playInLoop();
        }, 2000)
        
        local = new GameObject();
        local.update = (dt)=>{
            if("KeyE" in input.pressed){
                animation.stop();
            }
            if("KeyR" in input.pressed){
                animation.playOnce();
            }
            if("KeyT" in input.pressed){
                window.scene.destroy();
                window.scene = scene2;
                window.scene.init();
            }
            animation.update(dt);
        }
        local.draw = (ctx)=>{
            ctx.drawImage(animation.getCurrentFrame(), 32, 32);
        }


        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() { 
    objectRegister.reset();
    console.log("ugh! I've been killed!");
}