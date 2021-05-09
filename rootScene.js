// engine imports
import { GameObject, objectRegister } from "./engine/src/gameObject.js";
import { Coord } from "./engine/src/utils.js";
import { input, canvas } from "./engine/main.js";
// project imports
import { environment as env } from "./project/environment.js"
import { CollisionMap } from "./project/objects/map.js";
import { Creature, NavigationGraphics } from "./project/objects/creature.js";

//declarations here
let world;

let player1;
let player2;
let cursor;
let navigationGraphics;

let playerList;
let eventThrottle = false;
let selectedPlayer = null;

// A scene is a collection of game objects, and contains all the information
// needed to initialize them. it has an init function with returns a promise.
// the promsie should resolve when all game objects are loaded.
export var scene = {
    "init": init,
    "destroy": destroy,
    objects: []
};


// resolve true when all objects are loaded
function init() {
    return new Promise(async resolve => {

        world = buildWorld();

        player1 = new Creature(6, 6, 15);
        player2 = new Creature(3, 11, 15);
        playerList = [player1, player2];

        cursor = buildCursor();

        navigationGraphics = new NavigationGraphics(cursor);

        canvas.addEventListener("mousedown", onCanvasClick);
        canvas.addEventListener("mousemove", onMouseMove);

        objectRegister.buildRenderList();
        resolve();
    });
}

// destroy any objects that should go away during
// scene transition 
function destroy() {

}

function onCanvasClick(){
    // handle player selection
    var playerWasSelected = false;
    for(let i=0; i<playerList.length; i++){
        let player = playerList[i];
        if(player.position.x == cursor.position.x && player.position.y == cursor.position.y){
            playerWasSelected = true;
            if(selectedPlayer != null){
                selectedPlayer.selected = null;
            }
            player.selected = true;
            selectedPlayer = player;
            navigationGraphics.movement = player.calculateMovement(buildCollisionMap());
            console.log(navigationGraphics.movement);
        }
    }
    // handle player pathfinding
    if(selectedPlayer != null){
        navigationGraphics.movement.forEach(c => {
            if(cursor.position.x == c.x && cursor.position.y == c.y){
                var path = buildCollisionMap().astar(selectedPlayer.position.x, selectedPlayer.position.y, cursor.position.x, cursor.position.y)
                path.shift();
                selectedPlayer.path = path
            }
        });
    }
    // clear navigation graphics
    if(!playerWasSelected){
        if(selectedPlayer != null){
            selectedPlayer.selected = false;
        }
        selectedPlayer = null;
        navigationGraphics.path = [];
        navigationGraphics.movement = [];
    }
}

const throttle = ms => {eventThrottle = true;setTimeout(()=>{eventThrottle = false;}, ms);}

function onMouseMove(){
    if(selectedPlayer != null && !eventThrottle){
        selectedPlayer.availableMoves.forEach(c =>{
            if(cursor.position.x == c.x && cursor.position.y == c.y){
                throttle(100);
                navigationGraphics.path = buildCollisionMap().astar(selectedPlayer.position.x, selectedPlayer.position.y, cursor.position.x, cursor.position.y);
                console.log(navigationGraphics.path);
            }
        });
    }
}

function buildWorld() {
    world = new GameObject();
    world.map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    world.draw = function (ctx) {
        for (let y = 0; y < world.map.length; y++) {
            for (let x = 0; x < world.map[0].length; x++) {
                switch (world.map[y][x]) {
                    case 0:
                        ctx.fillStyle = "green";
                        break;
                    case 1:
                        ctx.fillStyle = "grey";
                }
                ctx.fillRect(x * env.tileSize, y * env.tileSize, env.tileSize, env.tileSize);
            }
        }
    }
    return world;
}

function buildCursor(){
    var cursor = new GameObject();

    cursor.position = new Coord(null, null);
    cursor.update = function(dt){
        var mouse = input.mouse;
        cursor.position.x = Math.floor(mouse.x / env.tileSize);
        cursor.position.y = Math.floor(mouse.y / env.tileSize);
    }

    cursor.draw = function(ctx){
        ctx.strokeStyle = "yellow";
        ctx.beginPath();
        ctx.rect(cursor.position.x * env.tileSize, cursor.position.y * env.tileSize, env.tileSize, env.tileSize);
        ctx.stroke();
    }
    return cursor;
}

function buildCollisionMap(){
    var arr = JSON.parse(JSON.stringify(world.map));
    for(var y=0; y<arr.length; y++){
        for(var x=0; x<arr[y].length; x++){
            switch(arr[y][x]){
                case 0:
                    arr[y][x] = 99;
                    break;
                default:
                    arr[y][x] = -1;
                    break;
            }
        }
    }
    for(var player of playerList){
        arr[player.position.y][player.position.x] = -1;
    }
    return new CollisionMap(arr);
}