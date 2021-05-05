import { canCheat, getRandomInt, getRandomIntFromRange, randomEnumFromListWithExclusions } from "../externalfns/util";
import { getModExclusions, ItemTypes } from "../m_st/Crafting";
import Magic_Skill from "./Magic";
import { Wizard_Item_Mods, Wizard_Item_Mod_Ranges } from "./MagicEquipmentItemTypes";
import { IDV2, MDV2 } from "./PatienceItemTypes";

export default class MagicEquipment {
    constructor(public MagicSkill: Magic_Skill) {

    }




    get data() {
        return this.MagicSkill.engine.datamap.magicEquipment;
    }

    get craftingData() {
        return this.MagicSkill.engine.datamap.crafting;
    }

    /*
    makeCatalyst = (size: number) => {
        this.clearCraft();
        if (this.data.currency.transmutes < 1) return;

        this.data.currency.transmutes--;
        this.data.currentCraft = makeSizedEnergyItem(size);
        this.engine.notify();
    }

    */



    makeRandomItem = () => {
        const possibleTypes = this.getPossibleItemTypes();
        if (possibleTypes.length === 0) {
            console.log('no possible types?');
            return;
        } else {
            if (this.tryMake()) {
                this.clearCraft();
                const chosenType = possibleTypes[getRandomInt(0, possibleTypes.length - 1)];

                const newItem: IDV2 = {
                    itemType: chosenType,
                    mods: []
                }

                this.setImplicitMod(newItem);

                this.data.currentCraft = newItem;
            } else return;
        }


    }

    getScrap = () => {
        this.data.scrap = this.data.scrap + 1;
    }

    ifExistsGetScrap = (item: IDV2|undefined) => {
        if (item !== undefined) this.getScrap();
    }

    equipCurrentCraft = () => {
        if (this.data.currentCraft) {

            if (this.data.currentCraft.itemType === ItemTypes.Wizard_Hat) {
                this.ifExistsGetScrap(this.data.hat)
                this.data.hat = this.data.currentCraft;
            }

            if (this.data.currentCraft.itemType === ItemTypes.Wizard_Robe) {
                this.ifExistsGetScrap(this.data.robe);
                this.data.robe = this.data.currentCraft;
            }

            this.data.currentCraft = undefined;
        }
        this.processItems();
    }

    enchantCurrentCraft = () => {
        const currentCraft = this.data.currentCraft;

        if (currentCraft) {

            const magicLevel = this.MagicSkill.skillData.level;

            let maxMods = 2; //implicit mod + 1;
            if (magicLevel.greaterThanOrEqualTo(MagicEquipmentLADs.enchantplus1.level)) maxMods++;
            if (magicLevel.greaterThanOrEqualTo(MagicEquipmentLADs.enchantplus2.level)) maxMods++;

            let currentMods = 0;
            let exclusions: number[] = []
            if (currentCraft.mods) {
                currentMods = currentMods + currentCraft.mods.length;
                exclusions = getModExclusions(currentCraft.mods.slice(1));
            }

            if (currentMods < maxMods) {
                console.log('trying to enchant!');
                
                if (this.tryEnchant()) {
                    let PossibleMods: Wizard_Item_Mods[] = [
                        Wizard_Item_Mods.flatmaxmana,
                        Wizard_Item_Mods.increasedmaxmana,
                        Wizard_Item_Mods.flatmanaregen,
                        Wizard_Item_Mods.increasedmanaregen,
                    ]
                    const chosenMod = randomEnumFromListWithExclusions(PossibleMods, exclusions);
                    const value = getRandomIntFromRange(Wizard_Item_Mod_Ranges[chosenMod]);
                    const newMod: MDV2 = {mod:chosenMod, value};
                    if (currentCraft.mods) {
                        currentCraft.mods = currentCraft.mods.concat([newMod])
                    } else {
                        //this should never happen
                        currentCraft.mods = [newMod]
                    }
                } else console.log('broke boy cant enchant a wizard item');
                
            }

        }
    }

