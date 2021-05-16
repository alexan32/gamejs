/*  A scene is a script that initialized game objects. It has an init and destroy function.
    The Init function returns a promise that resolves when all of the game objects have been
    initialized. The destroy function should be used to deregister game objects and perform
    cleanup.
*/

// engine imports
import { input } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { TiledImage, TileSet } from "../../../engine/src/graphics.js";
import { loadImage, readJsonFile } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js"
import { Creature } from "../scripts/creature.js";


window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // load config
        let levelData = readJsonFile("../arena/assets/waitingArea.json");

        // create map
        var tileImage = await loadImage("../arena/assets/waitingArea.png");
        var tileset = new TileSet(tileImage, env.tileSize, env.tileSize);
        let map = new TiledImage(levelData.map, tileset);


        // create creatures
        var spriteImage = await loadImage("../arena/assets/knight.png");
        var spriteTiles = new TileSet(spriteImage, env.tileSize, env.tileSize);
        let pc = new Creature(6, 6, spriteTiles.toAnimationList());

        // create local game object
        let local = new GameObject();
        local.renderLayer = env.mapLayer;
        local.draw = (ctx)=>{
            ctx.drawImage(map.canvas, 0, 0);
        }
        local.update=(dt)=>{
            if(Object.keys(input.directional).length > 0 && pc.arrived()){
                var x = 0;
                var y = 0;
                if("KeyA" in input.directional){
                    x -= 1;
                }
                if("KeyD" in input.directional){
                    x += 1;
                }
                if("KeyW" in input.directional){
                    y -= 1;
                }
                if("KeyS" in input.directional){
                    y += 1;
                }
                pc.setTargetPosition(pc.position.x + x, pc.position.y + y);
            }
        }



        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {
    objectRegister.reset();
}

console.log("Hello from root!");