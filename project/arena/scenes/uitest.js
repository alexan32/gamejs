// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { canvas } from "../../../engine/main.js"

// project imports
import { environment as env } from "../environment.js"
import { InterfaceTile, InterfaceRoot } from "../scripts/interface.js";
import { loadImage } from "../../../engine/src/utils.js";

export var scene = {
    "init": init,
    "destroy": destroy
}

let myUi;

/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        // var actionBar = buildActionBar();
        // actionBar.show();

        var initiativeTracker = buildInitiativeBar();
        initiativeTracker.show();

        objectRegister.buildRenderList();
        resolve();
    });
}

/* Deregister GameObjects here
*/
function destroy() { 
    myUi.rootTile.destroy();
    objectRegister.deregister(myUi);
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

function buildActionBar(){

    var horizontalOffset = canvas.width * 0.05;
    var verticalOffset = canvas.height - (canvas.height * 0.0125) - 100;

    var rootImage = makeARect(canvas.width - 2 * horizontalOffset, 100, "rgba(0, 0, 255, 0.3)")
    var ctx = rootImage.getContext("2d");
    ctx.beginPath()
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "6";
    ctx.rect(0, 0, rootImage.width, rootImage.height);
    ctx.stroke();

    var root = new InterfaceTile(rootImage, horizontalOffset, verticalOffset, canvas.width - 2 * horizontalOffset, 100);

    var portraitImage = window.gameData.portraits.getTile(0);
    var portrait = new InterfaceTile(portraitImage, 6, 6, 90, 90, "portrait");
    portrait.setParent(root);

    var ui = new InterfaceRoot(root);

    return ui;
}

function buildInitiativeBar(){

    var horizontalOffset = canvas.width * 0.05;
    var verticalOffset = canvas.height * 0.0125;

    var rootImage = makeARect(canvas.width - 2 * horizontalOffset, 100, "rgba(0, 0, 255, 0.3)")
    var ctx = rootImage.getContext("2d");
    ctx.beginPath()
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "6";
    ctx.rect(0, 0, rootImage.width, rootImage.height);
    ctx.stroke();

    var root = new InterfaceTile(rootImage, horizontalOffset, verticalOffset, canvas.width - 2 * horizontalOffset, 100);

    var ui = new InterfaceRoot(root);

    return ui;
}