import { throws } from "assert";
import Decimal from "break_infinity.js";
import { timeStamp } from "console";
import { basename } from "path";
import { EnumType, isTypeNode } from "typescript";
import { gEngine } from "../..";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { canCheat, getRandomInt, randomEnum, randomEnumFromListWithExclusions, randomEnumWithExclusion } from "../externalfns/util";
import { GardenData } from "../garden/Garden";
import { DoomStoneModList, EnergyItemModList, GardeningItemModList } from "./ModLists";

export default class Crafting {
    constructor(public engine: Engine) {

    }

    get data() {
        return this.engine.datamap.crafting;
    }

    reset = () => {

        //keep exhcnage upgrades if fortitue is unlocked (level 0)
        if (this.engine.datamap.skillManager.fortitude.unlocked) {
            const keep = this.engine.datamap.crafting.research;
            this.engine.datamap.crafting = CraftingData_Init();
            this.engine.datamap.crafting.research = keep;
        } else {   
            this.engine.datamap.crafting = CraftingData_Init();
        }
        
        this.calc();
    }

    makeCatalyst = (size: number) => {
        if (this.data.currency.transmutes < 1) return;

        this.data.currency.transmutes--;
        this.data.currentCraft = makeSizedEnergyItem(size);
        this.engine.notify();
    }

    makeRandomCatalyst = () => {

    }

    makeRandomGardeningEquipment = () => {
        if (this.data.currency.transmutes < 1) return;
        this.data.currency.transmutes--;
        this.engine.save();

        this.data.currentCraft = makeGardeningItem();
        this.engine.notify();
    }


    getCurrency = () => {
        this.data.currency.transmutes += 10;
        this.data.currency.augmentations += 10;
    }

    getRandomACurrency = () => {
        let rng = getRandomInt(0, 99);
        let type = rng % 3;

        if (type === 0) this.data.currency.transmutes++;
        if (type === 1) this.data.currency.augmentations++;
        if (type === 2) this.data.currency.doomOrbs++;
        this.engine.notify();
    }

    getRandomCurrency = () => {
        let rng = getRandomInt(0, 99);
        let type = rng % 2;
        if (type === 0) this.data.currency.transmutes++;
        if (type === 1) this.data.currency.augmentations++;
    }

    getRandomCurrencyCount = (count: number) => {
        let rng = getRandomInt(0, 99);
        let type = rng % 2;
        if (type === 0) this.data.currency.transmutes += count;
        if (type === 1) this.data.currency.augmentations += count;
    }

    calc = () => {
        this.setDoomAndGloomFromEQ();
        this.setEnergyCalcedData();
        this.setGardeningCalcedData();
    }

    setDoomAndGloomFromEQ = () => {
        let base = this.calcDoomEq();
        this.DoomAndGloomFromEQ = base;
        this.engine.calced_DoomPerPile.set();
    }

    addModToCurrentCraft = () => {
        if (this.cannotCraft()) return;
        if (!canCheat) this.engine.save();
        if (this.data.currency.augmentations < 1) return;
        if (this.data.currentCraft) {
            let type = this.data.currentCraft.itemType;

            if ([1, 2, 3].includes(type)) {
                const cata = this.data.currentCraft as EnergyItem;
                if (cata.mods.length >= maxMods(cata)) return;
                this.data.currency.augmentations--;
                this.data.currentCraft = addRandomEnergyMod(cata);
            } else if ([5, 6, 7].includes(type)) {
                const item = this.data.currentCraft as GardeningItem;
                if (item.mods.length > maxMods(item)) return;
                this.data.currency.augmentations--;
                this.data.currentCraft = addRandomGardeningMod(item);
            }

        }
        this.engine.notify();
    }

    clearCraft = () => {
        if (this.data.currentCraft?.doomed) this.gainDoomShards(5)
        this.data.currentCraft = null;
        this.getRandomCurrency();
        if (this.engine.datamap.doomResearch.gloomShard) {
            this.gainDoomShards(1);
        }
        this.engine.notify();
    }

