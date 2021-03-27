import Engine from "../Engine";
import { GuideTypes } from "../garden/Juice";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Magic extends SingleManagedSkill {


    get data (): Magic_Data {
        return this.manager.engine.datamap.magic;
    }

    get skillData () {
        return this.manager.engine.datamap.skillManager.magic;
    }

}

export interface Magic_Data {
    spellbook: GuideTypes | null;
}

export function Magic_Data_Init (): Magic_Data {
    return {
        spellbook: null
    }  
}

class SingleMagicSpell {
    constructor(public info: SpellInformation) {

    }
}

interface SpellInformation {
    //if the spell requires a guide
    reqGuide?: GuideTypes
    //base cd in milliseconds
    cooldown: number
    manaCost: number
    name: string
    description: string
    action: VoidFunction
}