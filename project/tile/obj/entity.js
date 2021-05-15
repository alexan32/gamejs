import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, State, StateMachine } from "../../../engine/src/utils.js";
import { SpriteAnimation, TileSet } from "./canvasTile.js";


/*  A Creature is a gameobject that can move in the world space and 
    has animations for moving in each direction. The first frame of
    each animation should be the still/idle frame.
*/

class Creature extends GameObject {

    constructor(x, y, tileset) {
        super();
        this.position = new Coord(x, y);
        this.tileset = tileset;
        this.pauseAnimation = true;
        this.directions = {
            "S": 0,
            "N": 1,
            "W": 2,
            "E": 3
        }
        this.facing = "S";
        this.animations = buildCreatureAnimations(tileset);
    }

}


/*  The first four rows of a Creatures tileset are reservered
    for movement in the four cardinal directions. The first frame
    in each row is the frame for standing still.

    Each row after that is not required and are for alternate 
    animations. For example, rows 5,6,7,8 could be an attack animation
    and 9,10,11,12 could be an interaction animation.
*/
export function buildCreatureAnimations(tileset) {
    var animations = [];
    var counter = 0;
    for (var r = 0; r < tileset.numRows; r++) {
        var frames = [];
        for (var c=0; c < tileset.numColumns; c++) {
            frames.push(tileset.getTile(counter));
            counter += 1;
        }
        animations.push(new SpriteAnimation(frames));
    }

    return animations;
}