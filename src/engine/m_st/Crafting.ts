import { throws } from "assert";
import Decimal from "break_infinity.js";
import { basename } from "path";
import { EnumType, isTypeNode } from "typescript";
import Engine from "../Engine";
import { getRandomInt, randomEnum, randomEnumFromListWithExclusions, randomEnumWithExclusion } from "../externalfns/util";

export default class Crafting {
    constructor(public engine: Engine) {

    }

    get data() {
        return this.engine.datamap.crafting;
    }

    reset = () => {
        this.engine.datamap.crafting = CraftingData_Init();
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

        this.data.currentCraft = makeGardeningItem();
        this.engine.notify();
    }


    getCurrency = () => {
        this.data.currency.transmutes += 10;
        this.data.currency.augmentations += 10;
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
        this.setEnergyCalcedData();
        this.setGardeningCalcedData();
    }

    addModToCurrentCraft = () => {
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
        this.data.currentCraft = null;
        this.getRandomCurrency();
        this.engine.notify();
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
            this.engine.calcEnergy();
        }

        else if (it === 2) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedMedEnergyItem;
            this.data.equipedMedEnergyItem = eEquip;

            this.setEnergyCalcedData();
            this.engine.calcEnergy();
        }

        else if (it === 3) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedSmallEnergyItem;
            this.data.equipedSmallEnergyItem = eEquip;

            this.setEnergyCalcedData();
            this.engine.calcEnergy();
        }

        else if (it === ItemTypes.MagicWateringCan) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.wateringCan;
            this.data.equipped.wateringCan = gEquip

            this.setGardeningCalcedData(); this.engine.garden.setTempData();

        }

        else if (it === ItemTypes.MagicSecateurs) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.seceteurs;
            this.data.equipped.seceteurs = gEquip
            this.setGardeningCalcedData(); this.engine.garden.setTempData();
        }

        else if (it === ItemTypes.GardeningHat) {
            const gEquip = toEquip as GardeningItem;
            this.data.currentCraft = this.data.equipped.gardeningCap;
            this.data.equipped.gardeningCap = gEquip
            this.setGardeningCalcedData(); this.engine.garden.setTempData();
        }


        this.engine.notify();
    }


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
            waterTimeMulti: 1
        }

        base = gardeningItemCalc(this.data.equipped.wateringCan, base);
        base = gardeningItemCalc(this.data.equipped.seceteurs, base);
        base = gardeningItemCalc(this.data.equipped.gardeningCap, base);

        return base
    }

    energyCalcedData: EnergyItemValues = this.calcEnergyEquipment();

    setEnergyCalcedData = () => {
        let base = this.calcEnergyEquipment();
        this.energyCalcedData = base;
    }

    gardeningCalcData: GardeningItemValus = this.calcGardeningEquipment();

    setGardeningCalcedData = () => {
        let base = this.calcGardeningEquipment();
        this.gardeningCalcData = base;
    }







}


function energyItemCalc2(item: EnergyItem | null, base: EnergyItemValues): EnergyItemValues {

    if (item === null) return base;
    item.mods.forEach(mod => {
        base = modifyEnergyItemValues(mod, base);
    });
    return base
}

function modifyEnergyItemValues(mod: EnergyItemMod, values: EnergyItemValues): EnergyItemValues {
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
            values.waterTimeMulti *= 1 + mod.value;
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
    };
    currency: CraftingCurrency;
}

interface CraftingCurrency {
    transmutes: number, //makes item
    alterations: number,  //rerolls properties
    augmentations: number, //adds property
    reglas: number, //
    scours: number, //clears mods from item
    divines: number, //rerolls values of mods on item
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
        },
        currency: {
            transmutes: 0,
            alterations: 0,
            augmentations: 0,
            reglas: 0,
            divines: 0,
            scours: 0,
        }
    }
}


function makeSizedEnergyItem(size: number): EnergyItem {
    const sizes = [
        ItemTypes.TinyEnergyItem,
        ItemTypes.SmallEnergyItem,
        ItemTypes.EnergyItem
    ]
    let chosen = sizes[size]
    let item: EnergyItem = {
        itemType: chosen,
        mods: [],
    }
    item = addRandomEnergyMod(item);
    return item
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
    item = addRandomGardeningMod(item);
    return item
}


function addRandomEnergyMod(item: EnergyItem): EnergyItem {
    if (item.mods.length >= maxMods(item)) return item;

    let exclusions = getEnergyModExclusions(item)
    let chosen = randomEnumWithExclusion(EnergyItemModList, exclusions)

    let newMod: EnergyItemMod = {
        mod: chosen,
        value: getRandomInt(1, 10)
    }

    item.mods.push(newMod);

    return item;
}

function addRandomGardeningMod(item: GardeningItem): GardeningItem {
    if (item.mods.length >= maxMods(item)) return item;

    let baseList = [
        GardeningItemModList.BiggerBag,
        GardeningItemModList.BiggerGarden,
        GardeningItemModList.DoomRate,
        GardeningItemModList.FruitGainBase,
        GardeningItemModList.FruitGrainMult,
        GardeningItemModList.PlantGrowthSpeed,
        GardeningItemModList.WateringDurationBase,
        GardeningItemModList.WateringDurationMult
    ]
    if (item.itemType === ItemTypes.MagicWateringCan) baseList.push(GardeningItemModList.AutoWater);
    if (item.itemType === ItemTypes.MagicSecateurs) baseList.push(GardeningItemModList.AutoHarvest);
    if (item.itemType === ItemTypes.GardeningHat) baseList.push(GardeningItemModList.AutoPlant);

    let exclusions = getGardeningModExclusions(item)
    let chosen = randomEnumFromListWithExclusions(baseList, exclusions)

    let newMod: GardeningItemMod = {
        mod: chosen,
        value: getRandomInt(1, 10)
    }

    item.mods.push(newMod);

    return item;
}

export function maxMods(item: ItemData): number {
    if (item.itemType === ItemTypes.EnergyItem) return 3;
    if (item.itemType === ItemTypes.SmallEnergyItem) return 2;
    if (item.itemType === ItemTypes.TinyEnergyItem) return 1;
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
    itemType: number,
}

export interface EnergyItem extends ItemData {
    mods: EnergyItemMod[];
}

export interface EnergyItemMod {
    mod: EnergyItemModList
    value: number
}

export interface GardeningItem extends ItemData {
    mods: GardeningItemMod[];
}

export interface GardeningItemMod {
    mod: GardeningItemModList
    value: number
}

export enum ItemTypes {
    broken,
    EnergyItem,
    SmallEnergyItem,
    TinyEnergyItem,
    DoomedCrystal,
    MagicWateringCan,
    MagicSecateurs,
    GardeningHat,
}

//gonna do values for all 1-10 with 10% for each 1
//flat base gain and flat clicks per second
export enum EnergyItemModList {
    ClicksPerSecond,
    HoverMore,
    ClickMore,
    PassiveMore,
    BaseGain,
    IncreasedGain,
    MoreGain,
}

export enum GardeningItemModList {
    AutoHarvest, //implemented
    AutoPlant, //implemented
    AutoWater, //implemented

    BiggerBag, //implemented
    BiggerGarden, //implemented

    FruitGainBase, //implemented
    FruitGrainMult, //implemented

    WateringDurationBase, //implemented
    WateringDurationMult, //implemented

    PlantGrowthSpeed, //implemented
    DoomRate, //implemented
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

 enum DoomStoneModList {
     MoreDoomGain,
     BaseDoomGain,
     IncreasedDoomGain,
     DoomPerSecond,
     GloomPerSecond,
 }