import { throws } from "assert";
import Decimal from "break_infinity.js";
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
        if (this.data.currency.transmutes < 1) return;

        this.data.currency.transmutes --;
        this.data.currentCraft = makeEnergyItem();
        this.engine.notify();
    }

    makeNewMediumCatalyst = () => {
        if (this.data.currency.transmutes < 1) return;

        this.data.currency.transmutes --;
        this.data.currentCraft = makeSmallEnergyItem();
        this.engine.notify();
    }

    makeNewSmallCatalyst = () => {
        if (this.data.currency.transmutes < 1) return;

        this.data.currency.transmutes --;
        this.data.currentCraft = makeTinyEnergyItem();
        this.engine.notify();
    }


    getCurrency = () => {
        this.data.currency.transmutes += 10;
        this.data.currency.augmentations += 10;
    }

    getRandomCurrency = () => {
        let rng = getRandomInt(0, 99);
        let type = rng % 2;
        if (type === 0) this.data.currency.transmutes ++;
        if (type === 1) this.data.currency.augmentations ++;
    }

    getRandomCurrencyCount = (count: number) => {
        let rng = getRandomInt(0, 99);
        let type = rng % 2;
        if (type === 0) this.data.currency.transmutes += count;
        if (type === 1) this.data.currency.augmentations += count;
    }

    calc = () => {
        this.setEnergyCalcedData();
    }

    addModToCurrentCraft = () => {
        if (this.data.currency.augmentations < 1) return;

        if (this.data.currentCraft?.itemType === 1) {
            const cata = this.data.currentCraft as EnergyItem;
            if (cata.mods.length >= maxMods(cata)) return;
            this.data.currency.augmentations --;
            this.data.currentCraft = addRandomMod(cata);
        } else
        if (this.data.currentCraft?.itemType === 2) {
            const cata = this.data.currentCraft as EnergyItem;
            if (cata.mods.length >= maxMods(cata)) return;
            this.data.currency.augmentations --;
            this.data.currentCraft = addRandomMod(cata);
        } else
        if (this.data.currentCraft?.itemType === 3) {
            const cata = this.data.currentCraft as EnergyItem;
            if (cata.mods.length >= maxMods(cata)) return;
            this.data.currency.augmentations --;
            this.data.currentCraft = addRandomMod(cata);
        } else
        this.engine.notify();
    }

    clearCraft = () => {
        this.data.currentCraft = null;
        this.getRandomCurrency();
        this.engine.notify();
    }

    equipCurrentCraft = () => {
        const toEquip = this.data.currentCraft;
        if (this.data.currentCraft?.itemType === 1) {
            const eEquip = toEquip as EnergyItem;
            
            this.data.currentCraft = this.data.equipedEnergyItem;
            this.data.equipedEnergyItem = eEquip;
            
        }

        if (this.data.currentCraft?.itemType === 2) {
            const eEquip = toEquip as EnergyItem;
            
            this.data.currentCraft = this.data.equipedMedEnergyItem;
            this.data.equipedMedEnergyItem = eEquip;
            
        }

        if (this.data.currentCraft?.itemType === 3) {
            const eEquip = toEquip as EnergyItem;

            this.data.currentCraft = this.data.equipedSmallEnergyItem;
            this.data.equipedSmallEnergyItem = eEquip;
            
        }
        this.setEnergyCalcedData();
        this.engine.calcEnergy();
        this.engine.notify();
    }
    

    calcEnergyEquipment = () => {
        console.log('why');
        
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

    energyCalcedData: EnergyItemValues = this.calcEnergyEquipment();


    setEnergyCalcedData = () => {
        let base = this.calcEnergyEquipment();
        this.energyCalcedData = base;
    }


    


    

}


function energyItemCalc2 (item: EnergyItem|null, base:EnergyItemValues): EnergyItemValues {
    
    if (item === null) return base;
    item.mods.forEach(mod => {
        base = modifyEnergyItemValues(mod,base);
    });
    return base
}

function modifyEnergyItemValues (mod: EnergyItemMod, values: EnergyItemValues): EnergyItemValues {
    switch (mod.mod) {
        case EnergyItemMods.BaseGain:
            values.baseGain += mod.value;
            break;

            case EnergyItemMods.ClickMore:
            values.clickMore *= 1 + mod.value * .1;
            break;

            case EnergyItemMods.ClicksPerSecond:
            values.clicksPerSecond += mod.value;
            break;

            case EnergyItemMods.HoverMore:
            values.hoverMore *= 1 + mod.value * .1;
            break;

            case EnergyItemMods.IncreasedGain:
            values.increasedGain += mod.value;
            break;

            case EnergyItemMods.MoreGain:
            values.moreGain *= 1 + mod.value * .1;
            break;

            case EnergyItemMods.PassiveMore:
            values.passiveMore *= 1 + mod.value * .1;
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

function makeEnergyItem (): EnergyItem {
    let item: EnergyItem = {
        itemType: ItemTypes.EnergyItem,
        mods: [],
    }
    item = addRandomMod(item);
    return item;
}

function makeSmallEnergyItem (): EnergyItem {
    let item: EnergyItem = {
        itemType: ItemTypes.SmallEnergyItem,
        mods: [],
    }
    item = addRandomMod(item);
    return item;
}

function makeTinyEnergyItem (): EnergyItem {
    let item: EnergyItem = {
        itemType: ItemTypes.TinyEnergyItem,
        mods: [],
    }
    item = addRandomMod(item);
    return item;
}

function addRandomMod (item: EnergyItem): EnergyItem {
    if (item.mods.length >= maxMods(item)) return item;

    let exclusions = getModExclusions(item)
    let chosen = randomEnumWithExclusion(EnergyItemMods, exclusions)
    
    let newMod: EnergyItemMod = {
        mod: chosen,
        value: getRandomInt(1,10)
    }
    
    item.mods.push(newMod);

    return item;
}

export function maxMods (item: ItemData): number {
    if (item.itemType === ItemTypes.EnergyItem) return 3;
    if (item.itemType === ItemTypes.SmallEnergyItem) return 2;
    if (item.itemType === ItemTypes.TinyEnergyItem) return 1;
    return 0;
}

function getModExclusions (item: EnergyItem): EnergyItemMods[]  {
    let exclusions: EnergyItemMods[] = [];
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
    mod: EnergyItemMods
    value: number
}

export enum ItemTypes {
    broken,
    EnergyItem,
    SmallEnergyItem,
    TinyEnergyItem,
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