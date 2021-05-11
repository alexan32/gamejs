// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"

// project imports
import { environment as env } from "../environment.js"

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // register GameObjects here

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}