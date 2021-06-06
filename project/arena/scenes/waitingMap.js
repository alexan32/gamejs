// engine imports
import { viewFrame } from "../../../engine/main.js";
import { GameObject} from "../../../engine/src/gameObject.js"
import { TiledImage, TileSet } from "../../../engine/src/graphics.js";
import { loadImage, readJsonFile} from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js"
import { Creature } from "../scripts/creature.js";
import { Camera } from "../scripts/camera.js";
import { CollisionMap } from "../scripts/collision.js";
import { Controller } from "../scripts/controller.js";

export var scene = {
    "init": init,
    "destroy": destroy
}

/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        // load config
        let levelData = readJsonFile("../arena/assets/json/waitingArea.json");
        let gameData = readJsonFile("../arena/assets/json/gameData.json");

        // create map
        var tileImage = await loadImage("../arena/assets/image/waitingArea.png");
        var tileset = new TileSet(tileImage, env.tileSize, env.tileSize);
        let map = new TiledImage(levelData.map, tileset);
        let collision = new CollisionMap(levelData.collision, 0, 0);
        
        // game camera
        viewFrame.initialize(map.canvas.width, map.canvas.height, true);
        let camera = new Camera(6, 6);

        // create creatures
        var characterData = gameData.creatures["0"];
        var spriteImage = await loadImage("../arena/assets/image/knight.png");
        var spriteTiles = new TileSet(spriteImage, env.tileSize, env.tileSize);
        
        let pc = new Creature(6, 6, spriteTiles.toAnimationList());
        pc.data = JSON.parse(JSON.stringify(characterData));

        let pc2 = new Creature(6, 7, spriteTiles.toAnimationList());
        pc2.data = JSON.parse(JSON.stringify(characterData));

        let enemy = new Creature(10, 11, spriteTiles.toAnimationList());
        enemy.data = JSON.parse(JSON.stringify(characterData));

        // controller
        let controller = new Controller(camera, collision, [pc, pc2]);
        // controller.startCombat([enemy]);

        // map update
        let local = new GameObject();
        local.renderLayer = env.mapLayer;
        local.draw = (ctx)=>{
            viewFrame.drawImage(map.canvas, 0, 0, ctx);
        }

        resolve();
    });
}

/* Deregister GameObjects here. You can use objectRegister.reset() to 
*/  
function destroy() { }