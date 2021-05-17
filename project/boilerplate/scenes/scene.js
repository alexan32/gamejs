// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { canvas } from "../../../engine/main.js"

// project imports
import { environment as env } from "../environment.js"

export var scene = {
    "init": init,
    "destroy": destroy
}


/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        objectRegister.buildRenderList();
        resolve();
    });
}

/* Deregister GameObjects here
*/
function destroy() { }