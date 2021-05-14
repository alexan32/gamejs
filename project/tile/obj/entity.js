import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord } from "../../../engine/src/utils.js";
import { SpriteAnimation, TileSet } from "./canvasTile.js";


class Creature extends GameObject{

    constructor(x, y, tileset){
        super();
        this.position = new Coord(x, y);
        this.tileset = tileset;
    }

}

/*  The first four rows of a Creatures tileset are reservered
    for movement in the four cardinal directions. The first frame
    in each row is the frame for standing still.

    Each row after that is not required and are for alternate 
    animations. For example, rows 5,6,7,8 could be an attack animation
    and 9,10,11,12 could be an interaction animation.
*/
function buildCreatureAnimations(tileset){
    var animations = [];
    for(var r=0; r<tileset.numRows; r++){
        var frames = [];
        for(var c=0; c<tileset.numColumns; c++){
            frames.push(tileset.getTile(c))
        }
        animations.push(new SpriteAnimation(frames));
    }
    return animations;
}

const machine = {

    state: "WALK",
    transitions: {
        WALK:{
            
        }
    }


}