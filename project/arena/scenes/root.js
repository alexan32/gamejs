// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js";
import { canvas } from "../../../engine/main.js";

// project imports
import { scene as gameData } from "./gameData.js";
import { scene as ui } from "./uitest.js";
import { scene as waitingMap } from "./waitingMap.js";

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        await gameData.init();
        // await ui.init();
        await waitingMap.init();
        // console.log(input.events);

        let background = new GameObject();
        background.renderLayer = -1;
        background.draw = (ctx)=>{
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {
    objectRegister.reset();
}

console.log("Hello from root!");