import { throws } from "assert";
import Decimal from "break_infinity.js";
import { Datamap } from "./Datamap";
import Engine from "./Engine";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import { getRandomInt } from "./externalfns/util";
import { SingleResearch } from "./Research";

export default class Jobs {

    constructor(public engine: Engine) {
        this.setTempData();
    }

    setTempData = () => {
        this.calcJobSpeed();
        this.setResistanceDiv();
        this.setSeedGainSpeedMulti();

    }

    realReset = () => {
        this.engine.datamap.jobs = JobsData_Init();
        this.setTempData();
    }

    get data(): JobsData {
        return this.engine.datamap.jobs;
    }

    processDelta = (delta: number) => {
        const deltaS = Decimal.divide(delta, 1000);

        if (deltaS.lessThanOrEqualTo(10)) {
            this.progress(deltaS)
        } if (deltaS.greaterThan(10)) {
            this.offlineProgress(deltaS);
        }
    }

    calced = {
        finalBaseJobSpeed: new Decimal(0),
        finalJobSpeedMult: new Decimal(0),
        finalJobSpeed: new Decimal(0),
        finalResitanceDiv: new Decimal(1)
    }

    spendXP = () => {
        this.engine.datamap.popupUI = 1;
        this.engine.notify();
    }

    calcJobSpeed = () => {
        this.calced.finalBaseJobSpeed = this.data.jobspeedplus;
        this.engine.garden.setGardenJobSpeedMult();

        const jsMult1 = this.data.jobspeedmult.add(1).add(this.engine.datamap.cell.doomJobSpeed.times(.1));
        const jsMult2 = this.data.notReset.upgrades.jobSpeed.add(1);
        const jsMult3 = this.engine.garden.gardenJobSpeedMult;
        
        this.calced.finalJobSpeedMult = jsMult1.times(jsMult2).times(jsMult3);
        const precap = this.calced.finalBaseJobSpeed.times(this.calced.finalJobSpeedMult)
        
        this.calced.finalJobSpeed = precap;
    }

    progress = (deltaS: Decimal) => {
        const progressPerSecondAfterResistance = this.calced.finalJobSpeed.div(this.calced.finalResitanceDiv);
        const capped = Decimal.min(1000, progressPerSecondAfterResistance);
        this.data.jobProgress = this.data.jobProgress.add(capped.times(deltaS));
        this.setResistanceDiv();
    }

    offlineProgress = (bigDeltaS: Decimal) => {
        while(bigDeltaS.greaterThan(0)) {
            const cappedTickLength = Decimal.min(10, bigDeltaS);
            bigDeltaS = bigDeltaS.minus(cappedTickLength);
            this.progress(cappedTickLength);
        }
    }

    setResistanceDiv = () => {
                
        let resistMulti1 = this.data.notReset.jobResistanceMult.add(1);
        let resistMulti2 = this.data.notReset.upgrades.effectiveResistance.times(.1).add(1);
        let resistMult = resistMulti1.times(resistMulti2);
        
        const baseResist = this.data.jobResistance.add(1);
        const resist = baseResist.times(resistMult);
        
        const baseProgress = this.data.jobProgress.add(1)
        this.calced.finalResitanceDiv = baseProgress.div(resist);
    }


    workResource = new SingleResource({
        name: 'Work',
        get: () => this.engine.datamap.jobs.work,
        setDecimal: (decimal) => {
            this.engine.datamap.jobs.work = decimal
        },
    })

    toggleRebuy = () => {
        this.data.notReset.rebuy = !this.data.notReset.rebuy;
        this.engine.notify();
    }

    xpResource = new SingleResource({
        name: 'XP',
        get: () => this.engine.datamap.jobs.notReset.xp,
        setDecimal: (decimal) => {
            this.engine.datamap.jobs.notReset.xp = decimal
        },
    })

    convertToWork = () => {
        if (this.data.converted) return;
        else {
            this.workResource.gainResource(this.engine.datamap.unlocksStates.one);
            this.data.converted = true;
            //this.engine.energyResource.info.setDecimal(new Decimal(0));
        }
        this.engine.notify();
    }