    setImplicitMod = (item: IDV2) => {
        if (item.itemType === ItemTypes.Wizard_Hat) {
            const mod = Wizard_Item_Mods.flatmaxmana;
            const value = getRandomIntFromRange(Wizard_Item_Mod_Ranges[mod]);
            item.mods?.push({ mod, value })
            //const value = getRandomInt(Wizard_Item_Mod_Ranges[mod][0],Wizard_Item_Mod_Ranges[mod][1])
        }
    }

    getPossibleItemTypes = (): ItemTypes[] => {
        const level = this.MagicSkill.skillData.level;
        let types = [];
        if (level.greaterThanOrEqualTo(MagicEquipmentLADs.hat.level)) types.push(ItemTypes.Wizard_Hat);
        if (level.greaterThanOrEqualTo(MagicEquipmentLADs.robe.level)) types.push(ItemTypes.Wizard_Robe);

        return types;
    }

    clearCraft = () => {

        if (this.data.currentCraft === undefined) return;
        if (this.data.currentCraft?.doomed) this.gainDoomShards(5)
        this.data.currentCraft = undefined;
        this.getRandomCurrency();
        if (this.MagicSkill.engine.datamap.doomResearch.gloomShard) {
            this.gainDoomShards(1);
        }
        this.MagicSkill.engine.notify();
    }

    stats: MagicEquipmentStats = {
        flatManaRegen: 0,
        flatMaxMana: 0,
        increasedManaRegen: 0,
        increasedMaxMana: 0,
    }

    tryDivine = () => {
        
    }
    divineCurrentCraft = () => {

    }

    processItems = () => {
        let newStats: MagicEquipmentStats = {
            flatMaxMana: 0,
            increasedMaxMana: 0,
            flatManaRegen: 0,
            increasedManaRegen: 0,
        }
        if (this.data.hat) {
            this.processSingleItem(this.data.hat, newStats)
        }
        if (this.data.robe) {
            this.processSingleItem(this.data.robe, newStats)
        }
        this.stats = newStats;

        this.MagicSkill.manaRegen.set();
        this.MagicSkill.maxMana.set();
    }

    processSingleItem = (item: IDV2, stats: MagicEquipmentStats) => {
        if (item.mods) {
            item.mods.forEach(mod => {
                if (mod.mod === Wizard_Item_Mods.flatmaxmana) stats.flatMaxMana += mod.value;
                if (mod.mod === Wizard_Item_Mods.increasedmaxmana) stats.increasedMaxMana += mod.value;
                if (mod.mod === Wizard_Item_Mods.flatmanaregen) stats.flatManaRegen += mod.value;
                if (mod.mod === Wizard_Item_Mods.increasedmanaregen) stats.increasedManaRegen += mod.value;
            });
        }
    }

    tryMake = this.MagicSkill.engine.crafting.tryMake;
    tryEnchant = this.MagicSkill.engine.crafting.tryEnchant;
    gainDoomShards = this.MagicSkill.engine.crafting.gainDoomShards;
    getRandomCurrency = this.MagicSkill.engine.crafting.getRandomCurrency;
}

export interface MagicEquipmentData {
    currentCraft?: IDV2,
    hat?: IDV2,
    robe?: IDV2,
    scrap: number,
}

export function MagicEquipmentData_Init(): MagicEquipmentData {
    return {
        scrap: 0,
    }
}



export interface LevelAndDescription {
    level: number, descrption: string,
}

export interface MagicEquipmentStats {
    flatMaxMana: number;
    increasedMaxMana: number;
    flatManaRegen: number;
    increasedManaRegen: number;
}

export const MagicEquipmentLADs = {
    //slots
    hat: { level: 4, descrption: 'Wizard Hat' },
    robe: { level: 14, descrption: 'Wizrd Robe' },
    wand: { level: 24, descrption: 'Wizard Wand' },
    gloves: { level: 34, descrption: 'Wizard Gloves' },
    boots: { level: 44, descrption: 'Wizard Boots' },
    orb: { level: 55, descrption: 'Wizard Orb' },
    staff: { level: 64, descrption: 'Wizard Statt' },

    //crafting
    enchantplus1: { level: 9, descrption: 'Wizard Item Max Enchants +1' },
    enchantplus2: { level: 19, descrption: 'Wizard Item Max Enchants +1' },
    copperCreation: { level: 29, descrption: 'Reroll Wizard Items with Copper Orbs' },

}