/*  A scene is a script that initialized game objects. It has an init and destroy function.
    The Init function returns a promise that resolves when all of the game objects have been
    initialized. The destroy function should be used to deregister game objects and perform
    cleanup.
*/

// engine imports
import { input, canvas, viewFrame } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { TiledImage, TileSet } from "../../../engine/src/graphics.js";
import { loadImage, readJsonFile, rectanglesIntersect } from "../../../engine/src/utils.js";

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

        viewFrame.initialize(map.canvas.width, map.canvas.height, true);

        // create creatures
        var spriteImage = await loadImage("../arena/assets/knight.png");
        var spriteTiles = new TileSet(spriteImage, env.tileSize, env.tileSize);
        let pc = new Creature(6, 6, spriteTiles.toAnimationList(), viewFrame);
        pc.events.on("clicked", event=>{console.log(event)});
        viewFrame.setTarget(pc.screenPosition, env.tileSize/2, env.tileSize/2);

        // create local game object
        let local = new GameObject();
        local.renderLayer = env.mapLayer;
        local.draw = (ctx)=>{
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // ctx.drawImage(map.canvas, 0 + viewFrame.world.x, 0 + viewFrame.world.y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
            viewFrame.drawImage(map.canvas, 0, 0, ctx);
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
            var v1 = {"x": viewFrame.world.x, "y": viewFrame.world.y};
            var v2 = {"x": viewFrame.world.x + canvas.width, "y": viewFrame.world.y + canvas.height};
            var i1 = {"x": 0, "y": 0};
            var i2 = {"x": map.canvas.width, "y": map.canvas.height};
            document.getElementById("debug").innerText = `
                v1: ${v1.x} ${v1.y}
                v2: ${v2.x} ${v2.y}
                i1: ${i1.x} ${i1.y}
                i2: ${i2.x} ${i2.y}
                intersect? ${rectanglesIntersect(v1, v2, i1, i2)}
            `;
        }



        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {
    objectRegister.reset();
}

console.log("Hello from root!");