    getWorkReward = () => {
        let pp = this.data.jobProgress;
        const mult = Decimal.add(1, Decimal.times(.1, this.data.notReset.upgrades.workFromPrestige))
        return pp.times(mult);
    }


    prestige = () => {
        //calc new values
        const pp = this.data.jobProgress;
        const farthest = Decimal.max(this.data.farthesthProgress, pp);
        const reward = this.getWorkReward();

        if (pp.greaterThan(10000)) {
            if (this.data.notReset.mechancProgession === 0) this.data.notReset.mechancProgession = 1;
            let xpGain = new Decimal(1);
            if (this.data.notReset.upgrades.job >= 1) xpGain = xpGain.add( pp.div(10000).floor() )
            this.xpResource.gainResource(xpGain)
        }

        let old;
        if (this.data.notReset.rebuy) {
            old = [this.data.jobspeedplus, this.data.jobspeedmult, this.data.jobResistance]
        }

        //reset
        this.reset();

        //set new values
        this.workResource.gainResource(reward);
        this.data.farthesthProgress = farthest;
        this.data.last = pp;

        if (this.data.notReset.rebuy && old) {
            if (old[0]) this.jobSpeed.buyN(old[0]);
            if (old[1]) this.jobSpeedMult.buyN(old[1]);
            if (old[2]) this.jobResistance.buyN(old[2]);
        }

        //setup memory
        this.setSeedGainSpeedMulti();

        //update ui
        this.engine.notify();
    }

    seedGainSpeedMult = 1;
    setSeedGainSpeedMulti = () => {
        let base = 1;
        base = base + Decimal.log10(this.data.farthesthProgress.add(1))/10
        this.seedGainSpeedMult = base;
    }

