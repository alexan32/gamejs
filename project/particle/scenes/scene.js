// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { angleRadians, Coord, distanceBetweenTwoPoints } from "../../../engine/src/utils.js";

// project imports
import { environment as env } from "../environment.js";
import { ParticleManager, FlameParticle } from "../obj/particles.js";

window.scene = {
    "init": init,
    "destroy": destroy
};

function init() {
    return new Promise(async resolve => {

        // particleManager handles particles
        let particleManager = new ParticleManager();

        // particleSpawner will create particles
        const vy = -1;

        let particleSpawner = new GameObject();
        particleSpawner.update = function(dt){
            for(var i=0; i<1; i++){
                var p = new FlameParticle(200 + (Math.random() * 10 - 5), 200 + (Math.random() * 10 - 5), 0, vy, 0.5);
                particleManager.particleList.push(p);
            }
        };

        let targetOne = new Coord(500, 300);
        let targetTwo = new Coord(100, 300);

        let particleSpawner2 = new GameObject();
        particleSpawner2.position = new Coord(100, 300);
        particleSpawner2.target = targetOne;
        particleSpawner2.update = function(dt){

            if(particleSpawner2.position.x != particleSpawner2.target.x){
                var angleToTarget = angleRadians(particleSpawner2.position.x, particleSpawner2.position.y, particleSpawner2.target.x, particleSpawner2.target.y);
                var move = Math.cos(angleToTarget) * 100 * dt;
                particleSpawner2.position.x += move;
                if(distanceBetweenTwoPoints(particleSpawner2.position.x, particleSpawner2.position.y, particleSpawner2.target.x, particleSpawner2.target.y) < 5){
                    particleSpawner2.target = (particleSpawner2.target == targetOne) ? targetTwo : targetOne;
                }
            }

            for(var i=0; i<3; i++){
                var p = new FlameParticle(particleSpawner2.position.x + (Math.random() * 6 - 3), particleSpawner2.position.y + (Math.random() * 6 - 3), 0, -0.1, 0.5);
                particleManager.particleList.push(p);
            }
        };

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}