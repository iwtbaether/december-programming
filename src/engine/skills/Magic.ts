import Decimal, { DecimalSource } from "break_infinity.js";
import { Datamap } from "../Datamap";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { GuideTypes } from "../garden/Juice";
import MagicEquipment from "./MagicEquipment";
import { Magic_Data } from "./MagicTypes";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Magic_Skill extends SingleManagedSkill {

    
    get data (): Magic_Data {
        return this.engine.datamap.magic;
    }

    get skillData () {
        return this.engine.datamap.skillManager.magic;
    }

    equipment: MagicEquipment = new MagicEquipment(this);

    spellBook: number[] = [];
    setSpellbook = () => {
        let newSpells: number[] = [];
        this.spellInfos.forEach(spell=>{
            if (spell.unlock()) newSpells.push(spell.id);
        })
        this.spellBook = newSpells;
    }

    //CALC MAX EVERY 60 SECONDS
    calcTime = 60 //seconds;
    calcTicker = 0; //seconds
    magicDelta = (deltaS: number) => {
        //console.log('magic delta max mana', this.maxMana.current);
        
        this.data.currentMana = Decimal.min(
            this.maxMana.current,
            this.data.currentMana.add(this.manaRegen.current.times(deltaS))
        )

        this.calcTicker += deltaS;
        if (this.calcTicker >= 60) {
            //HMMMMMMMMM
            this.calcTicker = 0;
            this.maxMana.set();
        }
    }

    manaRegen: CalcedDecimal = new CalcedDecimal(()=>{
        let regen = new Decimal(0.1);
        if (this.equipment.stats.flatManaRegen > 0) {
            regen = regen.add(this.equipment.stats.flatManaRegen * .1)
        }
        if (this.equipment.stats.increasedManaRegen > 0) {
            regen = regen.times(this.equipment.stats.increasedManaRegen * .01 + 1)
        }

        return regen;
    })


    
     maxMana: CalcedDecimal = new CalcedDecimal(()=>{
         let manaFromSize = ZERO;
         let jobID = this.engine.datamap.jobs.notReset.jobID;
         if (jobID === 0) {
            manaFromSize = ZERO;
        } else if (jobID > 1) {
            manaFromSize = MAX_MANA_FROM_SIZE
        } else if (jobID === 1) {
            manaFromSize = MAX_MANA_FROM_SIZE.min(
                this.engine.datamap.jobs.jobProgress.div(1000000)
            )
        } else throw new Error('lmao error')    

        if (this.equipment.stats.flatMaxMana > 0) {
            manaFromSize = manaFromSize.add(this.equipment.stats.flatMaxMana)
        }
        if (this.equipment.stats.increasedMaxMana > 0) {
            manaFromSize = manaFromSize.times(this.equipment.stats.increasedMaxMana * .01 + 1)
        }

        const levelMulti = this.skillData.level.times(.1).add(1);
        manaFromSize = manaFromSize.times(levelMulti);

        
        return manaFromSize;
        
    })

    levelOfUnlocks = {
        //spells
        growSkip: 0, //skips time in grower Job, spends all mana
        gardenTimeSkip: 9,
        energyTimeSkip: 19,
        seedCreation: 29,
        juiceTicks: 39,

        
        //stats multis
        maxMana: 0,
        manaRegen: 19,

    }

    spell_growSkip = () => {
        //make job progress happen mana^s seconds
        const progress = this.data.currentMana.sqr();
        
        this.engine.jobs.offlineProgress(progress);
        
        //make magic xp happen
        //"spend" all mana
        this.spendManaGainXp(this.data.currentMana);

        //set max mana because size growth
        this.maxMana.set();
    }
    spell_gardenTimeSkip = () => {
        this.engine.garden.processDelta(60 * 60 * 1000);
        this.spendManaGainXp(1000);
    }
    spell_energyTimeSkip = () => {
        this.engine.energyModule.energyDeltaS(60*60);
        this.spendManaGainXp(10000);
    }
    spell_seedCreation = () => {}
    spell_juiceTicks = () => {}

    spell_influenced1 = () => {

    }
    spell_clawsOfTrixies = () => {
        this.engine.garden.clawsHarvest();
        this.spendManaGainXp(100)
    }
    spell_saraStrike = () => {
        this.engine.garden.juice.powerResource.gainResource(100);
        this.spendManaGainXp(100)
    }
    spell_flamesOfRakozam = () => {
        let gain = this.engine.datamap.garden.plots.length;
        this.engine.datamap.garden.plots = [];
        this.gainXP(gain)
        this.spendManaGainXp(100)

    }

    spendManaGainXp = (manaSpend: DecimalSource) => {
        this.data.currentMana = this.data.currentMana.minus(manaSpend);
        this.gainXP(Decimal.times(manaSpend, .1))
    }
    
    spellInfos: SpellClassInfo[] = [
        {name: 'Chulsaeng', id: 0, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.growSkip), action:()=>{this.spell_growSkip()},
            cost: 10},
        {name: 'Won-Ye', id: 1, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.gardenTimeSkip), action:()=>{this.spell_gardenTimeSkip()},
        cost: 1000},
        {name: 'Eneo Ja Ijeu', id: 2, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.energyTimeSkip), action:()=>{this.spell_energyTimeSkip()},
        cost: 10000},
        {name: 'Ssi', id: 3, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.seedCreation), action:()=>{this.spell_seedCreation()},
        cost: 100000},
        {name: 'Abchag', id: 4, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.juiceTicks), action:()=>{this.spell_juiceTicks()},
        cost: 1000000},
        
        {name: 'Sara Strike', id: 5, unlock:()=>this.data.spellbook === GuideTypes.Sara, action:()=>{this.spell_saraStrike()},
        cost: 100},
        {name: 'Claws of Trixie', id: 6, unlock:()=>this.data.spellbook === GuideTypes.Guth, action:()=>{this.spell_clawsOfTrixies()},
        cost: 100},
        {name: 'Flames of Rakozam', id: 7, unlock:()=>this.data.spellbook === GuideTypes.Zammy, action:()=>{this.spell_flamesOfRakozam()},
        cost: 100},
    ]

}

export interface SpellClassInfo {
    name: string,
    id: number,
    cost: number,
    unlock: ()=>boolean,
    action: VoidFunction,
}


class SpellClass {

    manaCost: number;
    constructor(public info: SpellClassInfo, public magicSkill: Magic_Skill){
        this.manaCost = 0;
    }
}

const ZERO = new Decimal(0);
const MAX_MANA_FROM_SIZE = new Decimal(3500)

interface UnlockNumbersAndNames {
    name: string;
    when: number;
}

enum SpellbookSpells {

}

const Magic_Unlocks = [

]