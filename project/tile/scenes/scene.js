// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { loadImage, readJsonFile } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js";
import { TiledImage, TileSet, SpriteAnimation } from "../obj/canvasTile.js";

console.log("Hello from scene!");

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // let level = readJsonFile("../tile/assets/level.json");
        // let img = await loadImage("../tile/assets/tiles.png");
        let sheet = await loadImage("../tile/assets/knight.png");
        
        // let tileset = new TileSet(img, 16, 16);
        // let background = new TiledImage(level.map, tileset);

        let spritesheet = new TileSet(sheet, 32, 32);
        
        let walkDown = new SpriteAnimation(100);
        walkDown.frames = [
            spritesheet.getTile(0),
            spritesheet.getTile(1),
            spritesheet.getTile(2),
            spritesheet.getTile(3),
            spritesheet.getTile(4)
        ];

        
        let local = new GameObject();
        local.update = function(dt){
            walkDown.update(dt);
        }
        local.draw = function(ctx){
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(walkDown.getCurrentFrame(), 0, 0, 32, 32);
        }

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}