    gainDoomShards = (gain: number) => {
        if ((this.data.currency.doomShards += gain) >= 20) {
            if (this.data.vaalProgress === 0) this.data.vaalProgress = 1;
            this.data.currency.doomOrbs += Math.floor(this.data.currency.doomShards / 20);
            this.data.currency.doomShards = this.data.currency.doomShards % 20;
        }
    }

    applyDoomToCraft = () => {
        if (this.cannotCraft()) return;
        if (this.data.currency.doomOrbs < 1) return;
        if (!canCheat) this.engine.save();
        let rng = getRandomInt(0, 3);
        if (rng === 0) this.data.currentCraft = null;
        if (rng === 1) if (this.data.currentCraft) {
            this.data.currentCraft.doomed = true;
            let type = this.data.currentCraft.itemType;
            if ([1, 2, 3].includes(type)) {
                let item = this.data.currentCraft as EnergyItem;
                item = addRandomEnergyMod(item, true);
                item.mods[item.mods.length - 1].doomed = true;
                this.data.currentCraft = item;

            } else if ([5, 6, 7].includes(type)) {
                let item = this.data.currentCraft as GardeningItem;
                item = addRandomGardeningMod(item, true);
                item.mods[item.mods.length - 1].doomed = true;
                this.data.currentCraft = item;

            }

        }
        if (rng === 2) if (this.data.currentCraft) {
            this.data.currentCraft.doomed = true;
        }
        if (rng === 3) if (this.data.currentCraft) {
            this.data.currentCraft = createDoomStone(this.data.currentCraft);
        }
        this.data.currency.doomOrbs -= 1;
    }

    cannotCraft = () => {
        return (this.itIsDoomed() || (this.data.currentCraft === null))
    }

    itIsDoomed = () => {
        return (this.data.currentCraft?.doomed === true)
    }

    equipCurrentCraft = () => {
        const toEquip = this.data.currentCraft;

        if (!this.data.currentCraft) return;
        const cc = this.data.currentCraft;
        const it = cc.itemType

        if (it === 1) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedEnergyItem;
            this.data.equipedEnergyItem = eEquip;

            this.setEnergyCalcedData();
        }

        else if (it === 2) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedMedEnergyItem;
            this.data.equipedMedEnergyItem = eEquip;