    jobSpeed: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.jobID].speedPlusLabel,
            get: () => this.engine.datamap.jobs.jobspeedplus,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.jobspeedplus = dec
                this.calcJobSpeed();
            },
        }),
        costs: [
            { expo: { initial: 1, coefficient: 1.3 }, resource: this.workResource },
        ],
        hidden: () => false,
        description: 'Base Job Speed',
        outcome: () => "+1 Base Job Speed",
    })

    jobSpeedMult: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.jobID].speedMultLabel,
            get: () => this.engine.datamap.jobs.jobspeedmult,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.jobspeedmult = dec
                this.calcJobSpeed();
            },
        }),
        costs: [
            { expo: { initial: 1, coefficient: 1.4 }, resource: this.workResource },
        ],
        description: 'Increased Job Speed',
        hidden: () => false,
        outcome: () => '+1x Job Speed',
    })

    jobResistance: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.jobID].resistanceLabels[0],
            get: () => this.engine.datamap.jobs.jobResistance,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.jobResistance = dec
                this.setResistanceDiv();
            },
        }),
        costs: [
            { expo: { initial: 2, coefficient: 1.5 }, resource: this.workResource },
        ],
        description: 'Job Resistance',
        hidden: () => false,
        outcome: () => '+1 Base Job Resistance',
    })

    jobResistanceMult: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.jobID].resistanceLabels[1],
            get: () => this.engine.datamap.jobs.notReset.jobResistanceMult,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.notReset.jobResistanceMult = dec
                this.setResistanceDiv();
            },
        }),
        costs: [
            { expo: { initial: 10, coefficient: 2.69 }, resource: this.engine.gloom },
        ],
        description: 'More Job Resistance',
        hidden: () => this.engine.datamap.unlocksStates.two < 3,
        outcome: () => '+1x More Job Resistance',
    })

    reset = () => {
        const saved = this.engine.datamap.jobs.notReset;
        this.engine.datamap.jobs = JobsData_Init();
        this.engine.datamap.jobs.notReset = saved;
        this.setTempData();
    }

    workRewardBuilding: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Goal Focused',
            get: () => this.data.notReset.upgrades.workFromPrestige,
            setDecimal: (dec) => {
                this.data.notReset.upgrades.workFromPrestige = dec;
            },
        }),
        costs: [
            { expo: { initial: 1, coefficient: 1.3 }, resource: this.xpResource },
        ],
        description: `More Work from Prestige`,
        hidden: () => false,
        outcome: () => {
            return `+0.1x Work rewarded from Prestige`
        },
    })

    jobSpeedXPBuilding: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Years of Experience',
            get: () => this.data.notReset.upgrades.jobSpeed,
            setDecimal: (dec) => {
                this.data.notReset.upgrades.jobSpeed = dec;
                this.calcJobSpeed();
            },
        }),
        costs: [
            { expo: { initial: 2, coefficient: 1.5 }, resource: this.xpResource },
        ],
        description: `More Job Speed`,
        hidden: () => this.data.notReset.upgrades.workFromPrestige.eq(0),
        outcome: () => {
            return `+1x Job Speed`
        },
    })

    resistanceUpgradeBuilding: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Care Free',
            get: () => this.data.notReset.upgrades.effectiveResistance,
            setDecimal: (dec) => {
                this.data.notReset.upgrades.effectiveResistance = dec;
                this.setResistanceDiv();
            },
        }),
        costs: [
            { expo: { initial: 4, coefficient: 1.7 }, resource: this.xpResource },
        ],
        description: `Increases environment resistance`,
        hidden: () => this.data.notReset.upgrades.jobSpeed.eq(0),
        outcome: () => {
            return `+0.1x Effective Resistance`
        },
    })

    res_doubleWatering: SingleResearch = new SingleResearch({
        name: "Long Watering",
        hidden: () => this.data.notReset.upgrades.workFromPrestige.eq(0),
        description: "Doubles watering duration in the garden.",
        get: () => this.data.notReset.upgrades.garden > 0,
        makeTrue: () => { this.data.notReset.upgrades.garden = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(3) }
        ]
    })

    res_doubleWateringAgain: SingleResearch = new SingleResearch({
        name: "Super Watering",
        hidden: () => this.data.notReset.upgrades.garden === 0,
        description: "Doubles watering power in the garden.",
        get: () => this.data.notReset.upgrades.garden > 1,
        makeTrue: () => { this.data.notReset.upgrades.garden = 2 },
        costs: [
            { resource: this.xpResource, count: new Decimal(6) }
        ]
    })

    res_g3_plusPlot: SingleResearch = new SingleResearch({
        name: "+1 Garden Plot",
        hidden: () => this.data.notReset.upgrades.garden < 2,
        description: "More Plot!",
        get: () => this.data.notReset.upgrades.garden > 2,
        makeTrue: () => { this.data.notReset.upgrades.garden = 3 },
        costs: [
            { resource: this.xpResource, count: new Decimal(12) }
        ]
    })

    res_g4_plusSlot: SingleResearch = new SingleResearch({
        name: "+1 Bag Slot",
        hidden: () => this.data.notReset.upgrades.garden < 3,
        description: "More Slot!",
        get: () => this.data.notReset.upgrades.garden > 3,
        makeTrue: () => { this.data.notReset.upgrades.garden = 4 },
        costs: [
            { resource: this.xpResource, count: new Decimal(24) }
        ]
    })

    res_doom1_autoclickers: SingleResearch = new SingleResearch({
        name: "Cursed Clicking",
        hidden: () => this.data.notReset.upgrades.garden < 1,
        description: "Unlocks a new Doom upgrade",
        get: () => this.data.notReset.upgrades.doom > 0,
        makeTrue: () => { this.data.notReset.upgrades.doom = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(8) }
        ]
    })

    res_doom2_letsPrestige: SingleResearch = new SingleResearch({
        name: "Replicating Doom",
        hidden: () => this.data.notReset.upgrades.doom < 1,
        description: "Unlocks another Doom upgrade",
        get: () => this.data.notReset.upgrades.doom > 1,
        makeTrue: () => { this.data.notReset.upgrades.doom = 2 },
        costs: [
            { resource: this.xpResource, count: new Decimal(16) }
        ]
    })

    res_jobs1_morexp: SingleResearch = new SingleResearch({
        name: "Distance -> XP",
        hidden: () => this.data.notReset.upgrades.effectiveResistance.eq(0),
        description: "Get +1XP per 10k distance on prestige",
        get: () => this.data.notReset.upgrades.job > 0,
        makeTrue: () => { this.data.notReset.upgrades.job = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(16) }
        ],
    })

    res_jobs2_levels: SingleResearch = new SingleResearch({
        name: "Levels",
        hidden: () => this.data.notReset.upgrades.job < 1,
        description: "Unlocks Skill Levels",
        get: () => this.data.notReset.upgrades.job > 1,
        makeTrue: () => { this.data.notReset.upgrades.job = 2 },
        costs: [
            { resource: this.xpResource, count: new Decimal(64) }
        ],
    })

    res_energy1_nextReset: SingleResearch = new SingleResearch({
        name: "An Even Worse Fate",
        hidden: () => this.data.notReset.upgrades.doom < 1 || this.engine.datamap.unlocksStates.one < 7,
        description: "Unlocks another reset",
        get: () => this.data.notReset.upgrades.energy > 0,
        makeTrue: () => { this.data.notReset.upgrades.energy = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(32) }
        ]
    })


}

