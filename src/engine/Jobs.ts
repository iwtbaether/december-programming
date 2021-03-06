import Decimal from "break_infinity.js";
import { Datamap } from "./Datamap";
import Engine from "./Engine";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import { SingleResearch } from "./Research";

export default class Jobs {

    constructor(public engine: Engine) {
        this.setTempData();
    }

    setTempData = () => {
        this.calcJobSpeed();
        this.setResistanceDiv();
        this.setSeedGainSpeedMulti();
        this.setSeedGainCountMulti();
        this.chargeCurrent.calculate();
        this.setNames();

    }

    realReset = () => {
         
        if (this.engine.datamap.skillManager.fortitude.level.greaterThanOrEqualTo(1)) {
            let sv1 = this.engine.datamap.jobs.notReset.upgrades.jobSpeed;
            let sv2 = this.engine.datamap.jobs.notReset.upgrades.workFromPrestige;
            let sv3 = this.engine.datamap.jobs.notReset.upgrades.effectiveResistance;
            this.engine.datamap.jobs = JobsData_Init();
            this.engine.datamap.jobs.notReset.upgrades.jobSpeed = sv1;
            this.engine.datamap.jobs.notReset.upgrades.workFromPrestige = sv2;
            this.engine.datamap.jobs.notReset.upgrades.effectiveResistance = sv3;
    } else {
        this.engine.datamap.jobs = JobsData_Init();
        }
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
        let jsMult3 = this.engine.garden.gardenJobSpeedMult;
        if (this.engine.theExchange.JU12.true) { jsMult3 = jsMult3.times(2) }
        if (this.engine.garden.juice.drinkPowers.s3) {
            jsMult3 = jsMult3.times(this.engine.garden.juice.drinkPowers.s3);
        }
        this.calced.finalJobSpeedMult = jsMult1.times(jsMult2).times(jsMult3);
        const precap = this.calced.finalBaseJobSpeed.times(this.calced.finalJobSpeedMult)

        this.calced.finalJobSpeed = precap;
    }

    setJobProgress = (decimal: Decimal) => {
        this.data.jobProgress = decimal;
    }

    addJobProgress = (decimal: Decimal) => {
        this.data.jobProgress = this.data.jobProgress.add(decimal);
    }

    progress = (deltaS: Decimal) => {


        
        
        //console.log(this.calced.finalJobSpeed, this.calced.finalResitanceDiv);
        
        //x_2 = x_1 + ((t)(s) / ((x+1) * (r)))

        //x is time, y is distance
        //dy = t*k_1 / ((y+1))
        let progressPerSecondAfterResistance = this.calced.finalJobSpeed.div(this.data.jobProgress.add(1).times(this.calced.finalResitanceDiv));
        //CALCULUS PLELASE


        if (this.chargeCurrent.count.greaterThan(0)) {
            const speed = this.getChargeSpeed();
            progressPerSecondAfterResistance.add(speed); 
            this.chargeCurrent.loseResource(speed.times(deltaS));
            
            /*       //old
            const trans = speed.times(deltaS);
            //is charge double dipping here? .. i commented it out because i think so. old implementation left over perhaps?
            //this.addJobProgress(trans);
            */
        }

        const capped = Decimal.min(this.getCap(), progressPerSecondAfterResistance);

        //console.log(capped);
        
        this.addJobProgress(capped.times(deltaS));
        this.chargeCurrent.calculate();
        //need to remove this call for optimizng
    }

    //accurately handles big delta, but ignores other stuff.
    progress2 = (deltaS: Decimal) => {
        const baseSpeed = this.calced.finalJobSpeed;
        const resistanceBase = this.calced.finalResitanceDiv;
        const k = baseSpeed.div(resistanceBase);

        const x0 = this.data.jobProgress;

        const resistanceMult = this.data.jobProgress.add(1);


        //x = sqrt(2kt + x^2)
        const newX = Decimal.sqrt(k.times(2).times(deltaS).add(x0.sqr()));
        const gain = newX.minus(x0);
        this.setJobProgress(newX)
    }
    