            this.setEnergyCalcedData();
        }

        else if (it === 3) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedSmallEnergyItem;
            this.data.equipedSmallEnergyItem = eEquip;

            this.setEnergyCalcedData();
        }

        else if (it === ItemTypes.MagicWateringCan) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.wateringCan;
            this.data.equipped.wateringCan = gEquip

            this.setGardeningCalcedData();

        }

        else if (it === ItemTypes.MagicSecateurs) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.seceteurs;
            this.data.equipped.seceteurs = gEquip
            this.setGardeningCalcedData();
        }

        else if (it === ItemTypes.GardeningHat) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.gardeningCap;
            this.data.equipped.gardeningCap = gEquip
            this.setGardeningCalcedData();
        }

        else if (it === ItemTypes.DoomedCrystal) {
            const gEquip = toEquip as DoomStone;
            this.data.currentCraft = this.data.equipped.doomStone;
            this.data.equipped.doomStone = gEquip;

            this.calc();
        }


        this.engine.notify();
    }

    calcDoomEq = () => {
        let base: DoomValues = {
            BaseDoomGain: 0,
            //DoomPerSecond: 0,
            //GloomPerSecond: 0,
            IncreasedDoomGain: 0,
            MoreDoomGain: 1,
        }
        if (this.data.equipped.doomStone !== null) {
            base = DoomItemCalc(this.data.equipped.doomStone, base)
        }
        return base;
    }

    DoomAndGloomFromEQ: DoomValues = this.calcDoomEq();



    calcEnergyEquipment = () => {
        //console.log('why');

        let base: EnergyItemValues = {
            baseGain: 0,
            clicksPerSecond: 0,
            increasedGain: 0,
            clickMore: 1,
            moreGain: 1,
            hoverMore: 1,
            passiveMore: 1,
        }
        base = energyItemCalc2(this.data.equipedEnergyItem, base);
        base = energyItemCalc2(this.data.equipedMedEnergyItem, base);
        base = energyItemCalc2(this.data.equipedSmallEnergyItem, base);
        if (this.data.equipped.doomStone?.energyMod) {
            base = modifyEnergyItemValues(this.data.equipped.doomStone.energyMod, base)
        }

        return base;
    }

    calcGardeningEquipment = () => {
        let base: GardeningItemValus = {
            autoHarvest: false,
            autoPlant: false,
            autoWater: false,
            bagSlots: 0,
            gardenPlots: 0,
            doomChance: 0,
            fruitGainBase: 0,
            fruitGainMulti: 1,
            plantGrowthMulti: 1,
            waterTimeBase: 0,
            waterTimeMulti: 1,
            seedGainMore: 1,
        }

        base = gardeningItemCalc(this.data.equipped.wateringCan, base);
        base = gardeningItemCalc(this.data.equipped.seceteurs, base);
        base = gardeningItemCalc(this.data.equipped.gardeningCap, base);
        if (this.data.equipped.doomStone?.gardeningMod) {
            base = modifyGardeningItemValues(this.data.equipped.doomStone.gardeningMod, base)
        }

        return base
    }

    energyCalcedData: EnergyItemValues = this.calcEnergyEquipment();

    setEnergyCalcedData = () => {
        let base = this.calcEnergyEquipment();
        this.energyCalcedData = base;
        this.engine.calcEnergy();
    }

    gardeningCalcData: GardeningItemValus = this.calcGardeningEquipment();

    setGardeningCalcedData = () => {
        let base = this.calcGardeningEquipment();
        this.gardeningCalcData = base;
        this.engine.garden.setTempData();

    }

    breakWateringCan = () => {
        //console.log('watering can broke');

        let can = this.data.equipped.wateringCan;
        if (can) {

            let unbroken = can.mods.findIndex(mod => mod.mod === GardeningItemModList.NeverBreak)
            if (unbroken < 0) {
                let index = can.mods.findIndex(mod => mod.mod === GardeningItemModList.AutoWater)
                can.mods[index].mod = GardeningItemModList.Broken;
                this.setGardeningCalcedData();
            }
        }
    }
    
    //returns true if can gets fixxed
    fixWateringCan = () => {
        //console.log('watering can fox!');

        let can = this.data.equipped.wateringCan;
        if (can) {
                let index = can.mods.findIndex(mod => mod.mod === GardeningItemModList.Broken)
                if (index >= 0) {
                    can.mods[index].mod = GardeningItemModList.AutoWater;
                    this.setGardeningCalcedData();
                    return true;
                }
        }
        return false;
    }






}

function createDoomStone(item: ItemData): DoomStone | null {
    const strone: DoomStone = {
        itemType: ItemTypes.DoomedCrystal,
        doomMod: getRandomDoomMod(),
        doomed: true,
    }

    const type = item.itemType;

    if ([1, 2, 3].includes(type)) {
        const specitem = item as EnergyItem;
        const rngMod = specitem.mods[getRandomInt(0, specitem.mods.length - 1)]
        rngMod.doomed = true;
        strone.energyMod = rngMod;

    } else if ([5, 6, 7].includes(type)) {
        const specitem = item as GardeningItem;
        const rngMod = specitem.mods[getRandomInt(0, specitem.mods.length - 1)]
        rngMod.doomed = true;
        strone.gardeningMod = rngMod;
    } else return null;


    return strone


}


function energyItemCalc2(item: EnergyItem | null, base: EnergyItemValues): EnergyItemValues {

    if (item === null) return base;
    item.mods.forEach(mod => {
        base = modifyEnergyItemValues(mod, base);
    });
    return base
}

