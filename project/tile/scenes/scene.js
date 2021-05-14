// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { input } from "../../../engine/main.js";
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js";
import { loadImage, readJsonFile } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js";
import { TiledImage, TileSet, SpriteAnimation } from "../obj/canvasTile.js";

console.log("Hello from scene!");

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // let level = readJsonFile("../tile/assets/level.json");
        // let img = await loadImage("../tile/assets/tiles.png");
        let sheet = await loadImage("../tile/assets/knight.png");

        // let tileset = new TileSet(img, 16, 16);
        // let background = new TiledImage(level.map, tileset);

        let spritesheet = new TileSet(sheet, 32, 32);
        var framerate = 100;

        let down = new SpriteAnimation( [spritesheet.getTile(0)]);
        let up = new SpriteAnimation( [spritesheet.getTile(5)]);
        let left = new SpriteAnimation( [spritesheet.getTile(10)]);
        let right = new SpriteAnimation( [spritesheet.getTile(15)]);
        let walkDown = new SpriteAnimation( [spritesheet.getTile(1),spritesheet.getTile(2),spritesheet.getTile(3),spritesheet.getTile(4)], false);
        let walkUp = new SpriteAnimation( [spritesheet.getTile(6),spritesheet.getTile(7),spritesheet.getTile(8),spritesheet.getTile(9)], false);
        let walkLeft = new SpriteAnimation( [spritesheet.getTile(11),spritesheet.getTile(12),spritesheet.getTile(13),spritesheet.getTile(14)], false);
        let walkRight = new SpriteAnimation( [spritesheet.getTile(16),spritesheet.getTile(17),spritesheet.getTile(18),spritesheet.getTile(19)], false);
        let attackDown = new SpriteAnimation( [spritesheet.getTile(21),spritesheet.getTile(22),spritesheet.getTile(23),spritesheet.getTile(24)], false);
        let attackUp = new SpriteAnimation( [spritesheet.getTile(26),spritesheet.getTile(27),spritesheet.getTile(28),spritesheet.getTile(29)], false);
        let attackLeft = new SpriteAnimation( [spritesheet.getTile(31),spritesheet.getTile(32),spritesheet.getTile(33),spritesheet.getTile(34)], false);
        let attackRight = new SpriteAnimation( [spritesheet.getTile(36),spritesheet.getTile(37),spritesheet.getTile(38),spritesheet.getTile(39)], false);

        let currentAnimation = down;
        let stateMap = {
            s: [down, walkDown, attackDown],
            n: [up, walkUp, attackUp],
            w: [left, walkLeft, attackLeft],
            e: [right, walkRight, attackRight]
        }
        walkDown.eventHandler.on("lastFrame", event=>{
            console.log("last!");
        })
        let local = new GameObject();
        local.x = 32;
        local.y = 32;
        local.facing = "s";
        local.update = function (dt) {
            var xmove = 0;
            var ymove = 0;
            var speed = 60;
            var dir = local.facing
            if(input.pressed["KeyA"]){
                xmove -= speed * dt;
                dir = "w";
            }else if(input.pressed["KeyD"]){
                xmove += speed * dt;
                dir = "e"
            }else if(input.pressed["KeyW"]){
                ymove -= speed * dt;
                dir = "n"
            }else if(input.pressed["KeyS"]){
                ymove += speed * dt;
                dir = "s"
            }
            local.x += xmove;
            local.y += ymove;
            local.facing = dir;
            if(xmove == 0 && ymove == 0){
                currentAnimation = stateMap[local.facing][0]
            }else{
                currentAnimation = stateMap[local.facing][1]
            }

            currentAnimation.update(dt);
        }
        local.draw = function (ctx) {
            ctx.drawImage(currentAnimation.getCurrentFrame(), local.x, local.y);
        }

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() { }