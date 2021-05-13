// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { loadImage, readJsonFile } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js";
import { TiledImage, TileSet } from "../obj/canvasTile.js";

console.log("Hello from scene!");

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        let level = readJsonFile("../tile/assets/level.json");
        let img = await loadImage("../tile/assets/tiles.png");
        
        let tileset = new TileSet(img, 16, 16);
        let background = new TiledImage(level.map, tileset);

        console.log(background.canvas.toDataURL());
        
        let local = new GameObject();
        local.draw = function(ctx){
            ctx.drawImage(background.canvas, 0, 0, 20*32, 20*32);
        }

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}