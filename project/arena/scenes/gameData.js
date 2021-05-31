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

function init() {
    return new Promise(async resolve => {

        var data = readJsonFile("../arena/assets/json/gameData.json");

        const portraitImage = await loadImage("../arena/assets/image/portraits.png");
        data['portraits'] = new TileSet(portraitImage, env.portraitWidth, env.portraitHeight);

        window.gameData = data;

        // objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {
    // objectRegister.reset();
}
