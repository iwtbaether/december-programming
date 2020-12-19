import Decimal from "break_infinity.js";
import Engine from "../Engine";

export default class Matter {
    constructor(public engine: Engine) {

    }

    convertEnergyToMatter = () => {
        const e = this.engine.datamap.cell.a;
        const max_m = Decimal.floor(e.divideBy(MATTER_COST_ENERGY));
        this.engine.energyResource.loseResource(max_m.times(MATTER_COST_ENERGY));
        //this.matterResource.gainResourse(max_m)
    }


}

function energyToMatter () {
    //e=mc^2
    //e/(c^2) = m
}

const speedOfLight_mps = 299792458
const MATTER_COST_ENERGY = speedOfLight_mps * speedOfLight_mps;