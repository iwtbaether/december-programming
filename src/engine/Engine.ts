import Decimal from "break_infinity.js";
import _ from "lodash";
import { BasicCommand } from "../UI/comps/BasicCommand";
import DisplayDecimal from "../UI/DisplayDecimal";
import CoreEngine from "./CoreEngine";
import DoomResearches from "./DoomResearches";
import EnergyModule from "./EnergyModule";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import Garden from "./garden/Garden";
import Jobs from "./Jobs";
import Crafting from "./m_st/Crafting";
import Research from "./Research";


export const AUTOSAVE_INTERVAL = 1000 * 60;

export default class Engine extends CoreEngine {

    doom: SingleResource = new SingleResource({
        name: 'Doom',
        get: () => this.datamap.cell.doom,
        setDecimal: (d) => {
            this.datamap.cell.doom = d;
            this.antiEnergyResource.calculate();
        }
    })

    crafting: Crafting = new Crafting(this);
    energyModule: EnergyModule = new EnergyModule(this);
    research: Research = new Research(this);
    garden: Garden = new Garden(this);
    jobs: Jobs = new Jobs(this);
    
    processDelta = (delta: number) => {


        this.garden.processDelta(delta)

        if (delta < 0) delta = 0;

        const deltaS = delta / 1000;

        this.energyResource.gainResource(this.energyResource.gainPS.times(deltaS))

        if (this.datamap.unlocksStates.one >= 6) this.jobs.processDelta(delta)

        //console.log(deltaS);
        //console.log(this.datamap.last)
    }

    clearActivity = () => {
        this.datamap.activity = 0;
        this.calcEnergy();
        this.notify();
    }
    setActivity = (num: number) => {
        this.datamap.activity = num;
        this.calcEnergy();
        this.notify();
    }

    


    energyResource = new SingleResource({
        name: 'Energy',
        get: () => this.datamap.cell.a,
        setDecimal: (decimal) => {
            this.datamap.cell.a = decimal
        },
        calculateGain: () => {
            const mult: Decimal = this.energyModule.energyGainMult;
            let base = this.energyModule.energyGainPerSecondBase();
            if (this.datamap.activity === 1) base = base.add(this.energyModule.energyGainFromActivityBase());
            return base.times(mult)
        }
    })

    antiEnergyResource = new SingleResource({
        name: 'Anti Energy',
        get: () => this.datamap.cell.aa,
        setDecimal: (decimal) => {
            this.datamap.cell.aa = decimal
        },
        calculateCap: ()=>this.datamap.cell.doom.add(1)
    })

    

