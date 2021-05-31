import { objectRegister } from "../../../engine/src/gameObject.js";
import { canvas } from "../../../engine/main.js";
import { State, StateMachine } from "../../../engine/src/utils.js";
import { InterfaceTile, InterfaceRoot } from "./interface.js";

export class Controller{

    /*  camera: the scenes camera object 
        collisionMap: the collision data of the current map
        partList: list of player controlled creatures
        initializedCreatures: creatures who have had their subscriptions initialized
        combatants: list of creatures
        machine: state machine
    */
    constructor(camera, collisionMap, partyList){
        this.camera = camera;
        this.collisionMap = collisionMap;
        this.partyList = partyList;

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

    onCreatureClicked(event){
        console.log(objectRegister.objects[event.id]);
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

}

function buildInitiativeTracker(combatants){

    var horizontalOffset = canvas.width * 0.05;
    var verticalOffset = canvas.height * 0.0125;

    var rootImage = document.createElement("canvas")
    rootImage.width =  canvas.width - 2 * horizontalOffset;
    rootImage.height = 100;
    var ctx = rootImage.getContext("2d");
    ctx.beginPath()
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "6";
    ctx.rect(0, 0, rootImage.width, rootImage.height);
    ctx.stroke();
    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.fillRect(0,0, rootImage.width, rootImage.height);

    var root = new InterfaceTile(rootImage, horizontalOffset, verticalOffset, canvas.width - 2 * horizontalOffset, 100);



    var ui = new InterfaceRoot(root);

    return ui;
}