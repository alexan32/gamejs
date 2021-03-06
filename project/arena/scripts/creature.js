import { GameObject } from "../../../engine/src/gameObject.js";
import { Coord, EventBus, State, StateMachine, angleRadians, distanceBetweenTwoPoints } from "../../../engine/src/utils.js";
import { environment as env } from "../environment.js";
import { canvas, viewFrame, input } from "../../../engine/main.js";


/*    
    position: x,y of the tile this creature occupies
    targetPosition: x,y of the tile this creature is trying to reach
    worldPosition: x,y pixel coordinates within the world.
    events:
        - arrived: triggers when the creature reaches the target position
        - moving: triggers when the creature leaves its current position
        - clicked:
    machine states:
        - IDLE: the creature has arrived at target location
        - MOVING: the creature is moving towards target location
    animations:
        - 0-3: walk animations for each direction
*/

export class Creature extends GameObject{

    constructor(x, y, animations){
        super();
        this.tags.push("creature");

        this.targetPosition = new Coord(x,y);
        this.position = this.targetPosition;
        this.worldPosition = new Coord(x*env.tileSize, y*env.tileSize);
        this.moveSpeed = 40;

        this.events = new EventBus();
        this.machine = this.buildMachine();
        
        this.path = [];
        this.animations = animations;
        this.currentAnimation = animations[0];
        this.renderLayer = env.creatureLayer;
        this.facing = "S"
        this.directionMap = {
            "N":1,
            "S":0,
            "E":3,
            "W":2
        }

        this.arrived = ()=>{return this.position == this.targetPosition};
        const eventFilter = (event)=>{
            var x = this.worldPosition.x - viewFrame.worldPosition.x;
            var y = this.worldPosition.y - viewFrame.worldPosition.y;
            return (event.x >= x && event.x <= x + env.tileSize && event.y >= y && event.y <= y + env.tileSize );
        }

        this.subscriptions = {};
        this.subscriptions["mousedown"] = input.events.on("mousedown", this.onMouseDown.bind(this), eventFilter);
    }

    update(dt){
        if(!this.arrived()){
            this.moveToTarget(dt);
        }
        this.currentAnimation.update(dt)
    }

    draw(ctx){
        viewFrame.drawImage(this.currentAnimation.getCurrentFrame(), this.worldPosition.x, this.worldPosition.y, ctx);
    }

    setPath(path){
        this.path = path;
        const n = path.shift();
        this.setTargetPosition(n.x, n.y);
    }

    setTargetPosition(x, y){
        this.targetPosition = new Coord(x, y);
        this.events.trigger("targetSet", this.targetPosition);
    }

    moveToTarget(dt){
        // calculations
        this.machine.update("moving");
        var targetX = parseInt(this.targetPosition.x * env.tileSize);
        var targetY = parseInt(this.targetPosition.y * env.tileSize);
        var angleToTarget = angleRadians(this.worldPosition.x, this.worldPosition.y, targetX, targetY);
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
        this.worldPosition.x += horizontal;
        this.worldPosition.y += vertical;
        if(distanceBetweenTwoPoints(this.worldPosition.x, this.worldPosition.y, targetX, targetY) < 1){
            this.worldPosition.x = targetX;
            this.worldPosition.y = targetY;
            this.position = this.targetPosition;
            if(this.path.length > 0){
                this.targetPosition = this.path.shift();
                this.events.trigger("targetSet", this.targetPosition);
            }else{
                this.machine.update("arrived");
            }
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

    onMouseDown(event){
        this.events.trigger("clicked", {id: this.id});
    }

    destroy(){
        this.subscriptions["mousedown"].unsubscribe();
    }
}


export class NavBody extends GameObject{

    constructor(x, y, collisionMap){
        super();

        this.position = new Coord(x, y);                                    // current tile position
        this.targetPosition = new Coord(x, y);                              // next tile that body moves into
        this.destination = new Coord(x, y);                                 // tile at the end of the path
        this.worldPosition = new Coord(x*env.tileSize, y*env.tileSize);     // position in pixels
        this.path = [];
        this.facing = 'S';
        this.events = new EventBus();
        this.collisionMap = collisionMap
    }

    update(dt){
        if(!this.arrived()){
            this.moveToTarget(dt);
        }
    }

    arrived(){
        return this.position == this.destination;
    }

    moveToTarget(){
        // calculations
        var targetX = parseInt(this.targetPosition.x * env.tileSize);
        var targetY = parseInt(this.targetPosition.y * env.tileSize);
        var angleToTarget = angleRadians(this.worldPosition.x, this.worldPosition.y, targetX, targetY);
        var horizontal = Math.cos(angleToTarget) * this.moveSpeed * dt;
        var vertical = Math.sin(angleToTarget) * this.moveSpeed * dt;
        
        // update direction state
        if(Math.abs(vertical) + 0.1 > Math.abs(horizontal)){
            var dir = (vertical > 0) ? "S": "N";
        }else{
            var dir = (horizontal > 0) ? "E": "W";
        }
        if(dir != this.facing){
            this.facing = dir;
            this.events.trigger("facingChange", {
                id: this.id,
                facing: this.facing,
                position: this.position,
                targetPosition: this.targetPosition,
                destination: this.destination,
                arrived: this.arrived()
            });
        }

        // perform move
        this.worldPosition.x += horizontal;
        this.worldPosition.y += vertical;
        if(distanceBetweenTwoPoints(this.worldPosition.x, this.worldPosition.y, targetX, targetY) < 1){
            this.worldPosition.x = targetX;
            this.worldPosition.y = targetY;
            this.position = this.targetPosition;
            if(this.path.length > 0){
                this.targetPosition = this.path.shift();
            }
            this.events.trigger("positionChange", {
                id: this.id,
                facing: this.facing,
                position: this.position,
                targetPosition: this.targetPosition,
                destination: this.destination,
                arrived: this.arrived()
            });
        }
    }

    setPath(path){
        this.path = path;
        this.destination = this.path[this.path.length];
        if(this.path.length > 0){
            this.targetPosition = this.path.shift();
        }
        this.events.trigger("positionChange", {
            id: this.id,
            facing: this.facing,
            position: this.position,
            targetPosition: this.targetPosition,
            destination: this.destination,
            arrived: this.arrived()
        });
    }
}

class TraficController{
    
    constructor(collisionMap){
        this.collisionMap = collisionMap;
        this.navBodies = {};
        this.subscriptions = {};
    }

    onPositionChange(event){
        var tempCollisions = Object.keys(this.navBodies).forEach(id => {
            return this.navBodies[id].targetPosition;
        });
        if(!this.collisionMap.canEnter(event.targetPosition.x, event.targetPosition.y, tempCollisions)){
            var body = this.navBodies[event.id];
            var path = this.collisionMap.astar(body.position.x, body.position.y, body.destination.x, body.destination.y, tempCollisions);
            body.setPath(body);
        }
    }

    registerNavBody(body){
        this.subscriptions[body.id] = body.events.on("positionChange", this.onPositionChange.bind(this));
        this.navBodies[body.id] = body;
    }

    deregisterNavBody(body){
        this.subscriptions[body.id].unsubscribe();
        delete this.navBodies[body.id];
    }

}