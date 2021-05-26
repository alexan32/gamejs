import { uuidv4 } from "./utils.js";

// objectRegister controls the life cycle of game objects
// register: add a gameobject to register
// deregister: remove a gameobject from register
export var objectRegister = {
    objects: {},
    renderList: [],

    register: function (ref) {
        this.objects[ref.id] = ref;
        this.renderList.push(ref)
        this.renderList.sort((a, b)=> {
            return a.renderLayer - b.renderLayer;
        });
    },

    // kill a game object
    deregister: function (ref) {
        delete this.objects[ref.id];
        this.buildRenderList();
    },

    //sorts game objects by their renderLayer value
    buildRenderList: function(){
        this.renderList = [];
        for (var key in this.objects){
            if(this.objects.hasOwnProperty(key)){
                this.renderList.push(this.objects[key])
            }
        }
        this.renderList.sort((a, b)=> {
            return a.renderLayer - b.renderLayer;
        });
        console.log("renderList: ", this.renderList);
    },

    // clears the register
    reset: function(){
        this.objects = {};
        this.renderList = [];
    },

    getByTag: function(tag){
        var match = [];
        for (var key in this.objects){
            if(this.objects[key].tags.includes(tag)){
                match.push(this.objects[key]);
            }
        }
        return match;
    }
}

//default contructor registers the game object with the objectRegister. 
//update: all game objects must have an update function
//draw: all game objects must have a draw function
export class GameObject{

    constructor() {
        this.tags = [];
        this.id = uuidv4();
        this.renderLayer = 0;
        objectRegister.register(this);
    }

    update(dt) { }

    draw(ctx) { }

    destroy(){
        objectRegister.deregister(this);
    }

}