import { objectRegister } from "../../../engine/src/gameObject.js";
import { State, StateMachine } from "../../../engine/src/utils.js";


export class Controller{

    /*  camera: the scenes camera object 
        playerList: list of player controllable creature ids
    */
    constructor(camera, collisionMap, partyList){
        this.camera = camera;
        this.collisionMap = collisionMap;
        this.partyList = partyList;

        this.initializedCreatures = [];
        this.updateCreatureSubscriptions();

        this.machine = this.buildMachine();
    }

    startCombat(hostileGroupOne, hostileGroupTwo=[], allies=[]){}

    // currently controlled party member
    setPartyLeader(){}

    // navigation out of combat
    movePartyTo(){}

    // move single party member (out of combat?)
    moveTo(){}

    /*  gets all gameobjects with the creature tag. If
        creature not in initialized list, create event
        subscriptions
    */
    updateCreatureSubscriptions(){
        var creatureList = objectRegister.getByTag("creature");
        creatureList.forEach(creature=>{
            if(this.initializedCreatures.indexOf(creature.id) == -1){
                creature.events.on("clicked", this.onCreatureClicked.bind(this));
                this.initializedCreatures.push(creature.id);
            }
        });
    }

    onCreatureClicked(event){
        console.log(objectRegister.objects[event.id]);
    }

    buildMachine(){
        var machine = new StateMachine("FREEROAM");

        // -------------------------------------------
        const FREE_ROAM = new State({
            "combatStart": "COMBAT_START"
        });
        // -------------------------------------------
        const COMBAT_START = new State({
            "combatInitComplete": "IN_COMBAT"
        });
        COMBAT_START.onEnter = ()=>{
            // 1. display combat start ui animation
            // 2. roll initiative for each participant
        };
        // -------------------------------------------
        const IN_COMBAT = new State({
            "combatEnd": "FREEROAM"
        });

        machine.states = {
            "FREE_ROAM": FREE_ROAM,
            "COMBAT_START": COMBAT_START,
            "IN_COMBAT": IN_COMBAT
        };
        return machine;
    }

}