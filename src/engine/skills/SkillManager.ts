import Decimal from "break_infinity.js";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";

export default class SkillManager {

    constructor (public engine: Engine) {
        
    }
}

export interface SkillInterface {
    name: string;
    xpRes: SingleResource;
    levelRes: SingleBuilding;
}
export interface Skill_Data {
    level: Decimal;
    xp: Decimal;
}
export function Skill_Data_Init (): Skill_Data {
    return {
        level: new Decimal(0),
        xp: new Decimal(0),
    }
}
export interface SkillManager_Data {
    poeCrafting: Skill_Data;
}

export function SkillManager_Data_Init (): SkillManager_Data {
    return {
        poeCrafting: Skill_Data_Init(),
    }
}

export function fixSkillData(sk: Skill_Data): Skill_Data {
    return {
        level: new Decimal(sk.level),
        xp: new Decimal(sk.xp),
    }
}

export function SkillManager_Data_SetDecimals (data: Datamap) {
    data.skillManager.poeCrafting = fixSkillData(data.skillManager.poeCrafting);
}