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

    get data(): JobsData {
        return this.engine.datamap.jobs;
    }

    processDelta = (delta: number) => {
        if (delta > 10000) delta = 10000;
        this.progress(delta)
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
        const jsMult1 = this.data.jobspeedmult.add(1);
        const jsMult2 = this.data.notReset.upgrades.jobSpeed.add(1);
        this.engine.garden.setJobSpeedMult();
        const jsMult3 = this.engine.garden.jobSpeedMult;
        this.calced.finalJobSpeedMult = jsMult1.times(jsMult2).times(jsMult3);
        const precap = this.calced.finalBaseJobSpeed.times(this.calced.finalJobSpeedMult)
        this.calced.finalJobSpeed = precap;
    }

    progress = (delta: number) => {
        const deltaS = Decimal.divide(delta, 1000);
        const progressPerSecondAfterResistance = this.calced.finalJobSpeed.div(this.calced.finalResitanceDiv);
        const capped = Decimal.min(1000, progressPerSecondAfterResistance);
        this.data.jobProgress = this.data.jobProgress.add(capped.times(deltaS));
        this.setResistanceDiv();
    }

    setResistanceDiv = () => {
        const baseProgress = this.data.jobProgress.add(1)
        const baseResist = this.data.jobResistance.add(1);
        const resistMult = this.data.notReset.upgrades.effectiveResistance.times(.1).add(1);
        const resist = baseResist.times(resistMult);
        this.calced.finalResitanceDiv = baseProgress.div(resist);
    }


    workResource = new SingleResource({
        name: 'Work',
        get: () => this.engine.datamap.jobs.work,
        setDecimal: (decimal) => {
            this.engine.datamap.jobs.work = decimal
        },
    })

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

        let rng = 0;
        if (pp.greaterThan(10000)) {
            if (this.data.notReset.mechancProgession === 0) this.data.notReset.mechancProgession = 1;
            rng = getRandomInt(1, 3)
        }

        //reset
        this.reset();

        //set new values
        this.workResource.gainResource(reward);
        this.xpResource.gainResource(rng)
        this.data.farthesthProgress = farthest;

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
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.jobID].resistanceLabel,
            get: () => this.engine.datamap.jobs.jobResistance,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.jobResistance = dec
                this.setResistanceDiv();
            },
        }),
        costs: [
            { expo: { initial: 2, coefficient: 1.5 }, resource: this.workResource },
        ],
        description: 'Increased Job Resistance',
        hidden: () => false,
        outcome: () => '',
    })

    reset = () => {
        const saved = this.engine.datamap.jobs.notReset;
        this.engine.datamap.jobs = JobsData_Init();
        this.engine.datamap.jobs.notReset = saved;
        this.calcJobSpeed();
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
            { expo: { initial: 4, coefficient: 1.5 }, resource: this.xpResource },
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
            { expo: { initial: 8, coefficient: 1.5 }, resource: this.xpResource },
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
            { expo: { initial: 30, coefficient: 1.5 }, resource: this.xpResource },
        ],
        description: `Increases effectives resistance`,
        hidden: () => this.data.notReset.upgrades.workFromPrestige.lessThan(1),
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
            { resource: this.xpResource, count: new Decimal(8) }
        ]
    })

    res_doubleWateringAgain: SingleResearch = new SingleResearch({
        name: "Super Watering",
        hidden: () => this.data.notReset.upgrades.garden === 0,
        description: "Doubles watering power in the garden.",
        get: () => this.data.notReset.upgrades.garden > 1,
        makeTrue: () => { this.data.notReset.upgrades.garden = 2 },
        costs: [
            { resource: this.xpResource, count: new Decimal(16) }
        ]
    })

    res_doom1_autoclickers: SingleResearch = new SingleResearch({
        name: "Cursed Clicking",
        hidden: () => this.data.notReset.upgrades.garden === 0,
        description: "Unlocks a new Doom upgrade\n ps this doesn't work yet",
        get: () => this.data.notReset.upgrades.doom > 0,
        makeTrue: () => { this.data.notReset.upgrades.doom = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(16) }
        ]
    })

    res_jobs1_morexp: SingleResearch = new SingleResearch({
        name: "Distance -> XP",
        hidden: () => this.data.notReset.upgrades.effectiveResistance.eq(0),
        description: "Get 1XP per 100k distance on prestige.\n ps this doesn't work yet",
        get: () => this.data.notReset.upgrades.job > 0,
        makeTrue: () => { this.data.notReset.upgrades.job = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(33) }
        ]
    })


    upgrades = {
        //doubleSpeed: SingleResearch = new SingleResearch({})
    }

}

export enum JobsList {
    'Swimmer'
}
export interface JobsListInfo {
    name: string,
    speedPlusLabel: string,
    speedMultLabel: string,
    resistanceLabel: string,
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
        resistanceLabel: 'pH Resistance',
        slowReason: 'The toxicity of the environtment',
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
    jobGoalMet: boolean,
    jobID: number,
    notReset: {
        mechancProgession: number,
        xp: Decimal,
        upgrades: {
            job: number
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
        farthesthProgress: ZERO,
        notReset: {
            mechancProgession: 0,
            xp: ZERO,
            upgrades: {
                doom: 0,
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
    data.jobs.farthesthProgress = new Decimal(data.jobs.farthesthProgress);
    data.jobs.notReset.xp = new Decimal(data.jobs.notReset.xp);
    data.jobs.notReset.upgrades.jobSpeed = new Decimal(data.jobs.notReset.upgrades.jobSpeed)
    data.jobs.notReset.upgrades.workFromPrestige = new Decimal(data.jobs.notReset.upgrades.workFromPrestige)
    data.jobs.notReset.upgrades.effectiveResistance = new Decimal(data.jobs.notReset.upgrades.effectiveResistance)
}