export enum JobsList {
    'Swimmer'
}
export interface JobsListInfo {
    name: string,
    speedPlusLabel: string,
    speedMultLabel: string,
    resistanceLabels: string[],
    unitsLabel: string,
    slowReason: string,
    progressLabel: string,
}
export const FULL_JOBS_LIST: JobsListInfo[] = [
    {
        name: 'Swimmer',
        speedPlusLabel: 'Swim Speed +',
        speedMultLabel: 'Swim Speed x',
        unitsLabel: 'Distance',
        resistanceLabels: ['pH Resistance','Penetration'],
        slowReason: 'The toxicity of the environment',
        progressLabel: 'Speed'

    }
]

export interface JobsData {
    jobspeedplus: Decimal,
    jobspeedmult: Decimal,
    jobResistance: Decimal,
    work: Decimal,
    converted: boolean,
    jobProgress: Decimal,
    farthesthProgress: Decimal,
    last: Decimal,
    jobGoalMet: boolean,
    jobID: number,
    notReset: {
        mechancProgession: number,
        jobResistanceMult: Decimal,
        xp: Decimal,
        rebuy: boolean,
        upgrades: {
            job: number
            cubiclePower: Decimal,
            garden: number
            doom: number
            energy: number
            workFromPrestige: Decimal
            jobSpeed: Decimal
            effectiveResistance: Decimal
        }
    }
}

const ZERO = new Decimal(0)
export function JobsData_Init(): JobsData {
    return {
        jobspeedmult: ZERO,
        jobspeedplus: ZERO,
        jobResistance: ZERO,
        work: ZERO,
        jobGoalMet: false,
        converted: false,
        jobProgress: ZERO,
        jobID: 0,
        last: ZERO,
        farthesthProgress: ZERO,
        notReset: {
            mechancProgession: 0,
            xp: ZERO,
            rebuy: false,
            jobResistanceMult: ZERO,
            upgrades: {
                doom: 0,
                cubiclePower: ZERO,
                energy: 0,
                garden: 0,
                job: 0,
                workFromPrestige: ZERO,
                jobSpeed: ZERO,
                effectiveResistance: ZERO
            }

        },
    }
}

export function JobsData_SetDecimals(data: Datamap) {
    data.jobs.work = new Decimal(data.jobs.work);
    data.jobs.jobResistance = new Decimal(data.jobs.jobResistance);
    data.jobs.jobspeedmult = new Decimal(data.jobs.jobspeedmult);
    data.jobs.jobspeedplus = new Decimal(data.jobs.jobspeedplus);
    data.jobs.jobProgress = new Decimal(data.jobs.jobProgress);
    data.jobs.last = new Decimal(data.jobs.last);
    data.jobs.farthesthProgress = new Decimal(data.jobs.farthesthProgress);
    data.jobs.notReset.xp = new Decimal(data.jobs.notReset.xp);
    data.jobs.notReset.jobResistanceMult = new Decimal(data.jobs.notReset.jobResistanceMult);
    data.jobs.notReset.upgrades.jobSpeed = new Decimal(data.jobs.notReset.upgrades.jobSpeed)
    data.jobs.notReset.upgrades.cubiclePower = new Decimal(data.jobs.notReset.upgrades.cubiclePower)
    data.jobs.notReset.upgrades.workFromPrestige = new Decimal(data.jobs.notReset.upgrades.workFromPrestige)
    data.jobs.notReset.upgrades.effectiveResistance = new Decimal(data.jobs.notReset.upgrades.effectiveResistance)
}