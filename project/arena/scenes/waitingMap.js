// engine imports
import { input, canvas, viewFrame } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { TiledImage, TileSet } from "../../../engine/src/graphics.js";
import { Coord, loadImage, readJsonFile} from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js"
import { Creature } from "../scripts/creature.js";

export var scene = {
    "init": init,
    "destroy": destroy
}

/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        // load config
        let levelData = readJsonFile("../arena/assets/waitingArea.json");

        // create map
        var tileImage = await loadImage("../arena/assets/waitingArea.png");
        var tileset = new TileSet(tileImage, env.tileSize, env.tileSize);
        let map = new TiledImage(levelData.map, tileset);
        viewFrame.initialize(map.canvas.width, map.canvas.height, true);
        viewFrame.setTarget(new Coord(map.canvas.width/2, map.canvas.height/2));

        // create creatures
        var spriteImage = await loadImage("../arena/assets/knight.png");
        var spriteTiles = new TileSet(spriteImage, env.tileSize, env.tileSize);
        
        let pc = new Creature(6, 6, spriteTiles.toAnimationList(), viewFrame);
        let npc = new Creature(5, 3, spriteTiles.toAnimationList())

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
        }

        objectRegister.buildRenderList();
        resolve();
    });
}

/* Deregister GameObjects here. You can use objectRegister.reset() to 
*/  
function destroy() { }