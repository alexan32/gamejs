import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, EventEmitter, State, StateMachine, angleRadians, distanceBetweenTwoPoints } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";
import { canvas } from "../../../engine/main.js";


/*    
    position: x,y of the tile this creature occupies
    targetPosition: x,y of the tile this creature is trying to reach
    screenPosition: x,y coordinates on which to render
    events:
        - arrived: triggers when the creature reaches the target position
        - moving: triggers when the creature leaves its current position
    machine states:
        - IDLE: the creature has arrived at target location
        - MOVING: the creature is moving towards target location
    animations:
        - 0-3: walk animations for each direction
*/

export class Creature extends GameObject{

    constructor(x, y, animations){
        super();

        this.targetPosition = new Coord(x,y);
        this.position = this.targetPosition;
        this.screenPosition = new Coord(x*env.tileSize, y*env.tileSize);

        this.events = new EventEmitter();
        this.machine = this.buildMachine();
        
        this.animations = animations;
        this.currentAnimation = animations[0];
        this.renderLayer = env.creatureLayer;
        this.moveSpeed = 40;
        this.facing = "S"
        this.directionMap = {
            "N":1,
            "S":0,
            "E":3,
            "W":2
        }

        this.arrived = ()=>{return this.position == this.targetPosition};

        canvas.addEventListener("mousedown", event=>{
            var mx = event.clientX - canvas.offsetLeft;
            var my = event.clientY - canvas.offsetTop;
            if(this.screenPosition.x <= mx && mx <=this.screenPosition.x + 32 && this.screenPosition.y <= my && my <=this.screenPosition.y + 32){
                this.events.trigger("clicked", {id:this.id});
            }
        });
    }

    update(dt){
        if(!this.arrived()){
            this.moveToTarget(dt);
        }
        this.currentAnimation.update(dt)
    }

    draw(ctx){
        ctx.drawImage(this.currentAnimation.getCurrentFrame(), this.screenPosition.x, this.screenPosition.y);
    }

    setTargetPosition(x, y){
        this.targetPosition = new Coord(x, y);
    }

    moveToTarget(dt){
        // calculations
        this.machine.update("moving");
        var targetX = parseInt(this.targetPosition.x * env.tileSize);
        var targetY = parseInt(this.targetPosition.y * env.tileSize);
        var angleToTarget = angleRadians(this.screenPosition.x, this.screenPosition.y, targetX, targetY);
        var horizontal = Math.cos(angleToTarget) * this.moveSpeed * dt;
        var vertical = Math.sin(angleToTarget) * this.moveSpeed * dt;
        
        // update direction state
        if(Math.abs(vertical) >= Math.abs(horizontal)){
            var dir = (vertical > 0) ? "S": "N";
        }else{
            var dir = (horizontal > 0) ? "E": "W";
        }
        if(dir != this.facing){
            this.facing = dir;
            this.setCurrentAnimation();
        }

        // perform move
        this.screenPosition.x += horizontal;
        this.screenPosition.y += vertical;
        if(distanceBetweenTwoPoints(this.screenPosition.x, this.screenPosition.y, targetX, targetY) < 1){
            this.screenPosition.x = targetX;
            this.screenPosition.y = targetY;
            this.position = this.targetPosition;
            this.machine.update("arrived");
        }
    }

    setCurrentAnimation(){
        switch(this.machine.currentState){
            case "IDLE": 
                this.currentAnimation = this.animations[this.directionMap[this.facing]];
                this.currentAnimation.stop();   //holds the first frame
                break;
            case "MOVING":
                this.currentAnimation = this.animations[this.directionMap[this.facing]];
                this.currentAnimation.playInLoop();
                break;
        }
    }

    buildMachine(){
        var machine = new StateMachine("IDLE");
        // ------------------------------------------------
        var IDLE = new State({
            "moving": "MOVING"
        });
        IDLE.onEnter=()=>{
            console.log("state is IDLE");
            this.events.trigger("arrived", {id: this.id});
            this.setCurrentAnimation();
        }
        // ------------------------------------------------
        var MOVING = new State({
            "arrived": "IDLE"
        });
        MOVING.onEnter=()=>{
            console.log("state is MOVING");
            this.events.trigger("moving", {id: this.id});
            this.setCurrentAnimation();
        }
        machine.states = {
            "IDLE": IDLE,
            "MOVING": MOVING
        }
        return machine;
    }
}