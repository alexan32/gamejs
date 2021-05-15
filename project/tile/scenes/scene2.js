// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js";
// project imports
import { environment as env } from "../environment.js"

export var scene2 = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // register GameObjects here
        console.log("Perish brother!");

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}