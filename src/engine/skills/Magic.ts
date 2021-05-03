import Decimal from "break_infinity.js";
import { Datamap } from "../Datamap";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { GuideTypes } from "../garden/Juice";
import { Magic_Data } from "./MagicTypes";
import { SingleManagedSkill } from "./SingleManagedSkill";

export default class Magic_Skill extends SingleManagedSkill {

    
    get data (): Magic_Data {
        return this.engine.datamap.magic;
    }

    get skillData () {
        return this.engine.datamap.skillManager.magic;
    }

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
        this.data.currentMana = Decimal.min(
            this.maxMana.current,
            this.data.currentMana.add(deltaS*.1)
        )

        this.calcTicker += deltaS;
        if (this.calcTicker >= 60) {
            //HMMMMMMMMM
            this.calcTicker = 0;
            this.maxMana.set();
        }
    }


    
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

        const levelMulti = this.skillData.level.times(.1).add(1);
        manaFromSize = manaFromSize.times(levelMulti);

        if (this.data.currentMana.greaterThan(manaFromSize)) {
            this.data.currentMana = manaFromSize;
        }
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
        const start = this.data.currentMana;
        const sq = start.sqr();
        this.engine.jobs.progress(sq);

        //make magic xp happen
        this.gainXP(start.div(10))
        //"spend" all mana
        this.data.currentMana = ZERO;

        //set max mana because size growth
        this.maxMana.set();
    }
    spell_gardenTimeSkip = () => {}
    spell_energyTimeSkip = () => {}
    spell_seedCreation = () => {}
    spell_juiceTicks = () => {}

    spell_influenced1 = () => {

    }
    
    spellInfos: SpellClassInfo[] = [
        {name: 'Chulsaeng', id: 0, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.growSkip), action:()=>{this.spell_growSkip()},
            cost: 1},
        {name: 'Won-Ye', id: 1, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.gardenTimeSkip), action:()=>{this.spell_gardenTimeSkip()},
        cost: 60},
        {name: 'Eneo Ja Ijeu', id: 2, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.energyTimeSkip), action:()=>{this.spell_energyTimeSkip()},
        cost: 60*60},
        {name: 'Ssi', id: 3, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.seedCreation), action:()=>{this.spell_seedCreation()},
        cost: 100},
        {name: 'Abchag', id: 4, unlock:()=>this.skillData.level.greaterThanOrEqualTo(this.levelOfUnlocks.juiceTicks), action:()=>{this.spell_juiceTicks()},
        cost: 100},
        
        {name: 'Sara Strike', id: 5, unlock:()=>this.data.spellbook === GuideTypes.Sara, action:()=>{this.spell_influenced1()},
        cost: 10},
        {name: 'Claws of Trixie', id: 6, unlock:()=>this.data.spellbook === GuideTypes.Guth, action:()=>{this.spell_influenced1()},
        cost: 10},
        {name: 'Flames of Rakozam', id: 7, unlock:()=>this.data.spellbook === GuideTypes.Zammy, action:()=>{this.spell_influenced1()},
        cost: 10},
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