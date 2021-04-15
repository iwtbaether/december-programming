import Decimal from "break_infinity.js";
import { Datamap } from "../Datamap";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { GuideTypes } from "../garden/Juice";
import { Magic_Data } from "./MagicTypes";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Magic_Skill extends SingleManagedSkill {

    
    get data (): Magic_Data {
        return this.engine.datamap.magic;
    }

    get skillData () {
        return this.engine.datamap.skillManager.magic;
    }

    //CALC MAX EVERY 60 SECONDS
    calcTime = 60 //seconds;
    calcTicker = 0; //seconds
    magicDelta = (deltaS: number) => {
        this.data.currentMana = Decimal.min(
            this.maxMana.current,
            this.data.currentMana.add(deltaS)
        )

        this.calcTicker += deltaS;
        if (this.calcTicker >= 60) {
            this.calcTicker = 0;
            this.maxMana.set();
        }
    }


    
     maxMana: CalcedDecimal = new CalcedDecimal(()=>{
         let manaFromSize = ZERO;
         let jobID = this.engine.datamap.jobs.notReset.jobID;
         if (jobID === 0) {
            manaFromSize = ZERO;
        } else if (jobID > 1) {
            manaFromSize = MAX_MANA_FROM_SIZE
        } else if (jobID === 1) {
            manaFromSize = MAX_MANA_FROM_SIZE.min(
                this.engine.datamap.jobs.jobProgress.div(1000000)
            )
        } else throw new Error('lmao error')    

        if (manaFromSize.greaterThan(this.data.currentMana)) {
            this.data.currentMana = manaFromSize;
        }
        return manaFromSize;
        
    })
    

}

const ZERO = new Decimal(0);
const MAX_MANA_FROM_SIZE = new Decimal(3500)
