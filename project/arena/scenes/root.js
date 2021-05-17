// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"

// project imports
import { environment as env } from "../environment.js"
import { scene as waitingMap } from "./waitingMap.js"

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        waitingMap.init();

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {
    objectRegister.reset();
}

console.log("Hello from root!");