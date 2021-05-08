import {GameObject} from "./engine/src/gameObject.js";
import {input} from "./engine/main.js";

// A scene is a collection of game objects, and contains all the information
// needed to initialize them. it has an init function with returns a promise.
// the promsie should resolve when all game objects are loaded.
export var scene = {
    init: initialize,
    objects: []
};

// resolve true when all objects are loaded
function initialize(){
    return new Promise(async resolve => {

        //init here

        resolve();
    });
}

// destroy any objects that should go away during
// scene transition 
function destroy(){

}