function modifyEnergyItemValues(mod: EnergyItemMod, values: EnergyItemValues): EnergyItemValues {
    //console.log(mod, values);

    switch (mod.mod) {
        case EnergyItemModList.BaseGain:
            values.baseGain += mod.value;
            break;

        case EnergyItemModList.ClickMore:
            values.clickMore *= 1 + mod.value * .1;
            break;

        case EnergyItemModList.ClicksPerSecond:
            values.clicksPerSecond += mod.value;
            break;

        case EnergyItemModList.HoverMore:
            values.hoverMore *= 1 + mod.value * .1;
            break;

        case EnergyItemModList.IncreasedGain:
            values.increasedGain += mod.value;
            break;

        case EnergyItemModList.MoreGain:
            values.moreGain *= 1 + mod.value * .1;
            break;

        case EnergyItemModList.PassiveMore:
            values.passiveMore *= 1 + mod.value * .1;
            break;

        default:
            break;
    }

    return values;
}

function DoomItemCalc(item: DoomStone | null, base: DoomValues): DoomValues {
    if (item === null) return base;
    base = modifyDoomValues(item.doomMod, base);
    return base;
}

function modifyDoomValues(mod: DoomStoneMod, values: DoomValues): DoomValues {
    switch (mod.mod) {
        case DoomStoneModList.BaseDoomGain:
            values.BaseDoomGain += mod.value;
            break;

        /**
         * 
         case DoomStoneModList.DoomPerSecond:
             values.DoomPerSecond += mod.value
             break;
             
             case DoomStoneModList.GloomPerSecond:
                 values.GloomPerSecond += mod.value
                 break;
                 */

        case DoomStoneModList.IncreasedDoomGain:
            values.IncreasedDoomGain += (mod.value * .1)
            break;

        case DoomStoneModList.MoreDoomGain:
            values.MoreDoomGain *= (1 + (mod.value * .05))
            break;

        default:
            break;
    }

    return values;
}


function gardeningItemCalc(item: GardeningItem | null, base: GardeningItemValus): GardeningItemValus {

    if (item === null) return base;
    item.mods.forEach(mod => {
        base = modifyGardeningItemValues(mod, base);
    });
    return base
}

function modifyGardeningItemValues(mod: GardeningItemMod, values: GardeningItemValus): GardeningItemValus {
    switch (mod.mod) {
        case GardeningItemModList.AutoHarvest:
            values.autoHarvest = true;
            break;

        case GardeningItemModList.AutoPlant:
            values.autoPlant = true;
            break;

        case GardeningItemModList.AutoWater:
            values.autoWater = true;
            break;

        case GardeningItemModList.BiggerBag:
            values.bagSlots++;
            break;

        case GardeningItemModList.BiggerGarden:
            values.gardenPlots++;
            break;

        case GardeningItemModList.DoomRate:
            values.doomChance += mod.value
            break;

        case GardeningItemModList.FruitGainBase:
            values.fruitGainBase += mod.value * .1;
            break;

        case GardeningItemModList.FruitGrainMult:
            values.fruitGainMulti *= (1 + (mod.value * .1));
            break;

        case GardeningItemModList.PlantGrowthSpeed:
            values.plantGrowthMulti *= 1 + mod.value * .1;
            break;

        case GardeningItemModList.WateringDurationBase:
            values.waterTimeBase += mod.value;
            break;

        case GardeningItemModList.WateringDurationMult:
            values.waterTimeMulti *= 1 + mod.value * .1;
            break;
        case GardeningItemModList.SeedGainMore:
            values.seedGainMore *= 1 + (mod.value * .1);
            break;

        case GardeningItemModList.NeverBreak:
            values.fruitGainMulti *= values.fruitGainMulti / 2;
            break;

        default:
            break;
    }

    return values;
}

export interface CraftingData {
    currentCraft: ItemData | null,
    equipedEnergyItem: EnergyItem | null,
    equipedMedEnergyItem: EnergyItem | null,
    equipedSmallEnergyItem: EnergyItem | null,
    equipped: {
        wateringCan: GardeningItem | null;
        seceteurs: GardeningItem | null;
        gardeningCap: GardeningItem | null;
        doomStone: DoomStone | null;
    };
    currency: CraftingCurrency;
    vaalProgress: number;
    research: {
        moreEnergy: number;
        moreDoom: number;
        moreCrafting: number;
        moreGarden: number;
        moreSpellBook: number;
        moreJobs1: number;
        moreJobs2: number;
        moreJobs3: number;
        research_discardAversion: boolean;
        rph1: boolean;
        rph2: boolean;
        rph3: boolean;
        rph4: boolean;
        rph5: boolean;
        rph6: boolean;
    }
}

