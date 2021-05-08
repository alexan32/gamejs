import { GameObject, objectRegister } from "./engine/src/gameObject.js";
import { input, canvas } from "./engine/main.js";
import { environment as env } from "./project/environment.js"
import { CollisionMap } from "./project/objects/map.js";

//declarations here
let world;
let player1;
let player2;
let player3;
let cursor;
let playerList;

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
        // playerList = [];
        // world = buildWorld();
        // player1 = buildPlayer(2, 2);
        // player2 = buildPlayer(2, 4);
        // player3 = buildPlayer(2, 6);
        // playerList = [player1, player2, player3];
        // cursor = buildCursor();
        // canvas.addEventListener("mousedown", playerSelect);
        var test = new CollisionMap();
        // test.logMap(test.map);
        test.getAvailableMoves(1,1,4);
        // console.log(test.getNeighbors(0, 0));
        console.log(test.getNeighbors(1, 1));
        // console.log(test.getNeighbors(2, 2));

        objectRegister.buildRenderList();

        resolve();
    });
}

// destroy any objects that should go away during
// scene transition 
function destroy() {

}

function playerSelect(){
    for(let i=0; i<playerList.length; i++){
        let player = playerList[i];
        player.selected = (player.position.x == cursor.position.x && player.position.y == cursor.position.y);
    }
}

function buildPlayer(x, y){
    var player = new GameObject();
    player.position = new Coord(x, y);
    player.selected = false;
    player.speed = 5;

    player.draw = function(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(player.position.x * env.tileSize + 4, player.position.y * env.tileSize + 4, env.tileSize - 8, env.tileSize - 8);
        if(player.selected){
            ctx.lineSize = 3;
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.rect(player.position.x * env.tileSize, player.position.y * env.tileSize, env.tileSize, env.tileSize);
            ctx.stroke();
        }
    }

    return player;
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
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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

class Coord{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }

    toString(){
        return `${this.x},${this.y}`;
    }
}