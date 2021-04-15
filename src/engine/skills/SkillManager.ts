import Decimal from "break_infinity.js";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import Magic_Skill from "./Magic";
import { Skill_Data, Skill_Data_Init } from "./MiscSkill";
import Patience_Skill, { Patience_Skill_Extra_Data, Patience_Skill_Extra_Data_Init } from "./Patience";
import { SingleManagedSkill } from "./SingleManagedSkill";





export default class SkillManager {

    constructor (public engine: Engine) {
        
    }

    openGuide?: SingleManagedSkill;

    openSkill = (skill: SingleManagedSkill) => {
        this.openGuide = skill;
        this.engine.notify();
    }

    closeSkill = () => {
        this.openGuide = undefined;
        this.engine.notify();
    }

    skills = {

        
        matter: new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.matter,'Matter'),
        energy: new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.energy,'Energy'),
        space: new  SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.space,'Space'),
        time:  new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.time,'Time'),
        
        spirituality: new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.spiritualGardening,'Spirituality'),
        magic:  new Magic_Skill(this.engine, ()=>this.engine.datamap.skillManager.magic,'Magic'),
        
        patience: new Patience_Skill(this.engine, ()=>this.engine.datamap.skillManager.patience,'Patience'),
        fortitude: new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.fortitude,'Fortitude'),
        
        poeCrafting:new SingleManagedSkill(this.engine, ()=>this.engine.datamap.skillManager.poeCrafting,'Creation'),
    }

    //magic = new Magic_Skill(this.engine, ()=>this.engine.datamap.skillManager.magic, 'Magic');




}




export interface SkillManager_Data {
    manager: {
        unlocked: boolean;
    }
    matter: Skill_Data;
    energy: Skill_Data;
    space: Skill_Data;
    time: Skill_Data;

    spiritualGardening: Skill_Data;
    magic: Skill_Data;

    patience: Skill_Data;
    patience_extra: Patience_Skill_Extra_Data;
    fortitude: Skill_Data;
    
    //unused
    poeCrafting: Skill_Data;
}

export function SkillManager_Data_Init (): SkillManager_Data {
    return {
        matter: Skill_Data_Init(),
        energy: Skill_Data_Init(),
        space: Skill_Data_Init(),
        time: Skill_Data_Init(),
        
        spiritualGardening: Skill_Data_Init(),
        magic: Skill_Data_Init(),

        patience: Skill_Data_Init(),
        patience_extra: Patience_Skill_Extra_Data_Init(),
        fortitude: Skill_Data_Init(),

        poeCrafting: Skill_Data_Init(),

        manager: {
            unlocked: false,
        }
    }
}

export function fixSkillData(sk: Skill_Data): Skill_Data {
    let newsk = sk;
    
    newsk.xp = new Decimal(sk.xp);
    newsk.level = new Decimal(sk.level);

    //actually the same skill, same object too lol.
    return newsk
}

export function SkillManager_Data_SetDecimals (data: Datamap) {
    data.skillManager.matter = fixSkillData(data.skillManager.matter);
    data.skillManager.energy = fixSkillData(data.skillManager.energy);
    data.skillManager.space = fixSkillData(data.skillManager.space);
    data.skillManager.time = fixSkillData(data.skillManager.time);

    data.skillManager.spiritualGardening = fixSkillData(data.skillManager.spiritualGardening)
    data.skillManager.magic = fixSkillData(data.skillManager.magic);
    
    data.skillManager.patience = fixSkillData(data.skillManager.patience);
    data.skillManager.fortitude = fixSkillData(data.skillManager.fortitude);

    data.skillManager.poeCrafting = fixSkillData(data.skillManager.poeCrafting);
}

