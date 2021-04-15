import Decimal from "break_infinity.js";
import Engine from "../Engine";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { moreDecimal } from "../externalfns/util";

export default class GloomManager {
    constructor(public engine: Engine) {

    }

    extraLoad = () => {
        this.gloomMulti.set();
    }

    gloomMulti: CalcedDecimal = new CalcedDecimal(()=>{
        let base = new Decimal(1);
        if (this.engine.skillManager.skills.patience.totalFormPowers.totalExtraPowers.gloom) {
            base = moreDecimal(base, this.engine.skillManager.skills.patience.totalFormPowers.totalExtraPowers.gloom.times(.01));
        }
        return base; 
    })
}