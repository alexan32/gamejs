import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, distanceBetweenTwoPoints, angleRadians } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";

export class Creature extends GameObject{

    constructor(x, y, speed){
        super();
        this.position = new Coord(x, y);
        this.screenX = x * env.tileSize;
        this.screenY = y * env.tileSize;
        this.selected = false;
        this.speed = speed;                         //number. how far Creature can move on turn
        this.movement = speed;                      //number. how much movement remaining in turn
        this.availableMoves = [];                   //Array<Coord>. coordinates Creature can reach with remaining movement
        this.path = [];                             //Array<Coord>. path to get from current location to another location
        this.renderLayer = env.creatureRenderLayer;
        this.targetPosition = this.position;
    }

    draw(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(this.screenX + 4, this.screenY + 4, env.tileSize - 8, env.tileSize - 8);
        if(this.selected){
            ctx.lineSize = 3;
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.rect(this.position.x * env.tileSize, this.position.y * env.tileSize, env.tileSize, env.tileSize);
        }
    }

    update(dt){
        // update target position
        if(this.path.length > 0 && this.targetPosition == this.position){
            this.targetPosition = this.path.shift();
            console.log(`position: ${this.position.x},${this.position.y}  target: ${this.targetPosition.x},${this.targetPosition.y}`);
        }
        // move to target
        if(this.screenX != this.targetPosition.x * env.tileSize || this.screenY != this.targetPosition.y * env.tileSize){
            var targetScreenX = this.targetPosition.x * env.tileSize;
            var targetScreenY = this.targetPosition.y * env.tileSize
            var angleToTarget = angleRadians(this.screenX, this.screenY, targetScreenX, targetScreenY);
            this.screenX += Math.cos(angleToTarget) * 100 * dt;
            this.screenY += Math.sin(angleToTarget) * 100 * dt;
            if(distanceBetweenTwoPoints(this.screenX, this.screenY, targetScreenX, targetScreenY) < 5){
                this.screenX = targetScreenX;
                this.screenY = targetScreenY;
                this.position = this.targetPosition;
            }
        }
    }

    calculateMovement(collisionMap){
        this.availableMoves = collisionMap.getAvailableMoves(this.position.x, this.position.y, this.movement);
        return this.availableMoves;
    }
}

// game object that renders to disply the movement of a creature. 
// render above ground layer but below creature layer
export class NavigationGraphics extends GameObject{

    constructor(){
        super();
        this.renderLayer = env.navigationRenderLayer;
        this.movement = [];
        this.path = [];
    }

    draw(ctx){
        ctx.strokeStyle = "blue";
        for(var pos of this.movement){
            ctx.beginPath();
            ctx.rect(pos.x * env.tileSize, pos.y * env.tileSize, env.tileSize, env.tileSize);
            ctx.stroke();
        }
        ctx.strokeStyle = "black";
        if(this.path.length > 0){
            for(var i=0; i<this.path.length -1; i++){
                var start = this.path[i];
                var end = this.path[i+1];
                ctx.beginPath();
                ctx.moveTo(start.x * env.tileSize + env.tileSize/2, start.y * env.tileSize + env.tileSize/2);
                ctx.lineTo(end.x * env.tileSize + env.tileSize/2, end.y * env.tileSize + env.tileSize/2);
                ctx.stroke();
                if(i+1 == this.path.length - 1){
                    ctx.fillStyle = "yellow"
                    ctx.font ="16px Arial";
                    var dist = (this.path.length == 16) ? 15 : this.path.length;
                    ctx.fillText(dist.toString(), end.x * env.tileSize, end.y * env.tileSize);
                    ctx.stroke();
                }
            }
        }
    }

}