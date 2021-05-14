
class state{
    constructor(name){
        this.name = name;
        this.transitions = {};
    }

    onEnter(){}

    onExit(){}
}


const animationMachine = {
    currentState: "IDLE",
    states:{
        IDLE: {
            onEnter: function(){
                //start idle animation
            },
            onExit: function(){},
            transitions: {
                "directionHeld": "WALK",
                "e": "ATTACK"
            }
        },
        WALK: {
            onEnter: function(){
                //start walk animation
            },
            onExit: function(){},
            transitions: {
                "noInput": "IDLE",
                "e": "ATTACK",
                "shiftPress": "RUN"
            }
        },
        RUN: {
            onEnter: function(){
                //start run animation
            },
            onExit: function(){},
            transitions: {
                "noInput": "IDLE",
                "e": "ATTACK",
                "shiftUp": "WALK"
            }
        },
        ATTACK: {
            onEnter: function(){
                //start attack animation
            },
            onExit: function(){},
            transitions: {
                "animationEnd": "IDLE"
            }
        }
    }
}



const switchMachine = {
    currentState: "OFF",
    states:{
        ON: {
            transitions: {
                OFF: ()=>{}
            }
        },
        OFF: {
            transitions: {
                ON: ()=>{}
            }
        }
    }
}