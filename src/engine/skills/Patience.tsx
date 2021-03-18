import { ItemData, ItemTypes, ModData } from "../m_st/Crafting";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Patience_Skill extends SingleManagedSkill {



    //GROW A MUSHROOM THAT GROWS FRUIT FORMS
    //1. grow mushroom
    //2, fertalize with a fruit form
    //3. ???
    //4. mushroom grows a new fruit form
}

export interface Patience_Skill_Extra_Data {
    usedTokens: number;

    //timer bases -- USE THIS INSTEAD OF ADDING WIH DELTA
    lastReset: number;
    lastMushroom: number
}

export function Patience_Skill_Extra_Data_Init (): Patience_Skill_Extra_Data {
    return {
        usedTokens: 0,
        lastReset: 0,
        lastMushroom: 0,
    }
}

export interface IDV2 extends ItemData {
    mods: MDV2[],
}

export function create_IV2 () {
    const newItem: IDV2 = {
        itemType: ItemTypes.broken,
        mods: [],
    }
}

export enum IDV2_Mods {
    //patience is a physical skill
    jobProgressFromLevel,
}

export interface MDV2 extends ModData {
    mod: IDV2_Mods;
}