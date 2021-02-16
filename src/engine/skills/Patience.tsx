import { ItemData, ItemTypes, ModData } from "../m_st/Crafting";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Patience_Skill extends SingleManagedSkill {

}

export interface Patience_Skill_Extra_Data {

}

export function Patience_Skill_Extra_Data_Init () {

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