import Decimal from "break_infinity.js";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { SingleManagedSkill } from "./SingleManagedSkill";

export function levelToXPReq(level: Decimal):Decimal {
    return Decimal.times(75, Decimal.pow(1.10409, new Decimal(level)));
}

export function UnlockSkill (skill: SingleManagedSkill) {
    skill.getData().unlocked = true;
}

export function lockSkill (skill: SingleManagedSkill) {
    skill.getData().unlocked = false;
}


export interface SkillInterface {
    name: string;
    xpRes: SingleResource;
    levelRes: SingleBuilding;
}
export interface Skill_Data {
    level: Decimal;
    xp: Decimal;
    unlocked: boolean;

}
export interface CalcedSkillsData {
    req: Decimal;
}
export function Skill_Data_Init (): Skill_Data {
    return {
        level: new Decimal(0),
        xp: new Decimal(0),
        unlocked: false,
    }
}