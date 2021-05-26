// engine imports
import { input, canvas, viewFrame } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { TiledImage, TileSet } from "../../../engine/src/graphics.js";
import { Coord, loadImage, readJsonFile} from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js"
import { Creature } from "../scripts/creature.js";
import { Camera } from "../scripts/camera.js";
import { CollisionMap } from "../scripts/collision.js";

export var scene = {
    "init": init,
    "destroy": destroy
}


let playableList = [];
let enemyList = [];
let controller = {
    selectedCharacterId: "",
    update: function(dt){
        if("Escape" in input.pressed){
            this.selectedCharacter = null;
        }
    }
};


/* Initialize GameObjects inside of promise 
*/
function init() {
    return new Promise(async resolve => {

        // load config
        let levelData = readJsonFile("../arena/assets/waitingArea.json");

        // create map
        var tileImage = await loadImage("../arena/assets/waitingArea.png");
        var tileset = new TileSet(tileImage, env.tileSize, env.tileSize);
        let map = new TiledImage(levelData.map, tileset);
        let collision = new CollisionMap(levelData.collision, 0, 0);
        collision.events.on("tileClicked", event=>{
            console.log(event);
        });
        
        // game camera
        viewFrame.initialize(map.canvas.width, map.canvas.height, true);
        let camera = new Camera(6, 6);

        // create creatures
        var spriteImage = await loadImage("../arena/assets/knight.png");
        var spriteTiles = new TileSet(spriteImage, env.tileSize, env.tileSize);
        
        let pc = new Creature(6, 6, spriteTiles.toAnimationList());
        let pc2 = new Creature(6, 7, spriteTiles.toAnimationList());
        let enemy = new Creature(10, 11, spriteTiles.toAnimationList());

        pc.events.on("clicked", selectCreature);
        pc2.events.on("clicked", selectCreature);
        enemy.events.on("clicked", selectCreature);

        playableList = [pc.id, pc2.id];
        enemyList = [enemy];


        // background
        let local = new GameObject();
        local.renderLayer = env.mapLayer;
        local.draw = (ctx)=>{
            viewFrame.drawImage(map.canvas, 0, 0, ctx);
        }
        local.update = (dt)=>{
            controller.update(dt);
        }


        console.log(objectRegister.getByTag("creature"));

        resolve();
    });
}

/* Deregister GameObjects here. You can use objectRegister.reset() to 
*/  
function destroy() { }


function selectCreature(event){
    var creature = objectRegister.objects[event.id];
    if(creature.id != controller.selectedCharacterId && playableList.indexOf(creature.id) != -1){
        controller.selectedCharacter = creature;
        console.log("hello!");
    }
}