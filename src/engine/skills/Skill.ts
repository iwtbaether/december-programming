
export interface SkillData {
    xp: number;
    level: number;
}

export interface SkillInformation {
    refstr: string;
    tip: any
}
/*
export const SkillInfo  = {
    clicking:{refstr:'clicking',tip:tips.clickingTip},
    ticking: {refstr:'ticking',tip:tips.tickingTip},
    engineering: {refstr:'engineering',tip:tips.engineeringTip},
    farming: {refstr:'farming',tip:tips.farmingTip},
    crafting: {refstr:'crafting',tip:tips.craftingTip},
    idling: {refstr:'idling',tip:tips.idlingTip},
    fortniting: {refstr:'fortniting',tip:tips.fortnitingTip},
    mining: {refstr:'mining',tip:tips.fortnitingTip},
}

export default class Skill {
    public refstr: string;
    public tip: string
    constructor(public parent: Engine, info: SkillInformation){
        this.refstr = info.refstr;
        this.tip = info.tip;
    }

    public get ref(){
        return this.parent.datamap.skillObjects[this.refstr];
    }

    public get xp(): number{
        return this.ref.xp;
    }

    public gainXP=(val:number)=>{
        this.ref.xp += Math.floor(val);
        this.parent.log.addXP(`You gained ${val} xp in ${this.refstr}`)
    }

    public get level(): number{
        return this.ref.level;
    }

    public get req () {
        let points = 0;
        let maxlevel = this.level + 1; // last level to display

        for (let lvl = 1; lvl < maxlevel; lvl++)
        {
            points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
        }
        let output = Math.floor(points / 4);

        return output;
    }

    public levelUp = () => {
        if (this.togo > 0) {
            return;
        } else {
            this.ref.xp -= this.req;
            this.ref.level ++;
            this.parent.notify();
        }
    }

    canLevelUp=()=>{
        return this.togo <= 0;
    }

    public get togo () {
        return this.req - this.xp;
    }

    
}
*/

export function XPTableCalc(){
        
    let points = 0;
    let output = 0;
    let minlevel = 2; // first level to display
    let maxlevel = 200; // last level to display
    let str = ''

    for (let lvl = 1; lvl <= maxlevel; lvl++)
    {
        points += Math.floor(lvl + 300 * Math.pow(2, lvl / 7.));
        if (lvl >= minlevel) str += ('Level ' + (lvl) + ' - ' + output + ' xp\n');
        output = Math.floor(points / 4);
    }

    return str
}