interface CraftingCurrency {
    transmutes: number, //makes item
    alterations: number,  //rerolls properties
    augmentations: number, //adds property
    reglas: number, //
    scours: number, //clears mods from item
    divines: number, //rerolls values of mods on item
    doomShards: number, //
    doomOrbs: number,
    chaos: number,
}

export function CraftingData_Init(): CraftingData {
    return {
        currentCraft: null,
        equipedEnergyItem: null,
        equipedMedEnergyItem: null,
        equipedSmallEnergyItem: null,
        equipped: {
            gardeningCap: null,
            seceteurs: null,
            wateringCan: null,
            doomStone: null,
        },
        currency: {
            transmutes: 0,
            alterations: 0,
            augmentations: 0,
            reglas: 0,
            divines: 0,
            scours: 0,
            doomShards: 0,
            doomOrbs: 0,
            chaos: 0
        },
        vaalProgress: 0,
        research: {
            moreEnergy: 0,
            moreDoom: 0,
            moreCrafting: 0,
            moreGarden: 0,
            moreSpellBook: 0,
            moreJobs1: 0,
            moreJobs2: 0,
            moreJobs3: 0,
            research_discardAversion: false,
            rph1: false,
            rph2: false,
            rph3: false,
            rph4: false,
            rph5: false,
            rph6: false,
        }
    }
}


function makeSizedEnergyItem(size: number): EnergyItem {
    const sizes = [
        ItemTypes.SmallEnergyItem,
        ItemTypes.MediumEnergyItem,
        ItemTypes.LargeEnergyItem
    ]
    let chosen = sizes[size]
    let item: EnergyItem = {
        itemType: chosen,
        mods: [],
    }
    item = addRandomEnergyMod(item);
    return item
}

function rollForUnique() {
    let rng = getRandomInt(1, 100)
    return rng === 100
    return true;
}

function makeGardeningItem(): GardeningItem {
    const types = [
        ItemTypes.MagicSecateurs,
        ItemTypes.MagicWateringCan,
        ItemTypes.GardeningHat
    ]

    let chosen = types[getRandomInt(0, 2)]
    let item: GardeningItem = {
        itemType: chosen,
        mods: [],
    }

    if (gEngine.theExchange.CU1.true && rollForUnique() && chosen === ItemTypes.MagicWateringCan) {
        if (chosen === ItemTypes.MagicWateringCan) {
            item.mods.push({ mod: GardeningItemModList.NeverBreak, value: 1 })
            item.mods.push({ mod: GardeningItemModList.AutoWater, value: 1 })
            item.unique = 1;
        }
    } else item = addRandomGardeningMod(item);

    return item
}


function getEnergyModMaxValue(mod: EnergyItemModList): number {
    switch (mod) {
        case EnergyItemModList.ClicksPerSecond:
            return 10;
            break;
        case EnergyItemModList.IncreasedGain:
            return 50;
            break;
        case EnergyItemModList.BaseGain:
            return 50;
            break;

        default:
            return 10;
            break;
    }
}

function addRandomEnergyMod(item: EnergyItem, bypass?: boolean): EnergyItem {
    if (!bypass) if (item.mods.length >= maxMods(item)) return item;

    let exclusions = getEnergyModExclusions(item)

    let baseList = [
        EnergyItemModList.BaseGain,
        EnergyItemModList.ClickMore,
        EnergyItemModList.ClicksPerSecond,
        EnergyItemModList.HoverMore,
        EnergyItemModList.IncreasedGain,
        EnergyItemModList.MoreGain,
        EnergyItemModList.PassiveMore,
    ]

    let chosen = randomEnumFromListWithExclusions(baseList, exclusions)
    let max = getEnergyModMaxValue(chosen)

    let newMod: EnergyItemMod = {
        mod: chosen,
        value: getRandomInt(1, max)
    }

    item.mods.push(newMod);

    return item;
}

