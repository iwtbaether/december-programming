import Engine from "./Engine";

export default class EnergyModule {
    constructor(public engine: Engine) {


    }

    energyPerClick = () => {
        let mult = this.engine.energyGainMult();
        let base = this.engine.energyGainClickBase();
        return mult.times(base);
    }

    energyGainFromActivity = () => {
        let mult = this.engine.energyGainMult();
        let base = this.engine.energyGainFromActivityBase();
        return mult.times(base);
    }


}