import Decimal from "break_infinity.js";
import Engine from "./Engine";

export default class EnergyModule {
    constructor(public engine: Engine) {
    }

    get energyEquipmentMods () {
        return this.engine.crafting.energyCalcedData;
    }

    setEnergyValues = () => {
        this.setEnergyGainBase();
        this.setEnergyGainMult();
        this.setEnergyPerClick();
        this.setEnergyGainFromActivity();
        this.setEnergyGainFromAutoClickers();
    }

    energyPerClick: Decimal = new Decimal(0);
    setEnergyPerClick = () => {
        let mult = this.energyGainMult.times(this.energyEquipmentMods.clickMore);
        let base = this.energyGainClickBase();
        this.energyPerClick = mult.times(base);
    }

    energyGainFromActivity: Decimal = new Decimal(0);
    setEnergyGainFromActivity = () => {
        let mult = this.energyGainMult.times(this.energyEquipmentMods.hoverMore);
        let base = this.energyGainFromActivityBase();
        this.energyGainFromActivity = mult.times(base);
    }

    energyGainFromAutoClickers: Decimal = new Decimal(0);
    setEnergyGainFromAutoClickers = () => {
        let base = this.energyPerClick;
        let mult = this.energyEquipmentMods.clicksPerSecond;
        this.energyGainFromAutoClickers = Decimal.times(mult,base);
    }

    energyGainBase: Decimal = new Decimal(0);
    setEnergyGainBase = () => {
        this.energyGainBase = this.engine.effort.count.add(this.energyEquipmentMods.baseGain);
    }

    energyGainClickBase = () => {
        return this.energyGainBase.add(1).minus(this.engine.doomUpgrade1.count);
    }

    energyGainPerSecondBase = (): Decimal => {
        return this.energyGainBase;
    }

    energyGainFromActivityBase = () => {
        return this.energyGainBase.add(1).times(2);
    }

    energyGainMult: Decimal = new Decimal(0);
    totalEnergyGainIncreased: Decimal = new Decimal(0);
    totalEnergyGainMore: Decimal = new Decimal(0);
    setEnergyGainMult = () => {
        this.totalEnergyGainIncreased = this.engine.drive.count.add(this.engine.antiDrive.count).add(1).add(this.energyEquipmentMods.increasedGain);
        const mult2 = this.engine.doomUpgrade3.count.add(1)
        const mult3 = this.engine.datamap.cell.determination.add(1)
        this.totalEnergyGainMore = mult2.times(mult3).times(this.energyEquipmentMods.moreGain);
        this.energyGainMult = Decimal.times(this.totalEnergyGainIncreased,this.totalEnergyGainMore);
    }

    


}