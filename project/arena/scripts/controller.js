import { GameObject, objectRegister } from "../../../engine/src/gameObject.js";
import { input,canvas } from "../../../engine/main.js";
import { State, StateMachine } from "../../../engine/src/utils.js";
import { InterfaceTile, InterfaceRoot } from "./interface.js";

export class Controller extends GameObject{

    /*  camera: the scenes camera object 
        collisionMap: the collision data of the current map
        partList: list of player controlled creatures
        initializedCreatures: creatures who have had their subscriptions initialized
        combatants: list of creatures
        machine: state machine
    */
    constructor(camera, collisionMap, partyList){
        super();

        this.camera = camera;
        this.collisionMap = collisionMap;
        this.partyList = partyList;
        this.partyLeaderIndex = null;

        this.initializedCreatures = [];
        this.updateCreatureSubscriptions();

        this.combatants = [];
        this.turnIndex = 0;
        // this.initiativeTracker = buildInitiativeTracker();

        this.machine = this.buildMachine();

    }

    updateCreatureSubscriptions(){
        var creatureList = objectRegister.getByTag("creature");
        creatureList.forEach(creature=>{
            if(this.initializedCreatures.indexOf(creature.id) == -1){
                creature.events.on("clicked", this.onCreatureClicked.bind(this));
                this.initializedCreatures.push(creature.id);
            }
        });
    }

    update(dt){
        const state = this.machine.currentState
        if(state == "FREEROAM" && this.partyLeaderIndex !== null){
            this.wasdMove();
        }
        if(input.pressed["Escape"]){
            
            this.camera.freeMove();
            this.partyLeaderIndex = null;
        }
    }

    onCreatureClicked(event){
        var clicked = objectRegister.objects[event.id];
        console.log(clicked);

        const inPartyIndex = this.partyList.indexOf(clicked);
        // set party leader
        if(this.machine.currentState == "FREEROAM" && inPartyIndex != -1){
            this.partyLeaderIndex = inPartyIndex;
            this.camera.follow(this.partyList[this.partyLeaderIndex].worldPosition);
        }
    }

    buildMachine(){
        var machine = new StateMachine("FREEROAM");

        // -------------------------------------------
        const FREE_ROAM = new State({
            "combatStart": "IN_COMBAT"
        });
        // -------------------------------------------
        const IN_COMBAT = new State({
            "combatEnd": "FREEROAM"
        });

        machine.states = {
            "FREE_ROAM": FREE_ROAM,
            "IN_COMBAT": IN_COMBAT
        };
        return machine;
    }

    /*  enemies: list of enemy creatures
    */
    startCombat(enemies){
        this.combatants = this.partyList.concat(enemies);
        this.rollInitiative();
        this.turnIndex = 0;
        this.camera.setTargetPosition(this.combatants[0].position.x, this.combatants[0].position.y);
        // this.initiativeTracker.show();
    }

    incrementTurn(){
        this.turnIndex = (this.turnIndex < this.combatants.length) ? this.turnIndex + 1 : 0;
        this.camera.setTargetPosition(this.combatants[this.turnIndex].position.x, this.combatants[this.turnIndex].position.y);
    }

    rollInitiative(){
        this.combatants.forEach(creature => {
            creature.initiativeRoll = Dice(creature.data.initiative)
        });
        this.combatants.sort((a, b)=>{
            return b.initiativeRoll - a.initiativeRoll;
        });
        console.info("Combatants: ", this.combatants);
    }

    wasdMove(){
        if(this.partyList[this.partyLeaderIndex].machine.currentState == "IDLE"){
            const partyLeaderPosition = this.partyList[this.partyLeaderIndex].position;
            // this.partyList[this.partyLeaderIndex].setTargetPosition(partyLeaderPosition.x + 0.5, partyLeaderPosition.y + 0.5);
            var x = 0;
            var y = 0;
            if(input.pressed["KeyA"]){
                x -= 1;
            }
            if(input.pressed["KeyD"]){
                x += 1;
            }
            if(input.pressed["KeyW"]){
                y -= 1;
            }
            if(input.pressed["KeyS"]){
                y += 1;
            }
            if(x !=0 || y!= 0){
                const partyLeaderPosition = this.partyList[this.partyLeaderIndex].position;
                this.partyList[this.partyLeaderIndex].setTargetPosition(partyLeaderPosition.x + x, partyLeaderPosition.y + y);
            }
        }
    }

}