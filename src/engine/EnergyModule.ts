import Decimal from "break_infinity.js";
import Engine from "./Engine";

export default class EnergyModule {
    constructor(public engine: Engine) {
    }

    setEnergyValues = () => {
        this.setEnergyGainMult();
        this.setEnergyPerClick();
        this.setEnergyGainFromActivity();
        this.setEnergyGainFromAutoClickers();
    }

    energyPerClick: Decimal = new Decimal(0);
    setEnergyPerClick = () => {
        let mult = this.energyGainMult;
        let base = this.energyGainClickBase();
        this.energyPerClick = mult.times(base);
    }

    energyGainFromActivity: Decimal = new Decimal(0);
    setEnergyGainFromActivity = () => {
        let mult = this.energyGainMult;
        let base = this.energyGainFromActivityBase();
        this.energyGainFromActivity = mult.times(base);
    }

    energyGainFromAutoClickers: Decimal = new Decimal(0);
    setEnergyGainFromAutoClickers = () => {
        let mult = this.energyGainMult;
        let base = this.energyGainFromActivityBase();
        this.energyGainFromAutoClickers = mult.times(base);
    }

    energyGainClickBase = () => {
        return this.engine.effort.count.add(1).minus(this.engine.doomUpgrade1.count);
    }

    energyGainPerSecondBase = (): Decimal => {
        return this.engine.effort.count;
    }

    energyGainFromActivityBase = () => {
        return this.engine.effort.count.add(1).times(2);
    }

    energyGainMult: Decimal = new Decimal(0);
    totalEnergyGainIncreased: Decimal = new Decimal(0);
    totalEnergyGainMore: Decimal = new Decimal(0);
    setEnergyGainMult = () => {
        this.totalEnergyGainIncreased = this.engine.drive.count.add(this.engine.antiDrive.count);
        const mult2 = this.engine.doomUpgrade3.count.add(1)
        const mult3 = this.engine.datamap.cell.determination.add(1)
        this.totalEnergyGainMore = mult2.times(mult3);
        this.energyGainMult = Decimal.times(this.totalEnergyGainIncreased.add(1),this.totalEnergyGainMore);
    }


}