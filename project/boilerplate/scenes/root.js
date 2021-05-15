/*  A scene is a script that initialized game objects. It has an init and destroy function.
    The Init function returns a promise that resolves when all of the game objects have been
    initialized. The destroy function should be used to deregister game objects and perform
    cleanup.
*/

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"

// project imports
import { environment as env } from "../environment.js"
//import { scene2 } from "./scene2.js";

/*
    export var scene2 = {
        "init": init,
        "destroy": destroy
    }
*/

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

function destroy() {
    objectRegister.reset();
}