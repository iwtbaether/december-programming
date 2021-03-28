import { GuideTypes } from "../garden/Juice";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Magic_Skill extends SingleManagedSkill {

    /*
    get data (): Magic_Data {
        return this.manager.engine.datamap.magic;
    }

    get skillData () {
        return this.manager.engine.datamap.skillManager.magic;
    }

    /**
     maxMana: CalcedDecimal = new CalcedDecimal(()=>{
         let size = new Decimal(0);
         let jobID = this.manager.engine.datamap.jobs.notReset.jobID;
         if (jobID === 0) {
            size = new Decimal(0);
        } else if (jobID > 1) {
            size = new Decimal(1000)
        } else if (jobID === 1) {
            size = this.manager.engine.datamap.jobs.jobProgress;
        } else throw new Error('lmao error')    

        return size;
        
    })
    */

}

export interface Magic_Data {
    spellbook: GuideTypes | null;
}

export function Magic_Data_Init (): Magic_Data {
    return {
        spellbook: null
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