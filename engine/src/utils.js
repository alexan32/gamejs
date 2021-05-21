// wait for x milliseconds
export const delay = ms => new Promise(res => setTimeout(res, ms));

// generate a unique id. credit to some dude on stack overflow.
export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function distanceBetweenTwoPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

export function angleRadians(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1);
}

export function angleDegrees(x1, y1, x2, y2){
    return Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
}

// returns true if rectangle i is fully inside rectangle v.
// 1 is top left, 2 is bottom right
export function rectangleContains(v1, v2, i1, i2){
    return (v1.x <= i1.x && v1.y <= i1.y && i2.x <= v2.x && i2.y <= v2.y);
}

export function rectanglesIntersect(v1, v2, i1, i2){
    // left or right
    if(v2.x <= i1.x || i2.x <= v1.x){
        return false;
    }
    // above or below
    if(v2.y <= i1.y || v1.y >= i2.y){
        return false;
    }
    return true;
}

export function readJsonFile(pathToFile){
    console.log("Loading json file from path: ", pathToFile);
    var request = new XMLHttpRequest();
    request.open("GET", pathToFile, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

export function loadImage(pathToResource){
    return new Promise(resolve => {
        var img = new Image();
        img.src = pathToResource;
        img.addEventListener('load', ()=>{
            resolve(img);
        });
    })
}

export class Coord{
    constructor(x=0, y=0){
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    toString(){
        return `${this.x},${this.y}`;
    }
}

export class Array2D{
    constructor(data){
        this.data = data;
    }

    get(x, y){
        if(y >= 0 && y < this.data.length){
            if(x >=0 && x < this.data[y].length){
                return this.data[y][x];
            }
        }
        return null;
    }
}

const returnTrue = ()=>{return true};

export class EventBus{

    constructor(){
        this.subscriptions = {};
        this.filters = {};
    }

    /*  eventName: event which triggers the callback
        callback: the callback function
        eventFilter: function. takes the event as input and returns true or false
    */
    on(eventName, callback, eventFilter=returnTrue) {
        const id = uuidv4();
        if (!this.subscriptions[eventName]){
            this.subscriptions[eventName] = {};
            this.filters[eventName] = {};
        }
    
        this.subscriptions[eventName][id] = callback;
        this.filters[eventName][id] = eventFilter;

        return {
            unsubscribe: () => {
                delete this.subscriptions[eventName][id];
                delete this.filters[eventName][id];
                if (Object.keys(this.subscriptions[eventName]).length === 0){
                    delete this.subscriptions[eventName];
                }
                if (Object.keys(this.filters[eventName]).length === 0){
                    delete this.filters[eventName];
                }
            }
        }
    }
    
    trigger(eventName, eventPayload) {
        if(!this.subscriptions[eventName]){
            return;
        }
        Object.keys(this.subscriptions[eventName]).forEach(key => {
            if(this.filters[eventName][key](eventPayload)){
                this.subscriptions[eventName][key](eventPayload);
            }
        });
    }

}


/*  A state is an object that has:
    1. a map of available transitions out of the state
    2. an onEnter() function
    3. an onExit() function

    example:
    var on = new State({
        "push": "OFF"
    });
    on.onExit = ()=>{ console.log("leaving ON state") };
    on.onEnter = ()=>{ console.log("entering ON state") };
*/
export class State{

    constructor(transitionMap){
        this.transitionMap = transitionMap;
    }
    onEnter() {}
    onExit() {}
}


/*  A state machine has: 
    1. a currentState
    2. a states map that maps a state name to a state object
    3. an update function that will perform state transitions when provided
        with the appropriate input for the current state.

    example:
    var machine = new StateMachine("OFF", {"ON": on, "OFF": off});
    machine.update("push");
*/
export class StateMachine{

    constructor(initialState=null, states={}){
        this.currentState = initialState;
        this.states = states;
    }

    update(eventKey){
        if (this.states[this.currentState].transitionMap.hasOwnProperty(eventKey)) {
            this.states[this.currentState].onExit();
            this.currentState = this.states[this.currentState].transitionMap[eventKey];
            this.states[this.currentState].onEnter();
        }
    }

}