import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, EventBus, State, StateMachine, angleRadians, distanceBetweenTwoPoints } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";
import { canvas, viewFrame, input } from "../../../engine/main.js";


/*    
    position: x,y of the tile this creature occupies
    targetPosition: x,y of the tile this creature is trying to reach
    screenPosition: x,y coordinates on which to render
    events:
        - wait: triggers when the creature reaches the target position
        - moving: triggers when the creature leaves its current position
    machine states:
        - WAIT: the camera is no
        - MOVINGTO: the creature is moving towards target location
*/

export class Camera extends GameObject{

    constructor(x, y){
        super();

        this.position = new Coord(x, y);
        this.targetPosition = this.position;
        this.screenPosition = new Coord(x*env.tileSize, y*env.tileSize);
        viewFrame.setTarget(this.screenPosition, env.tileSize/2, env.tileSize/2);
        
        this.moveSpeed = 100;
        this.arrived = ()=>{return this.position == this.targetPosition};
        this.events = new EventBus();
        this.machine = this.buildMachine();
    }

    setPosition(x, y){
        this.position = new Coord(x, y);
        this.targetPosition = position;
        this.screenPosition = new Coord(x*env.tileSize, y*env.tileSize);
    }

    setMoveSpeed(spd){
        this.moveSpeed = spd;
    }

    update(dt){
        const state = this.machine.currentState

        if(state == "FREEMOVE"){
            var x = 0;
            var y = 0;
            if(input.pressed["KeyA"]){
                x -= this.moveSpeed;
            }
            if(input.pressed["KeyD"]){
                x += this.moveSpeed;
            }
            if(input.pressed["KeyW"]){
                y -= this.moveSpeed;
            }
            if(input.pressed["KeyS"]){
                y += this.moveSpeed;
            }
            this.screenPosition.x += dt * x;
            this.screenPosition.y += dt * y;
        }else if(state == "MOVINGTO" && !this.arrived()){
            this.moveTowardsTarget(dt);
        }
    }

    moveTo(x, y){
        this.targetPosition = new Coord(x, y);
        this.machine.update("movingTo");
    }

    follow(coord){
        this.targetPosition = coord;
        viewFrame.setTarget(coord, env.tileSize/2, env.tileSize/2);
        this.machine.update("following");
    }

    freeMove(){
        this.machine.update("freeMove");
    }

    moveTowardsTarget(dt){

        var targetX = parseInt(this.targetPosition.x * env.tileSize);
        var targetY = parseInt(this.targetPosition.y * env.tileSize);
        var angleToTarget = angleRadians(this.screenPosition.x, this.screenPosition.y, targetX, targetY);
        var horizontal = Math.cos(angleToTarget) * this.moveSpeed * dt;
        var vertical = Math.sin(angleToTarget) * this.moveSpeed * dt;

        this.screenPosition.x += horizontal;
        this.screenPosition.y += vertical;

        if(distanceBetweenTwoPoints(this.screenPosition.x, this.screenPosition.y, targetX, targetY) < 1){
            this.screenPosition.x = targetX;
            this.screenPosition.y = targetY;
            this.position = this.targetPosition;
            if(this.machine.currentState == "MOVINGTO"){
                this.machine.update("wait");
            }
        }
    }

    buildMachine(){
        var machine = new StateMachine("FREEMOVE");
        // ------------------------------------------------
        const WAIT = new State({
            "movingTo": "MOVINGTO",
            "freeMove": "FREEMOVE"
        });
        WAIT.onEnter=()=>{
            console.log("camera state is WAIT");
            this.events.trigger("wait", {id: this.id});
        }
        // ------------------------------------------------
        const MOVINGTO = new State({
            "wait": "WAIT"
        });
        MOVINGTO.onEnter=()=>{
            console.log("camera state is MOVINGTO");
            this.events.trigger("moving", {id: this.id});
        }
        // ------------------------------------------------
        const FREEMOVE = new State({
            "wait": "WAIT",
            "movingTo": "MOVINGTO",
            "following": "FOLLOWING"
        });
        FREEMOVE.onEnter=()=>{
            this.events.trigger("freeMove", {id: this.id});
            console.log("camera state is FREEMOVE");
        }
        // ------------------------------------------------
        const FOLLOWING = new State({
            "setTarget": "MOVINGTO",
            "freeMove": "FREEMOVE"
        });
        FOLLOWING.onEnter=()=>{
            this.events.trigger("following", {id: this.id});
            console.log("camera state is FOLLOWING");
        }
        FOLLOWING.onExit=function(){
            this.screenPosition.x = viewFrame.target.x;
            this.screenPosition.y = viewFrame.target.y;
            viewFrame.setTarget(this.screenPosition, env.tileSize/2, env.tileSize/2);
        }.bind(this);
        // ------------------------------------------------
        machine.states = {
            "FREEMOVE": FREEMOVE,
            "WAIT": WAIT,
            "MOVINGTO": MOVINGTO,
            "FOLLOWING": FOLLOWING
        }
        return machine;
    }
}