function getGardenModMaxValue(mod: GardeningItemModList): number {
    switch (mod) {
        case GardeningItemModList.AutoHarvest:
        case GardeningItemModList.AutoPlant:
        case GardeningItemModList.AutoWater:
        case GardeningItemModList.BiggerBag:
        case GardeningItemModList.BiggerGarden:
            return 1;
            break;
        case GardeningItemModList.WateringDurationBase:
            return 600;
            break;
        case GardeningItemModList.FruitGainBase:
            return 20;
            break;
        default:
            return 10;
            break;
    }
}

function addRandomGardeningMod(item: GardeningItem, bypass?: boolean): GardeningItem {
    if (!bypass) if (item.mods.length >= maxMods(item)) return item;

    let baseList = [
        GardeningItemModList.BiggerBag,
        GardeningItemModList.BiggerGarden,
        GardeningItemModList.DoomRate,
        GardeningItemModList.FruitGainBase,
        GardeningItemModList.FruitGrainMult,
        GardeningItemModList.PlantGrowthSpeed,
        GardeningItemModList.WateringDurationBase,
        GardeningItemModList.WateringDurationMult,
        GardeningItemModList.SeedGainMore,
    ]
    if (item.itemType === ItemTypes.MagicWateringCan) baseList.push(GardeningItemModList.AutoWater);
    if (item.itemType === ItemTypes.MagicSecateurs) baseList.push(GardeningItemModList.AutoHarvest);
    if (item.itemType === ItemTypes.GardeningHat) baseList.push(GardeningItemModList.AutoPlant);

    let exclusions = getGardeningModExclusions(item)
    let chosen = randomEnumFromListWithExclusions(baseList, exclusions)

    let newMod: GardeningItemMod = {
        mod: chosen,
        value: getRandomInt(1, getGardenModMaxValue(chosen))
    }

    item.mods.push(newMod);

    return item;
}

function getDoomStoneModValue(mod: DoomStoneModList): number {
    switch (mod) {

        default:
            return 10;
            break;
    }
}

function getRandomDoomMod(): DoomStoneMod {

    let baseList = [
        //DoomStoneModList.DoomPerSecond,
        //DoomStoneModList.GloomPerSecond,

        DoomStoneModList.BaseDoomGain,
        DoomStoneModList.IncreasedDoomGain,
        DoomStoneModList.MoreDoomGain,
    ]
    let chosen = randomEnumFromListWithExclusions(baseList, [])

    let newMod: DoomStoneMod = {
        mod: chosen,
        value: getRandomInt(1, getDoomStoneModValue(chosen)),
        doomed: true
    }

    return newMod;
}

export function maxMods(item: ItemData): number {
    if (item.itemType === ItemTypes.LargeEnergyItem) return 3;
    if (item.itemType === ItemTypes.MediumEnergyItem) return 2;
    if (item.itemType === ItemTypes.SmallEnergyItem) return 1;
    if (item.itemType === ItemTypes.MagicSecateurs) return 2;
    if (item.itemType === ItemTypes.MagicWateringCan) return 2;
    if (item.itemType === ItemTypes.GardeningHat) return 3;
    return 0;
}

function getEnergyModExclusions(item: EnergyItem): EnergyItemModList[] {
    let exclusions: EnergyItemModList[] = [];
    item.mods.forEach(mod => {
        exclusions.push(mod.mod)
    });
    return exclusions;
}

function getGardeningModExclusions(item: GardeningItem): GardeningItemModList[] {
    let exclusions: GardeningItemModList[] = [];
    item.mods.forEach(mod => {
        exclusions.push(mod.mod)
    });
    return exclusions;
}

export interface ItemData {
    itemType: ItemTypes,
    doomed?: boolean,
    unique?: number,
}

