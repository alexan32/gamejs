import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, EventBus, State, StateMachine, angleRadians, distanceBetweenTwoPoints } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";
import { canvas, viewFrame, input } from "../../../engine/main.js";


/*    
    position: x,y of the tile this creature occupies
    targetPosition: x,y of the tile this creature is trying to reach
    screenPosition: x,y coordinates on which to render
    events:
        - arrived: triggers when the creature reaches the target position
        - moving: triggers when the creature leaves its current position
    machine states:
        - ARRIVED: the camera is no
        - MOVINGTOWARD: the creature is moving towards target location
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

    update(dt){
        if(this.machine.currentState == "FREEMOVE"){
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
        }else if(!this.arrived()){
            this.moveToTarget(dt);
        }
    }

    setTargetPosition(x, y){
        this.targetPosition = new Coord(x, y);
        this.machine.update("targetSet");
    }

    moveToTarget(dt){
        // calculations
        this.machine.update("moving");
        var targetX = parseInt(this.targetPosition.x * env.tileSize);
        var targetY = parseInt(this.targetPosition.y * env.tileSize);
        var angleToTarget = angleRadians(this.screenPosition.x, this.screenPosition.y, targetX, targetY);
        var horizontal = Math.cos(angleToTarget) * this.moveSpeed * dt;
        var vertical = Math.sin(angleToTarget) * this.moveSpeed * dt;

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

    buildMachine(){
        var machine = new StateMachine("FREEMOVE");
        // ------------------------------------------------
        var ARRIVED = new State({
            "moving": "MOVINGTOWARD",
            "giveControl": "FREEMOVE"
        });
        ARRIVED.onEnter=()=>{
            console.log("state is ARRIVED");
            this.events.trigger("arrived", {id: this.id});
        }
        // ------------------------------------------------
        var MOVINGTOWARD = new State({
            "arrived": "ARRIVED"
        });
        MOVINGTOWARD.onEnter=()=>{
            console.log("state is MOVINGTOWARD");
            this.events.trigger("moving", {id: this.id});
        }
        // ------------------------------------------------
        var FREEMOVE = new State({
            "takeControl": "ARRIVED",
            "targetSet": "MOVINGTOWARD"
        })
        machine.states = {
            "FREEMOVE": FREEMOVE,
            "ARRIVED": ARRIVED,
            "MOVINGTOWARD": MOVINGTOWARD
        }
        return machine;
    }
}