    progress2BadCapped = (deltaS: Decimal) => {
        const baseSpeed = this.calced.finalJobSpeed;
        const resistanceBase = this.calced.finalResitanceDiv;
        const k = baseSpeed.div(resistanceBase);

        const x0 = this.data.jobProgress;

        const resistanceMult = this.data.jobProgress.add(1);

        const capped = Decimal.min(this.getCap(), k);



        //x = sqrt(2kt + x^2)
        const newX = Decimal.sqrt(capped.times(2).times(deltaS).add(x0.sqr()));
        const gain = newX.minus(x0);
        this.setJobProgress(newX)
    }



    getCap = ( ) => {
        const jobID = this.data.notReset.jobID;
        if (jobID === 0) return 1000;
        if (jobID === 1) return 140;
        
        return 0;
    }

    offlineProgress = (bigDeltaS: Decimal) => {
        //skip charge?
        //skip cap?
        this.progress2BadCapped(bigDeltaS);
        /*
        while (bigDeltaS.greaterThan(0)) {
            const cappedTickLength = Decimal.min(10, bigDeltaS);
            bigDeltaS = bigDeltaS.minus(cappedTickLength);
            this.progress(cappedTickLength);
        }*/
    }

    setResistanceDiv = () => {

        let resistMulti1 = this.data.notReset.jobResistanceMult.add(1);
        let resistMulti2 = this.data.notReset.upgrades.effectiveResistance.times(.1).add(1);
        let resistMult = resistMulti1.times(resistMulti2);

        const baseResist = this.data.jobResistance.add(1);
        const resist = baseResist.times(resistMult);

        const one = new Decimal(1);
        this.calced.finalResitanceDiv = one.div(resist);
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

    jobTierResource = new SingleResource({
        name: 'Job Tier',
        get: () => {
            if (this.engine.datamap.jobs.notReset.jobID === 0) return new Decimal(0);
            if (this.engine.datamap.jobs.notReset.jobID === 1) return new Decimal(1);

            return new Decimal(0);
        },
            setDecimal: (decimal) => {
            //noop
        },
    })

    convertToWork = () => {
        if (this.data.converted) return;
        if (this.data.work.lt(1)) {
            this.workResource.gainResource(this.engine.datamap.unlocksStates.one);
            this.data.converted = true;
        }
        
        /* old version
        if (this.data.converted) return;
        else {
            this.data.converted = true;
            this.workResource.gainResource(this.engine.datamap.unlocksStates.one);
            //this.engine.energyResource.info.setDecimal(new Decimal(0));
        }*/

        this.engine.notify();
    }

    getWorkReward = () => {
        let pp = this.data.jobProgress;
        let mult = Decimal.add(1, Decimal.times(.1, this.data.notReset.upgrades.workFromPrestige))
        if (this.engine.theExchange.JU11.true) mult = mult.times(2);
        if (this.engine.garden.juice.drinkPowers.g3) {
            mult = this.engine.garden.juice.drinkPowers.g3.add(1).times(mult);
        }
        return pp.times(mult);
    }


    ifIsFarthestSet = () => {
        const data = this.data;
        const nr = data.notReset
        const jp = data.jobProgress

        if (nr.jobID === 0) {
            if (jp.greaterThan(nr.records.zero)) {
                    nr.records.zero = jp
                    this.setSeedGainSpeedMulti();
            }
        
        }
        else if (nr.jobID === 1) {
            if (jp.greaterThan(nr.records.grower)) {
                    nr.records.grower = jp
                    this.setSeedGainCountMulti();
            }
        
        }
    }

    prestige = () => {
        //calc new values
        const data = this.data;
        const pp = this.data.jobProgress;
        
        const reward = this.getWorkReward();

        //setup farthest job progress
        this.ifIsFarthestSet();

        if (pp.greaterThan(10000)) {
            if (data.notReset.mechancProgession === 0) data.notReset.mechancProgession = 1;
            let xpGain = new Decimal(1);
            if (data.notReset.upgrades.job >= 1) xpGain = xpGain.add(pp.div(10000).floor())
            this.xpResource.gainResource(xpGain)
            if (this.engine.skillManager.skills.patience.getData().unlocked) {
                if (pp.greaterThanOrEqualTo(1000000)) {
                    this.engine.skillManager.skills.patience.gainXP(pp.divideBy(1000000))
                }
            }
        }


        let old;
        if (this.data.notReset.rebuy) {
            old = [this.data.jobspeedplus, this.data.jobspeedmult, this.data.jobResistance]
        }

        //reset
        this.reset();

        //set new values
        this.workResource.gainResource(reward);
        this.data.last = pp;

        if (this.data.notReset.rebuy && old) {
            if (old[0]) this.jobSpeed.buyN(old[0]);
            if (old[1]) this.jobSpeedMult.buyN(old[1]);
            if (old[2]) this.jobResistance.buyN(old[2]);
        }

        //setup memory

        //need to move this // working on this
        if (data.notReset.jobID === 0)  if (this.engine.theExchange.JU13.true) {
            if (pp.greaterThanOrEqualTo(this.currentGoal())) {
                if (data.notReset.mechancProgession === 1) {
                    data.notReset.mechancProgession = 2; //got to job two!
                }
                this.changeJob(1);
            }
        }


        //update ui
        this.engine.notify();
    }

    seedGainSpeedMult = 1;
    setSeedGainSpeedMulti = () => {
        let base = 1;
        base = base + Decimal.log10(this.data.notReset.records.zero.add(1)) / 10
        this.seedGainSpeedMult = base;
    }

    seedGainCountMult = 1;
    setSeedGainCountMulti = () => {
        let base = 1;
        base = base + Decimal.log10(this.data.notReset.records.grower.add(1)) / 10
        this.seedGainCountMult = base;
    }

    jobSpeed: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.notReset.jobID].speedPlusLabel,
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
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.notReset.jobID].speedMultLabel,
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
        hidden: () => this.jobSpeed.count.eq(0),
        outcome: () => '+1x Job Speed',
    })

    jobResistance: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.notReset.jobID].resistanceLabels[0],
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
        hidden: () => this.jobSpeedMult.count.eq(0),
        outcome: () => '+1 Base Job Resistance',
    })

    jobResistanceMult: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: FULL_JOBS_LIST[this.engine.datamap.jobs.notReset.jobID].resistanceLabels[1],
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

    chargeStorage: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Charge Storage',
            get: () => this.engine.datamap.jobs.notReset.chargeStorage,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.notReset.chargeStorage = dec
                this.chargeCurrent.calculate();
            },
        }),
        costs: [
            { expo: { initial: 7, coefficient: 1.169 }, resource: this.engine.garden.triangularFruit },
        ],
        description: 'Provides base Charge storage',
        hidden: () => this.data.notReset.mechancProgession === 0,
        outcome: () => '+100 Charge storage',
    })

    changeJob = (newID: number) => {
        if ([0, 1].includes(newID)) {
            this.data.notReset.jobID = newID;
            this.resetBuildings();
            this.data.work = ZERO;
            this.data.converted = false;
            //this.data.work = this.da
        }
    }
    
    resetBuildings = () => {
        this.jobResistance.reset();
        this.jobResistanceMult.reset();
        this.jobSpeed.reset();
        this.jobSpeedMult.reset();
        this.chargeStorage.reset();
        this.chargePower.reset();
        this.data.work = ZERO;
        this.data.jobProgress = ZERO;

        this.setNames();
        
    }
    
    setNames = () => {
        const jobID = this.data.notReset.jobID;
        this.jobResistance.info.building.info.name = FULL_JOBS_LIST[jobID].resistanceLabels[0];
        this.jobResistanceMult.info.building.info.name = FULL_JOBS_LIST[jobID].resistanceLabels[1];
        this.jobSpeed.info.building.info.name = FULL_JOBS_LIST[jobID].speedPlusLabel;
        this.jobSpeedMult.info.building.info.name = FULL_JOBS_LIST[jobID].speedMultLabel;
    }

    chargeCurrent = new SingleResource({
        name: 'Charge',
        get: () => this.engine.datamap.jobs.notReset.chargeCurrent,
        setDecimal: (dec) => {
            if (dec.lessThan(0)) dec = ZERO;
            this.engine.datamap.jobs.notReset.chargeCurrent = dec
            //this.setResistanceDiv();
        },
        calculateCap: () => {
            //console.log('calc cap');

            return this.data.notReset.chargeStorage.times(100);
        },
        calculateGain: () => {
            return Decimal.negate(this.getChargeSpeed())
        }
    })

    fillCharge = () => {
        this.chargeCurrent.info.setDecimal(this.chargeCurrent.cap);
    }

    getChargeSpeed = () => {
        return this.data.notReset.chargeCurrent.times(this.data.notReset.chargePower.add(1).times(.01))
    }

    tenkum = new Decimal(10000);
    mum = new Decimal(1000000);
    currentGoal = () => {
        const jobID = this.data.notReset.jobID;
        if (jobID === 0) {
            if (this.engine.theExchange.JU13.true) return this.mum;
            else return this.tenkum;
        } else if (jobID === 1) {
            return goalSizeInMicrograms;
        }
        else return new Decimal(0)
    }

    

    chargePower: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Charge Power',
            get: () => this.engine.datamap.jobs.notReset.chargePower,
            setDecimal: (dec) => {
                this.engine.datamap.jobs.notReset.chargePower = dec
                //this.setResistanceDiv();
            },

        }),
        costs: [
            { expo: { initial: 1, coefficient: 4.2 }, resource: this.xpResource },
        ],
        description: 'More usage and effect from charge',
        hidden: () => this.data.notReset.chargeStorage.eq(0),
        outcome: () => '+1x Charge Power',
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
        description: `More Job Progress`,
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
        makeTrue: () => { 
            this.data.notReset.upgrades.garden = 3 
            this.engine.garden.calcGardenPlots();
        },
        costs: [
            { resource: this.xpResource, count: new Decimal(12) }
        ]
    })

    res_g4_plusSlot: SingleResearch = new SingleResearch({
        name: "+1 Bag Slot",
        hidden: () => this.data.notReset.upgrades.garden < 3,
        description: "More Slot!",
        get: () => this.data.notReset.upgrades.garden > 3,
        makeTrue: () => { this.data.notReset.upgrades.garden = 4;
            this.engine.garden.calcBagSlots(); 
        },
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
            { resource: this.xpResource, count: new Decimal(8) }
        ],
    })


    

    res_jobs2_levels: SingleResearch = new SingleResearch({
        name: "Skills",
        hidden: () => this.data.notReset.mechancProgession < 2 && this.engine.datamap.skillManager.manager.unlocked === false,
        description: "Unlocks Skills",
        get: () => this.engine.datamap.skillManager.manager.unlocked,
        makeTrue: () => { this.engine.datamap.skillManager.manager.unlocked = true},
        costs: [
            { resource: this.xpResource, count: new Decimal(100) },
            { resource: this.jobTierResource, count: new Decimal(1) },
        ],
    })

    res_energy1_nextReset: SingleResearch = new SingleResearch({
        name: "An Even Worse Fate",
        hidden: () => this.data.notReset.upgrades.doom < 1,
        description: "Unlocks another reset",
        get: () => this.data.notReset.upgrades.energy > 0,
        makeTrue: () => { this.data.notReset.upgrades.energy = 1 },
        costs: [
            { resource: this.xpResource, count: new Decimal(32), },
            { resource: this.engine.difficultyResource, count: new Decimal(7) }
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
        speedPlusLabel: 'Tail Length',
        speedMultLabel: 'Tail Strength',
        resistanceLabels: ['pH Resistance', 'Penetration'],
        unitsLabel: 'μm',
        slowReason: 'The toxic environment is',
        progressLabel: 'Distance'

    },
    {
        name: 'Grower',
        speedPlusLabel: 'Blood',
        speedMultLabel: 'Sugar',
        resistanceLabels: ['Love', 'Hope'],
        unitsLabel: 'micrograms',
        slowReason: 'Teratogens are',
        progressLabel: 'Size'
    }
]


//goal size 3300 * 10^6g
// 39 weeks
// seconds in 2.359e+7
// 0.00013988978 g/s for 39 weeks eta
// 0.13988978 milligrams /s for 39 weeks eta
// 139.88978 micrograms /s for 39 weeks eta
const goalSizeInMicrograms = new Decimal(3300e+6)


export interface JobsData {
    jobspeedplus: Decimal,
    jobspeedmult: Decimal,
    jobResistance: Decimal,
    work: Decimal,
    converted: boolean,
    jobProgress: Decimal,
    last: Decimal,
    notReset: {
        mechancProgession: number,
        jobID: number,
        jobResistanceMult: Decimal,
        xp: Decimal,
        rebuy: boolean,
        chargeStorage: Decimal,
        chargeCurrent: Decimal,
        chargePower: Decimal,
        upgrades: {
            job: number
            cubiclePower: Decimal,
            garden: number
            doom: number
            energy: number
            workFromPrestige: Decimal
            jobSpeed: Decimal
            effectiveResistance: Decimal
        },
        records: {
            zero: Decimal;
            grower: Decimal;
            consumer: Decimal;
            entry1: Decimal;
            entry2: Decimal;
            entry3: Decimal;
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
        converted: false,
        jobProgress: ZERO,
        last: ZERO,
        notReset: {
            jobID: 0,
            mechancProgession: 0,
            xp: ZERO,
            rebuy: false,
            jobResistanceMult: ZERO,
            chargeStorage: ZERO,
            chargeCurrent: ZERO,
            chargePower: ZERO,
            upgrades: {
                doom: 0,
                cubiclePower: ZERO,
                energy: 0,
                garden: 0,
                job: 0,
                workFromPrestige: ZERO,
                jobSpeed: ZERO,
                effectiveResistance: ZERO
            },
            records: {
                zero: ZERO,
                consumer: ZERO,
                entry1: ZERO,
                grower: ZERO,
                entry2: ZERO,
                entry3: ZERO,
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
    data.jobs.notReset.xp = new Decimal(data.jobs.notReset.xp);
    data.jobs.notReset.jobResistanceMult = new Decimal(data.jobs.notReset.jobResistanceMult);
    data.jobs.notReset.upgrades.jobSpeed = new Decimal(data.jobs.notReset.upgrades.jobSpeed)
    data.jobs.notReset.upgrades.cubiclePower = new Decimal(data.jobs.notReset.upgrades.cubiclePower)
    data.jobs.notReset.upgrades.workFromPrestige = new Decimal(data.jobs.notReset.upgrades.workFromPrestige)
    data.jobs.notReset.upgrades.effectiveResistance = new Decimal(data.jobs.notReset.upgrades.effectiveResistance)

    data.jobs.notReset.chargePower = new Decimal(data.jobs.notReset.chargePower);
    data.jobs.notReset.chargeStorage = new Decimal(data.jobs.notReset.chargeStorage);
    data.jobs.notReset.chargeCurrent = new Decimal(data.jobs.notReset.chargeCurrent);

    data.jobs.notReset.records.zero = new Decimal(data.jobs.notReset.records.zero);
    data.jobs.notReset.records.grower = new Decimal(data.jobs.notReset.records.grower);
    data.jobs.notReset.records.consumer = new Decimal(data.jobs.notReset.records.consumer);
    data.jobs.notReset.records.entry1 = new Decimal(data.jobs.notReset.records.entry1);
    data.jobs.notReset.records.entry2 = new Decimal(data.jobs.notReset.records.entry2);
    data.jobs.notReset.records.entry3 = new Decimal(data.jobs.notReset.records.entry3);
}