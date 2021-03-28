import { ItemData, ItemTypes, ModData } from "../m_st/Crafting";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Patience_Skill_2 extends SingleManagedSkill {


    useTokenGetLoot = () => {
        //first token always gives mushroom
        //second token always gives form
        //then rng between all 6 patience types
    }

    get data2 () {
        return this.engine.datamap.skillManager.patience_extra;
    }


    tokenTimer = 60 * 1000 //1 minute
    canClaim = () => {
        return isTimerDone(this.tokenTimer, this.data2.lastClaim);
    }
    claimTokens = () => {
        if (isTimerDone(this.tokenTimer, this.data2.lastClaim)) {


            this.data2.mtx = this.data2.mtx + this.getData().level.add(1).toNumber();
            this.data2.lastClaim = Date.now();
            this.engine.notify();
        } else return;
    }


    //GROW A MUSHROOM THAT GROWS FRUIT FORMS
    //1. grow mushroom
    //2, fertalize with a fruit form
    //3. ???
    //4. mushroom grows a new fruit form
    
}

function isTimerDone (timer: number, last: number) {
    return (Date.now() - last) >= timer
}

export const SpiritualityLevelUnlocks = {
    juiceTrades: 19,
    juicerUpgrades: 9,
    juiceEarlyUnlock: 29,
}

export interface Patience_Skill_Extra_Data {
    mtx: number;

    //timer bases -- USE THIS INSTEAD OF ADDING WIH DELTA
    lastClaim: number;
    lastMushroom: number
}

export function Patience_Skill_Extra_Data_Init (): Patience_Skill_Extra_Data {
    return {
        mtx: 0,
        lastClaim: 0,
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