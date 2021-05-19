// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { canvas } from "../../../engine/main.js"

// project imports
import { environment as env } from "../environment.js"
import { InterfaceTile } from "../scripts/interface.js";
import { loadImage } from "../../../engine/src/utils.js";

export var scene = {
    "init": init,
    "destroy": destroy
}

let bottomPanel;

/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        var rootImage = makeARect( canvas.width * 0.95, canvas.height * 0.2, "blue");
        var rootPanel = new InterfaceTile(rootImage, 0, 0, rootImage.width, rootImage.height, "root");
        var panelX = canvas.width * 0.025;
        var panelY = canvas.height * 0.8;

        var portraitImage = await loadImage("./assets/knight_portrait.png");
        var portrait = new InterfaceTile(portraitImage, 10, 10, 64, 64, "portrait");
        portrait.setParent(rootPanel);
        portrait.events.on("mousedown", event=>{
            console.log("portrait clicked!");
        })

        console.log(rootPanel.children);

        bottomPanel = new GameObject();
        bottomPanel.renderLayer = env.uiLayer;
        bottomPanel.draw = (ctx)=>{
            rootPanel.draw(ctx, panelX, panelY);
        }

        // objectRegister.buildRenderList();
        resolve();
    });
}

/* Deregister GameObjects here
*/
function destroy() { 
    objectRegister.deregister(bottomPanel);
}

function makeARect(w, h, fill){
    var cnvs = document.createElement("canvas");
    cnvs.width = w;
    cnvs.height = h;
    var tctx = cnvs.getContext("2d");
    tctx.fillStyle = fill;
    tctx.fillRect(0, 0, w, h);
    return cnvs;
}