    drive: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Drive',
            get: () => this.datamap.cell.c,
            setDecimal: (dec) => {
                this.datamap.cell.c = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 1000, coefficient: 1.3 }, resource: this.energyResource },
        ],
        description: 'Increased Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 2,
        outcome: () => '+1x Energy Gain',
    })

    antiDrive: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Drive (A)',
            get: () => this.datamap.cell.cc,
            setDecimal: (dec) => {
                this.datamap.cell.cc = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 100, coefficient: 1.3 }, resource: this.antiEnergyResource },
        ],
        description: 'Increased Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 4,
        outcome: () => '+1x Energy Gain',
    })

    setNav = (num: number) => {
        this.datamap.nav = num;
        this.notify();
    }

    gainEnergy = (gain: Decimal) => {
        if (gain.greaterThanOrEqualTo(0)) {
            this.energyResource.gainResource(gain)
        } else {
            this.antiEnergyResource.gainResource(gain.negate())
            if (this.datamap.unlocksStates.two === 1) {
                this.datamap.unlocksStates.two = 2;
            }
        }
    }

    energy = {
        gatherEnergy: () => {
            const gain = this.energyModule.energyPerClick;
            this.gainEnergy(gain);
            this.notify();
        },
        unlockGoal: () => {
            return Decimal.pow(100, this.datamap.unlocksStates.one).times(100)
            //return 100 * Math.pow(100, this.datamap.unlocksStates.one)
        },
        canGiveUp: () => {
            return this.datamap.cell.a.greaterThanOrEqualTo(this.energy.unlockGoal())
        },
        giveUp: () => {
            if (this.energy.canGiveUp()) {
                this.clearDoom();
                this.clearEnergy();
                this.datamap.unlocksStates.one++;
                this.datamap.cell.swimmerNumber = this.datamap.cell.swimmerNumber.add(1);
                this.calcEnergy();
                this.notify();
            }
        },
        giveUpLevel2Cost: 100000,
        giveUpLevel2: () => {
            //console.log('gul2');
            
            if (this.energyResource.count.greaterThanOrEqualTo(this.energy.giveUpLevel2Cost)) {
                const gainedDoom = this.doomGain();
                this.doom.gainResource(gainedDoom);
                if (this.datamap.unlocksStates.two === 0) {
                    this.datamap.unlocksStates.two = 1
                }
                this.datamap.cell.swimmerNumber = this.datamap.cell.swimmerNumber.add(1);

                this.clearEnergy();
                this.calcEnergy();
                this.notify();
            }
        },


    }

    doomGain = () => {
        let gainedDoom = Decimal.floor(this.energyResource.count.divideBy(this.energy.giveUpLevel2Cost))
        gainedDoom = gainedDoom.add(gainedDoom.times(this.doomUpgrade2.count));
        if (this.datamap.garden.fruits.doom.greaterThan(0)) {
            gainedDoom = gainedDoom.times(this.datamap.garden.fruits.doom.add(1))
        }
        return gainedDoom;
    }
    clearDoom = () => {
        const zero = new Decimal(0)
        this.doom.info.setDecimal(zero);
        this.doomUpgrade1.reset();
        this.doomUpgrade2.reset();
        this.doomUpgrade3.reset();
    }
    clearEnergy = () =>{
        this.energyResource.info.setDecimal(new Decimal(0))
        this.antiEnergyResource.info.setDecimal(new Decimal(0))
        this.effort.reset();
        this.drive.reset()
        this.antiDrive.reset();
        this.autoclickerBuilding.reset();
        this.calcEnergy();
    }
    

    gUL2: BasicCommand = {
        command: this.energy.giveUpLevel2,
        label: "Give up, accept Doom",
        hidden: () => this.datamap.unlocksStates.one < 3,
        able: () => this.energyResource.count.greaterThanOrEqualTo(this.energy.giveUpLevel2Cost),
        description: 'wy?'
    }

    

    effort: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Effort',
            get: () => this.datamap.cell.b,
            setDecimal: (dec) => {
                this.datamap.cell.b = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 10, coefficient: 1.2 }, resource: this.energyResource },
        ],
        description: 'Base Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 1,
        outcome: () => '+1 Energy Gain',
    })

    doomUpgrade1: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Doomed Clicking',
            get: () => this.datamap.cell.d1,
            setDecimal: (dec) => {
                this.datamap.cell.d1 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 5, coefficient: 2 }, resource: this.doom },
        ],
        description: 'Makes clicking better[!/?]',
        hidden: () => this.datamap.unlocksStates.two < 1,
        outcome: () => {
            const now = this.datamap.cell.d1;
            return `-1 Base Energy Gain from Clicking\nCurrent: ${this.energyModule.energyGainClickBase()}`
        },
    })

    doomUpgrade2: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Impending Doom',
            get: () => this.datamap.cell.d2,
            setDecimal: (dec) => {
                this.datamap.cell.d2 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 4, coefficient: 2 }, resource: this.antiEnergyResource },
            { expo: { initial: 5, coefficient: 1.2 }, resource: this.doom },
        ],
        description: `Base Doom Gain`,
        hidden: () => this.datamap.unlocksStates.two < 2,
        outcome: () => {
            return `+1 Base Doom Gain`
        },
    })

    doomUpgrade3: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Empowering Doom',
            get: () => this.datamap.cell.d3,
            setDecimal: (dec) => {
                this.datamap.cell.d3 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 20, coefficient: 1.3 }, resource: this.doom },
        ],
        description: `More Energy Gain`,
        hidden: () => this.datamap.cell.d2.lessThan(1) && this.datamap.unlocksStates.one < 4,
        outcome: () => {
            return `+1x Energy Gain\nCurrent: ${this.datamap.cell.d3.add(1)}x`
        },
    })

    determination: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Determination',
            get: () => this.datamap.cell.determination,
            setDecimal: (dec) => {
                this.datamap.cell.determination = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 10, coefficient: 1.1 }, resource: this.garden.hopeFruit },
        ],
        description: `More Energy Gain`,
        hidden: () => this.datamap.cell.determination.lessThan(1) && this.datamap.garden.fruits.hope.eq(0),
        outcome: () => {
            return `+1x Energy Gain\nCurrent: ${this.datamap.cell.determination.add(1)}x`
        },
    })



    doomResearch: DoomResearches = new DoomResearches(this);

    autoclickerBuilding: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Autoclickers',
            get: () => this.datamap.cell.autoclicker,
            setDecimal: (dec) => {
                this.datamap.cell.determination = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 10000, coefficient: 1.1 }, resource: this.energyResource },
        ],
        description: `Gathers Energy Once Every Second`,
        hidden: () => this.datamap.cell.autoclicker.lessThan(1) && this.datamap.garden.fruits.hope.eq(0),
        outcome: () => {
            return `+1 Autoclicker`
        },
    })

    calcEnergy = () => {
        this.energyModule.setEnergyValues();
        this.energyResource.calculate();
    }

    extraLoad = () => {
        //console.log('EXTRALOAD');
        this.calcEnergy();
        this.antiEnergyResource.calculate();
        this.garden.setTempData();
        this.jobs.setTempData();
    }
  
    clearPopup = () => {
        this.datamap.popupUI = 0;
        this.notify();
    }

}

