import Decimal from "break_infinity.js";
import { timeStamp } from "console";
import _ from "lodash";
import { BasicCommand } from "../UI/comps/BasicCommand";
import CoreEngine from "./CoreEngine";
import DoomResearches from "./DoomResearches";
import EnergyModule from "./EnergyModule";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import Garden from "./garden/Garden";
import HotkeyManager from "./HotkeyManager";
import Jobs from "./Jobs";
import Crafting from "./m_st/Crafting";
import Research from "./Research";
import TheExchange from "./TheExchange";


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

    gloom: SingleResource = new SingleResource({
        name: 'Gloom',
        get: () => this.datamap.cell.gloom,
        setDecimal: (d) => {
            this.datamap.cell.gloom = d;
        },
        calculateGain: ()=>this.datamap.cell.gloomGen1.add(this.datamap.cell.gloomGen1E).times(this.datamap.cell.aewf)
    })

    crafting: Crafting = new Crafting(this);
    energyModule: EnergyModule = new EnergyModule(this);
    research: Research = new Research(this);
    garden: Garden = new Garden(this);
    jobs: Jobs = new Jobs(this);
    theExchange: TheExchange =new TheExchange(this);
    hotkeyManager: HotkeyManager = new HotkeyManager(this);


    handleKey = (key:string) => this.hotkeyManager.handle(key);

    
    processDelta = (delta: number) => {


        
        if (delta < 0) delta = 0;
        this.garden.processDelta(delta)
        

        const deltaS = delta / 1000;

        this.energyResource.gainResource(this.energyResource.gainPS.times(deltaS))
        this.antiEnergyResource.gainResource(this.antiEnergyResource.gainPS.times(deltaS))
        if (this.datamap.unlocksStates.one >= 6) this.jobs.processDelta(delta)
        if (this.datamap.unlocksStates.two > 2) {
            this.gloom.gainResource(this.gloom.gainPS.times(deltaS));
            this.datamap.cell.gloomGen1E = this.datamap.cell.gloomGen1E.add( this.gloomGen1.info.building.gainPS.times(deltaS))
            this.datamap.cell.gloomGen2E = this.datamap.cell.gloomGen2E.add( this.gloomGen2.info.building.gainPS.times(deltaS))
            this.datamap.cell.gloomGen3E = this.datamap.cell.gloomGen3E.add( this.gloomGen3.info.building.gainPS.times(deltaS))
            this.datamap.cell.gloomGen4E = this.datamap.cell.gloomGen4E.add( this.gloomGen4.info.building.gainPS.times(deltaS))
            this.calcGloom();
        }

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
            const mult: Decimal = this.energyModule.energyGainMult.times(this.crafting.energyCalcedData.passiveMore);
            const base = this.energyModule.energyGainPerSecondBase();
            let gain = base.times(mult);
            if (this.energyModule.energyGainFromAutoClickers.greaterThan(0)) gain = gain.add(this.energyModule.energyGainFromAutoClickers)
            if (this.datamap.activity === 1) gain = gain.add(this.energyModule.energyGainFromActivity);
            return gain;
        }
    })

    antiEnergyResource = new SingleResource({
        name: 'Anti Energy',
        get: () => this.datamap.cell.aa,
        setDecimal: (decimal) => {
            this.datamap.cell.aa = decimal
        },
        calculateGain: () => {
            let gain = new Decimal(0);
            if (this.energyModule.energyGainFromAutoClickers.lessThan(0)) gain = gain.minus(this.energyModule.energyGainFromAutoClickers)
            return gain;
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
        outcome: () =>`+1x Increased Energy Gain\nCurrent: ${this.energyModule.totalEnergyGainIncreased}x`,
    })

    antiDrive: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Anti-Drive ',
            get: () => this.datamap.cell.cc,
            setDecimal: (dec) => {
                this.datamap.cell.cc = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 10, coefficient: 1.2 }, resource: this.antiEnergyResource },
        ],
        description: 'Increased Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 4,
        outcome: () => `+1x Increased Energy Gain\nCurrent: ${this.energyModule.totalEnergyGainIncreased}x`,
    })

    momentum: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Momentum',
            get: () => this.datamap.cell.momentum,
            setDecimal: (dec) => {
                this.datamap.cell.momentum = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 1e5, coefficient: 2.1 }, resource: this.energyResource },
            { expo: { initial: 7, coefficient: 6.9 }, resource: this.gloom },
        ],
        description: 'More Energy Gain',
        hidden: () => this.datamap.unlocksStates.two < 3,
        outcome: () => {
            let now = this.momentum.count.add(1);
            return `x${now} -> x${now.add(1)} Energy Gain`
        },
    })

    setNav = (num: number) => {
        this.silentSetNav(num);
        this.notify();
    }

    silentSetNav = (num: number) => {
        this.datamap.nav = num;
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
            if (this.datamap.activity != 0) {
                this.datamap.activity = 0;
                this.calcEnergy();
            }
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
                if (this.datamap.cell.aewf.greaterThan(0)) {
                    this.datamap.cell.aewf = new Decimal(1)
                }

                this.clearDoom();
                this.clearEnergy();
                this.crafting.reset();
                this.garden.resetGarden();
                this.jobs.realReset();
                this.datamap.unlocksStates.one++;
                this.datamap.cell.swimmerNumber = this.datamap.cell.swimmerNumber.add(1);
                this.determination.reset();
                this.calcEnergy();
                this.resetGloom();
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
                this.crafting.getRandomCurrencyCount(5);
                this.datamap.cell.gloom = new Decimal(1);
                this.resetGloom();
                this.clearEnergy();
                this.calcEnergy();
                this.notify();
            }
        },


    }

    resetGloom = () => {
        const ZERO = new Decimal(0);
        this.datamap.cell.gloom = this.initialGloom();
        this.datamap.cell.gloomGen1 = ZERO;
        this.datamap.cell.gloomGen2 = ZERO;
        this.datamap.cell.gloomGen3 = ZERO;
        this.datamap.cell.gloomGen4 = ZERO;
        this.datamap.cell.gloomGen1E = ZERO;
        this.datamap.cell.gloomGen2E = ZERO;
        this.datamap.cell.gloomGen3E = ZERO;
        this.datamap.cell.gloomGen4E = ZERO;
        this.calcGloom();
    }

    doomGain = () => {
        //base
        let doomPerPile = Decimal.add(1, this.crafting.DoomAndGloomFromEQ.BaseDoomGain).add(this.doomUpgrade2.count);
        let pilesOfEnergy = Decimal.floor(this.energyResource.count.divideBy(this.energy.giveUpLevel2Cost))
        let gainedDoom = Decimal.times(doomPerPile, pilesOfEnergy)

        //increased
        const incDoomGain = this.datamap.cell.d5.add(this.datamap.cell.d6).add(this.crafting.DoomAndGloomFromEQ.IncreasedDoomGain);
        
        if (incDoomGain.greaterThan(0)) {
            gainedDoom = gainedDoom.times(incDoomGain.add(1));
        }

        //more

        if (this.datamap.garden.fruits.doom.greaterThan(0)) {
            gainedDoom = gainedDoom.times(this.datamap.garden.fruits.doom.add(1))
        }
        if (this.crafting.DoomAndGloomFromEQ.MoreDoomGain > 0) {
            gainedDoom = gainedDoom.times(this.crafting.DoomAndGloomFromEQ.MoreDoomGain)
        }
        return gainedDoom;
    }
    clearDoom = () => {
        const zero = new Decimal(0)
        this.doom.info.setDecimal(zero);
        this.doomUpgrade1.reset();
        this.doomUpgrade2.reset();
        this.doomUpgrade3.reset();
        this.doomUpgrade4.reset();
        this.doomUpgrade5.reset();
        this.doomUpgrade6.reset();
        this.doomUpgrade7.reset();
        this.doomUpgrade8.reset();

        this.doomResearch.doomJobSpeed.reset();
        this.doomResearch.doomGardenSpeed.reset();

    }
    clearEnergy = () =>{
        this.energyResource.info.setDecimal(new Decimal(0))
        this.antiEnergyResource.info.setDecimal(new Decimal(0))
        this.effort.reset();
        this.drive.reset()
        this.antiDrive.reset();
        this.autoclickerBuilding.reset();
        this.momentum.reset();
        this.calcEnergy();
    }
    

    gUL2: BasicCommand = {
        command: this.energy.giveUpLevel2,
        label: "Give Up, accept Doom",
        hidden: () => this.datamap.unlocksStates.one < 3,
        able: () => this.energyResource.count.greaterThanOrEqualTo(this.energy.giveUpLevel2Cost),
        description: 'wy?'
    }

    //an even worse fate

    aewf = () => {
        if (this.datamap.unlocksStates.two === 2) {
            this.datamap.unlocksStates.two = 3;
        }

        this.datamap.cell.aewf = this.datamap.cell.aewf.add(1);

        this.crafting.reset();
        //this.garden.resetGarden();
        this.jobs.realReset();
        this.clearDoom();
        this.resetGloom()
        this.clearEnergy();


        this.datamap.cell.swimmerNumber = this.datamap.cell.swimmerNumber.add(1);


        this.datamap.cell.gloom = this.initialGloom();

        this.notify();
    }

    initialGloom = () => {
        return this.datamap.cell.aewf.pow(3);
    }

    gUL3: BasicCommand = {
        command: this.aewf,
        label: 'Give Up, accept Gloom',
        hidden: () => this.datamap.jobs.notReset.upgrades.energy < 1 && this.datamap.cell.aewf.eq(0),
        able: ()=> this.datamap.jobs.notReset.upgrades.energy > 0,
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
        description: 'Base Energy Gain\nShift+Click to buy max',
        hidden: () => this.datamap.unlocksStates.one < 1,
        outcome: () => `+1 Base Energy Gain\nCurrent: ${this.energyModule.energyGainBase}`,
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
            { expo: { initial: 2, coefficient: 2 }, resource: this.doom },
        ],
        description: 'Makes clicking better[!/?]',
        hidden: () => this.datamap.unlocksStates.two < 1,
        outcome: () => {
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
            let now = this.doomUpgrade3.count.add(1);
            return `x${now} -> x${now.add(1)} Energy Gain`
        },
    })

    doomUpgrade4: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Cursed Clicking',
            get: () => this.datamap.cell.d4,
            setDecimal: (dec) => {
                this.datamap.cell.d4 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 1e6, coefficient: 1.7 }, resource: this.doom },
        ],
        description: `Provides 1 click worth of energy each second`,
        hidden: () => this.datamap.jobs.notReset.upgrades.doom < 1,
        outcome: () => `+1 Autoclickers`
    })

    doomUpgrade5: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Replicating Doom',
            get: () => this.datamap.cell.d5,
            setDecimal: (dec) => {
                this.datamap.cell.d5 = dec;
            },
        }),
        costs: [
            { expo: { initial: 1e9, coefficient: 1.7 }, resource: this.doom },
        ],
        description: `Increased Doom Gain`,
        hidden: () => this.datamap.jobs.notReset.upgrades.doom < 2,
        outcome: () => '+1x Increased Doom Gain',
    })

    doomUpgrade6: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Gloom & Doom',
            get: () => this.datamap.cell.d6,
            setDecimal: (dec) => {
                this.datamap.cell.d6 = dec
            },
        }),
        costs: [
            { expo: { initial: 1052, coefficient: 1.3 }, resource: this.doom },
            { expo: { initial: 1052, coefficient: 1.3 }, resource: this.gloom },
        ],
        description: `Increased Doom Gain`,
        hidden: () => this.datamap.unlocksStates.two < 3,
        outcome: () => '+1x Increased Doom Gain',
    })

    doomUpgrade7: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'd7',
            get: () => this.datamap.cell.d7,
            setDecimal: (dec) => {
                this.datamap.cell.d7 = dec
            },
        }),
        costs: [
            { expo: { initial: 200, coefficient: 1.3 }, resource: this.doom },
        ],
        description: `d7`,
        hidden: () => this.datamap.jobs.notReset.upgrades.doom < 3,
        outcome: () => 'd7',
    })

    doomUpgrade8: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'd8',
            get: () => this.datamap.cell.d8,
            setDecimal: (dec) => {
                this.datamap.cell.d8 = dec
            },
        }),
        costs: [
            { expo: { initial: 200, coefficient: 1.3 }, resource: this.doom },
        ],
        description: `d8`,
        hidden: () => this.datamap.jobs.notReset.upgrades.doom < 4,
        outcome: () => 'd8',
    })

    gloomGen1: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Gloom Production',
            get: () => this.datamap.cell.gloomGen1,
            setDecimal: (dec) => {
                this.datamap.cell.gloomGen1 = dec
                this.calcGloom();
            },
            calculateGain: ()=>this.datamap.cell.gloomGen2.add(this.datamap.cell.gloomGen2E)
        }),
        costs: [
            { expo: { initial: 1, coefficient: 2 }, resource: this.gloom },
        ],
        description: `Generates Gloom`,
        hidden: () => this.datamap.unlocksStates.two < 3,
        outcome: () => `+${this.datamap.cell.aewf} Gloom Per Second\nExtra: ${this.datamap.cell.gloomGen1E.floor()}`,
    })

    gloomGen2: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Gloom Generator Production',
            get: () => this.datamap.cell.gloomGen2,
            setDecimal: (dec) => {
                this.datamap.cell.gloomGen2 = dec
                this.calcGloom();
            },
        calculateGain: ()=>this.datamap.cell.gloomGen3.add(this.datamap.cell.gloomGen3E)
    }),
        costs: [
            { expo: { initial: 10000, coefficient: 3 }, resource: this.gloom },
        ],
        description: `Generates Gloom Generators`,
        hidden: () => this.datamap.cell.gloomGen1.lessThan(1),
        outcome: () => `+1 Gloom Generator Per Second\nExtra: ${this.datamap.cell.gloomGen2E.floor()}`,
    })

    gloomGen3: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'GG Generator Production',
            get: () => this.datamap.cell.gloomGen3,
            setDecimal: (dec) => {
                this.datamap.cell.gloomGen3 = dec
                this.calcGloom();
            },
        calculateGain: ()=>this.datamap.cell.gloomGen4.add(this.datamap.cell.gloomGen4E)
    }),
        costs: [
            { expo: { initial: 100000000, coefficient: 4 }, resource: this.gloom },
        ],
        description: `Generates Gloom Generator Generators`,
        hidden: () => this.datamap.cell.gloomGen2.lessThan(1),
        outcome: () => `+1 GG Generator Per Second\nExtra: ${this.datamap.cell.gloomGen3E.floor()}`,
    })

    gloomGen4: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'GGG Generator Production',
            get: () => this.datamap.cell.gloomGen4,
            setDecimal: (dec) => {
                this.datamap.cell.gloomGen4 = dec
                this.calcGloom();
            },
        }),
        costs: [
            { expo: { initial: 1000000000000, coefficient: 5 }, resource: this.gloom },
        ],
        description: `Generates Gloom Generator Generator Generators\nExtra: ${this.datamap.cell.gloomGen4E.floor()}`,
        hidden: () => this.datamap.cell.gloomGen3.lessThan(1),
        outcome: () => `+1 GGG Generator Per Second`,
    })

    calcGloom = () => {
        this.gloom.calculate();
        this.gloomGen1.info.building.calculate();
        this.gloomGen2.info.building.calculate();
        this.gloomGen3.info.building.calculate();
        this.gloomGen4.info.building.calculate();
    }


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
        hidden: () => this.datamap.garden.researches.progression < 3,
        outcome: () => {
            let now = this.determination.count.add(1);
            return `x${now} -> x${now.add(1)} Energy Gain`
        },
    })



    doomResearch: DoomResearches = new DoomResearches(this);

    autoclickerBuilding: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Autoclickers',
            get: () => this.datamap.cell.autoclicker,
            setDecimal: (dec) => {
                this.datamap.cell.autoclicker = dec
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
        this.antiEnergyResource.calculate();
        this.energyResource.calculate();
    }


    extraLoad = () => {
        //this.datamap.crafting = CraftingData_Init();
        //console.log('i fixed the bug');
        
        this.crafting.calc();
        //console.log('EXTRALOAD');
        this.calcEnergy();
        this.calcGloom();
        this.antiEnergyResource.calculate();
        this.garden.setTempData();
        this.jobs.setTempData();
    }
  
    clearPopup = () => {
        this.datamap.popupUI = 0;
        this.notify();
    }

}

