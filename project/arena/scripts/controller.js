import { objectRegister } from "../../../engine/src/gameObject";


export class controller{

    /*  camera: the scenes camera object 
        playerList: list of player controllable creature ids
    */
    constructor(camera, partyList){
        this.camera = camera;
    }

    startCombat(hostileGroupOne, hostileGroupTwo=[], allies=[]){}

    // currently controlled party member
    setPartyLeader(){}

    // navigation out of combat
    movePartyTo(){}

    // move single party member (out of combat?)
    moveTo(){}

}