export interface ModData {
    value: number;
    doomed?: boolean;
}

export interface DoomStone extends ItemData {
    energyMod?: EnergyItemMod;
    gardeningMod?: GardeningItemMod;
    doomMod: DoomStoneMod;
}

export interface DoomStoneMod extends ModData {
    mod: DoomStoneModList
}

export interface EnergyItem extends ItemData {
    mods: EnergyItemMod[];
}

export interface EnergyItemMod extends ModData {
    mod: EnergyItemModList
}

export interface GardeningItem extends ItemData {
    mods: GardeningItemMod[];
}

export interface GardeningItemMod extends ModData {
    mod: GardeningItemModList
}

export enum ItemTypes {
    broken,
    LargeEnergyItem,
    MediumEnergyItem,
    SmallEnergyItem,
    DoomedCrystal,
    MagicWateringCan,
    MagicSecateurs,
    GardeningHat,
    PatiencePeace,
}


interface EnergyItemValues {
    clicksPerSecond: number,
    hoverMore: number,
    clickMore: number,
    passiveMore: number,
    baseGain: number,
    increasedGain: number,
    moreGain: number,
}

export interface DoomValues {
    MoreDoomGain: number,
    BaseDoomGain: number,
    IncreasedDoomGain: number,
    //DoomPerSecond: number,
    //GloomPerSecond: number,
}

interface GardeningItemValus {
    autoPlant: boolean;
    autoHarvest: boolean;
    autoWater: boolean;
    bagSlots: number;
    gardenPlots: number;
    fruitGainBase: number;
    fruitGainMulti: number;
    waterTimeBase: number;
    waterTimeMulti: number;
    plantGrowthMulti: number;
    doomChance: number;
    seedGainMore: number;
}

function getPossibleEnergyMods(modList: EnergyItemMod[]) {
    let defaultList = Object.values(EnergyItemModList)
    modList.forEach(mod => {
        //let find = defaultList.in
    });
}

/**
 * Energy Item Possible mods
 *  Clicks per second
 *
 *  Hover mult
 *  Click mult
 *  Per second mult
 *
 *  Base Energy Gain
 *  Increased Energy Gain
 *  More Energy Gain
 */

function unequip(type: ItemTypes, data: Datamap): Datamap {
    if (data.crafting.currentCraft !== null) return data;
    else {
        switch (type) {
            case ItemTypes.SmallEnergyItem:
                data.crafting.currentCraft = data.crafting.equipedSmallEnergyItem;
                data.crafting.equipedSmallEnergyItem = null;
                break;

            case ItemTypes.MediumEnergyItem:
                data.crafting.currentCraft = data.crafting.equipedMedEnergyItem;
                data.crafting.equipedMedEnergyItem = null;
                break;

            case ItemTypes.LargeEnergyItem:
                data.crafting.currentCraft = data.crafting.equipedEnergyItem;
                data.crafting.equipedEnergyItem = null;
                break;

            case ItemTypes.DoomedCrystal:
                data.crafting.currentCraft = data.crafting.equipped.doomStone;
                data.crafting.equipped.doomStone = null;
                break;

            case ItemTypes.GardeningHat:
                data.crafting.currentCraft = data.crafting.equipped.gardeningCap;
                data.crafting.equipped.gardeningCap = null;
                break;

            case ItemTypes.MagicSecateurs:
                data.crafting.currentCraft = data.crafting.equipped.seceteurs;
                data.crafting.equipped.seceteurs = null;
                break;

            case ItemTypes.MagicWateringCan:
                data.crafting.currentCraft = data.crafting.equipped.wateringCan;
                data.crafting.equipped.wateringCan = null;
                break;



            default:
                console.log('item type does not exist?');

                break;
        }
        return data;
    }

}

export function unEqItemType(it: ItemTypes) {
    const data = gEngine.datamap;
    if (data.crafting.currentCraft !== null) return;
    else {
        gEngine.datamap = unequip(it, data)
    }
    gEngine.crafting.calc();

    gEngine.notify();
}