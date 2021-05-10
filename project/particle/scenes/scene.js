// A scene is a collection of game objects, and contains all the information
// needed to initialize them inside of init function, which returns a promise
// the promsie should resolve when all game objects are loaded.

// engine imports
import { GameObject, objectRegister } from "../../../engine/src/gameObject.js"
import { angleRadians } from "../../../engine/src/utils.js";

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

        objectRegister.buildRenderList();
        resolve();
    });
}

function destroy() {}