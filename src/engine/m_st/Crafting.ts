import { EnumType, isTypeNode } from "typescript";
import Engine from "../Engine";
import { getRandomInt, randomEnum, randomEnumWithExclusion } from "../externalfns/util";

export default class Crafting {
    constructor(public engine: Engine) {

    }

    get data () {
        return this.engine.datamap.crafting;
    }

    makeNewCatalyst = () => {
        this.data.currentCraft = makeEnergyItem();
        this.engine.notify();
    }

    addModToCurrentCraft = () => {
        if (this.data.currentCraft?.itemType === 1) {
            this.data.currentCraft = addRandomMod(this.data.currentCraft);
        }
        this.engine.notify();
    }

    clearCraft = () => {
        this.data.currentCraft = null;
        this.engine.notify();
    }

    energyCalcedData: EnergyItemValues = energyItemCalc(this.engine.datamap.crafting.equipedEnergyItem)
    equipCurrentCraft = () => {
        const toEquip = this.data.currentCraft;
        if (this.data.currentCraft?.itemType === 1) {
            this.data.currentCraft = this.data.equipedEnergyItem;
            this.data.equipedEnergyItem = toEquip;
            this.energyCalcedData = energyItemCalc(toEquip);
        }
        this.engine.notify();
    }


    


    

}

function energyItemCalc (item: EnergyItem|null): EnergyItemValues {
    //things to recalculate on equiping a new energy item;
    let base: EnergyItemValues = {
        baseGain: 0,
        clicksPerSecond: 0,
        increasedGain: 0,
        clickMore: 1,
        moreGain: 1,
        hoverMore: 1,
        passiveMore: 1,
    }
    if (item === null) return base;
    if (item.mod1) modifyEnergyItemValues(item.mod1, base);
    if (item.mod2) modifyEnergyItemValues(item.mod2, base);
    if (item.mod3) modifyEnergyItemValues(item.mod3, base);
    return base
}

function modifyEnergyItemValues (mod: EnergyItemMod, values: EnergyItemValues): EnergyItemValues {
    switch (mod.mod) {
        case EnergyItemMods.BaseGain:
            values.baseGain += mod.value;
            break;

            case EnergyItemMods.ClickMore:
            values.baseGain += mod.value * .1;
            break;

            case EnergyItemMods.ClicksPerSecond:
            values.clicksPerSecond += mod.value;
            break;

            case EnergyItemMods.HoverMore:
            values.hoverMore += mod.value * .1;
            break;

            case EnergyItemMods.IncreasedGain:
            values.increasedGain += mod.value;
            break;

            case EnergyItemMods.MoreGain:
            values.moreGain += mod.value * .1;
            break;

            case EnergyItemMods.PassiveMore:
            values.passiveMore += mod.value * .1;
            break;
    
        default:
            break;
    }

    return values;
}

export interface CraftingData {
    currentCraft: ItemData | null,
    equipedEnergyItem: EnergyItem | null,
}

export function CraftingData_Init(): CraftingData {
    return {
        currentCraft: null,
        equipedEnergyItem: null,
    }
}

function makeEnergyItem (): EnergyItem {
    return {
        itemType: ItemTypes.EnergyItem,
    }
}

function addRandomMod (item: EnergyItem): EnergyItem {
    let exclusions = getModExclusions(item)
    
    let chosen = randomEnumWithExclusion(EnergyItemMods, exclusions)
    
    let newMod: EnergyItemMod = {
        mod: chosen,
        value: getRandomInt(0,10)
    }
    
    if (item.mod3) return item;
    else if (item.mod2) item.mod3 = newMod;
    else if (item.mod1) item.mod2 = newMod;
    else item.mod1 = newMod;

    return item;
}

function getModExclusions (item: EnergyItem): EnergyItemMods[]  {
    let exclusions = [];
    if (item.mod1) exclusions.push(item.mod1.mod);
    if (item.mod2) exclusions.push(item.mod2.mod);
    if (item.mod3) exclusions.push(item.mod3.mod);
    return exclusions;
}

export interface ItemData {
    itemType: number,
}

export interface EnergyItem extends ItemData {
    mod1?: EnergyItemMod,
    mod2?: EnergyItemMod,
    mod3?: EnergyItemMod,
}

export interface EnergyItemMod {
    mod: EnergyItemMods
    value: number
}

export enum ItemTypes {
    broken,
    EnergyItem
}

//gonna do values for all 1-10 with 10% for each 1
//flat base gain and flat clicks per second
export enum EnergyItemMods {
    ClicksPerSecond,
    HoverMore,
    ClickMore,
    PassiveMore,
    BaseGain,
    IncreasedGain,
    MoreGain,
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

function getPossibleEnergyMods(modList: EnergyItemMod[]) {
    let defaultList = Object.values(EnergyItemMods)
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