import { GameObject } from "./gameObject.js";
import { Coord } from "./utils.js";

/*
    a particle is...
    - a thing that exists at a location
    - typically moves
    - typically changes over time
    - typically disappears after a certain amount of time
*/


/*  Initial position: x, y
    Initaly velocity: vx, vy
    Time to live: t
*/
export class Particle{
    constructor(x, y, vx, vy, t){
        this.position = new Coord(x, y), 
        this.velocity = new Coord(vx, vy),
        this.timer = t
    }
    behavior(dt){}
    draw(ctx){}
}

export class FlameParticle extends Particle{

    constructor(x, y, vx, vy, t){
        super(x, y, vx, vy, t);
    }

    draw(ctx){
        ctx.fillStyle = "orange";
        ctx.fillRect(this.position.x, this.position.y, this.timer * 5, this.timer * 5);
        ctx.stroke();
    }

    behavior(dt){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x += (Math.random() * 2 - 1) * 0.2;
        this.timer -= dt;
    }

}

/*  particle manager will hold and update all particles. When a particle
    is created, push it to the particle list.
*/
export class ParticleManager extends GameObject{

    constructor(){
        super();
        this.particleList = [];
    }

    update(dt){
        for(let i=0; i<this.particleList.length; i++){
            this.particleList[i].behavior(dt);
        }
        for(let i=0; i<this.particleList.length; i++){
            if(this.particleList[i].timer <=0){
                this.particleList.splice(i, 1);
            }
        }
    }

    draw(ctx){
        for(let i=0; i<this.particleList.length; i++){
            this.particleList[i].draw(ctx);
        }
    }

}