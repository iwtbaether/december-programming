import Decimal, { DecimalSource } from "break_infinity.js";
import Engine from "./Engine";
import { moreDecimal } from "./externalfns/util";

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

    showCalcs = () => {
        this.engine.datamap.popupUI = 2;
        this.engine.notify();
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
    clickerCount: number = 0;
    setEnergyGainFromAutoClickers = () => {
        let base = this.energyPerClick;
        let count = this.energyEquipmentMods.clicksPerSecond;
        this.clickerCount = count + this.engine.datamap.cell.d4.toNumber();
        if (this.engine.garden.juice.drinkPowers.g4) {
            this.clickerCount = this.clickerCount * (1+this.engine.garden.juice.drinkPowers.g4.toNumber())
        }
        this.energyGainFromAutoClickers = Decimal.times(this.clickerCount,base);
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
        return this.energyGainBase.add(1).times(9);
    }

    energyGainMult: Decimal = new Decimal(0);
    totalEnergyGainIncreased: Decimal = new Decimal(0);
    totalEnergyGainMore: Decimal = new Decimal(0);
    setEnergyGainMult = () => {
        this.totalEnergyGainIncreased = this.engine.drive.count.add(this.engine.antiDrive.count).add(1).add(this.energyEquipmentMods.increasedGain);
        const mult2 = this.engine.doomUpgrade3.count.add(1)
        const mult3 = this.engine.datamap.cell.determination.add(1)
        let mult4 = this.engine.datamap.cell.momentum.add(1)
        if (this.engine.theExchange.EU1.info.get()) { mult4 = moreDecimal(mult4, 1) }
        if (this.engine.theExchange.EU2.info.get()) { mult4 = moreDecimal(mult4, 1) }
        if (this.engine.theExchange.EU3.info.get()) { mult4 = moreDecimal(mult4, 1) }

        const dp = this.engine.garden.juice.drinkPowers;
        if (dp.hd) {
            mult4 = mult4.add(mult4.times(dp.hd.times(dp.basePower)))
        }

        if (this.engine.skillManager.skills.patience.totalFormPowers.totalExtraPowers.energy.greaterThan(0)) {
            mult4 = moreDecimal(mult4, this.engine.skillManager.skills.patience.totalFormPowers.totalExtraPowers.energy.times(.01))
        }

        this.totalEnergyGainMore = mult4.times(mult2).times(mult3).times(this.energyEquipmentMods.moreGain);
        this.energyGainMult = Decimal.times(this.totalEnergyGainIncreased,this.totalEnergyGainMore);
    }

    


}
