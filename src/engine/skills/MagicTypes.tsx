import Decimal from "break_infinity.js"
import { Datamap } from "../Datamap"
import { GuideTypes } from "../garden/Juice"

const ZERO = new Decimal(0);


export interface Magic_Data {
    spellbook: GuideTypes;
    currentMana: Decimal;
}

export function Magic_Data_Init (): Magic_Data {
    return {
        spellbook: GuideTypes.none,
        currentMana: ZERO,
    }  
}

export function fixMagic(d: Datamap) {
    d.magic.currentMana = new Decimal(d.magic.currentMana)
}


export interface SpellInformation {
    //if the spell requires a guide
    reqGuide?: GuideTypes
    //base cd in milliseconds
    cooldown: number
    manaCost: number
    name: string
    description: string
    action: VoidFunction
}