import { ItemData, ItemTypes, ModData } from "../m_st/Crafting";


export interface IDV2 extends ItemData {
    mods?: MDV2[],
}

export interface PShroom extends IDV2 {
    itemType: ItemTypes.PatienceMushroom;
    mods: MDV2[];
    shroomType: ShroomTypes;
}

export enum ShroomTypes {
    energy, doom, fruit, gloom, power, juice, work, 
}



export interface PForm extends IDV2 {
    itemType: FTYPES
    mods: MDV2[];
}

export function create_IV2 () {
    const newItem: IDV2 = {
        itemType: ItemTypes.broken,
        mods: [],
    }
}


export enum PForm_Mods {
    //implicits
    size, //multiplies required time and fruit gain

    //explicits

    energyFromBase, doomFromBase, fruitFromBase, 
    gloomFromBase, powerFromBase, juiceFromBase, 
    workFromBase,  //these powers come from the mushrooms, they multiply gain based on number of fruit of the form type
    
    //make the normal power from the fruit strong and the mushroom powers
    strongerRegularPower, strongerShroomPowers,
    
    //more fruit of form type from harvesting
    moreOfFormType,

    //fruit of form type gain on rebirth
    rebirthGain,

    //wtf
    spores,

    //more
    manaFromBase
}

export enum PShroom_Mods {
    //implicits
    size, //multiplies required time and determines number of slots

    //explicits
    shroomPowerChance, //increased chance of getting shroom power
    moreGrowthSpeed, //processes forms faster
    additionalSlots, //adds a slot without costing
}

/*
export enum IDV2_Mods {
    //patience is a physical skill
    jobProgressFromLevel,
}
*/

export function getValueOfModType (mods: MDV2[], find: number): number|undefined {
    return mods.find((mod)=>{
        return mod.mod === find;
    })?.value
}

export interface MDV2 extends ModData {
    mod: number;//IDV2_Mods;
}


export const formTypesList = [ItemTypes.CircularForm,ItemTypes.BunchedForm,ItemTypes.EggForm,ItemTypes.SquareForm,ItemTypes.TriangleForm]
export type FTYPES = ItemTypes.CircularForm | ItemTypes.BunchedForm | ItemTypes.EggForm | ItemTypes.SquareForm | ItemTypes.TriangleForm;
