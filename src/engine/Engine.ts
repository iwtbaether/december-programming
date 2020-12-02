import Decimal from "break_infinity.js";
import _ from "lodash";
import { BasicCommand } from "../UI/comps/BasicCommand";
import DisplayDecimal from "../UI/DisplayDecimal";
import CoreEngine from "./CoreEngine";
import EnergyModule from "./EnergyModule";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import Research from "./Research";


export const AUTOSAVE_INTERVAL = 1000 * 60;

export default class Engine extends CoreEngine {

    energyModule: EnergyModule = new EnergyModule(this);
    research: Research = new Research(this);
    processDelta = (delta: number) => {


        if (delta < 0) delta = 0;

        const deltaS = delta / 1000;

        this.energyResource.gainResource(this.energyResource.gainPS.times(deltaS))


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

    energyGainClickBase = () => {
        return this.effort.count.add(1).minus(this.doomUpgrade1.count);
    }

    energyGainPerSecondBase = (): Decimal => {
        return this.effort.count;
    }

    energyGainFromActivityBase = () => {
        return this.effort.count.add(1);
    }

    energyGainMult = () => {
        return this.drive.count.add(1)
    }


    energyResource = new SingleResource({
        name: 'Energy',
        get: () => this.datamap.cell.a,
        setDecimal: (decimal) => {
            this.datamap.cell.a = decimal
        },
        calculateGain: () => {
            const mult: Decimal = this.energyGainMult();
            let base = this.energyGainPerSecondBase();
            if (this.datamap.activity === 1) base = base.add(this.energyGainFromActivityBase());
            return base.times(mult)
        }
    })

    antiEnergyResource = new SingleResource({
        name: 'Anti Energy',
        get: () => this.datamap.cell.aa,
        setDecimal: (decimal) => {
            this.datamap.cell.aa = decimal
        },
        calculateCap: ()=>this.datamap.cell.doom
    })

    doom: SingleResource = new SingleResource({
        name: 'Doom',
        get: () => this.datamap.cell.doom,
        setDecimal: (d) => {
            this.datamap.cell.doom = d;
            this.antiEnergyResource.calculate();
        }
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
        description: '+1x Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 2,
        outcome: () => 'Even more Energy!',
    })

    setNav = (num: number) => {
        this.datamap.nav = num;
        this.notify();
    }

    energy = {
        gatherEnergy: () => {
            const gain = Decimal.times(this.energyGainClickBase(), this.energyGainMult())
            if (gain.greaterThanOrEqualTo(0)) {
                this.energyResource.gainResource(
                    Decimal.times(this.energyGainClickBase(), this.energyGainMult())
                )
            } else {
                this.antiEnergyResource.gainResource(gain.negate())
                if (this.datamap.unlocksStates.two === 1) {
                    this.datamap.unlocksStates.two = 2;
                }
            }
            this.notify();
        },
        unlockGoal: () => {
            return 100 * Math.pow(100, this.datamap.unlocksStates.one)
        },
        canGiveUp: () => {
            return this.datamap.cell.a.greaterThanOrEqualTo(this.energy.unlockGoal())
        },
        giveUp: () => {
            if (this.energy.canGiveUp()) {
                this.clearEnergyDown();
                this.datamap.unlocksStates.one++;
                this.calcEnergy();
                this.notify();
            }
        },
        giveUpLevel2Cost: 100000,
        giveUpLevel2: () => {
            console.log('gul2');
            
            if (this.energyResource.count.greaterThanOrEqualTo(this.energy.giveUpLevel2Cost)) {
                const gainedDoom = this.doomGain();
                this.doom.gainResource(gainedDoom);
                if (this.datamap.unlocksStates.two === 0) {
                    this.datamap.unlocksStates.two = 1
                }
                this.clearEnergyDown();
                this.calcEnergy();
                this.notify();
            }
        },


    }

    doomGain = () => {
        let gainedDoom = Decimal.floor(this.energyResource.count.divideBy(this.energy.giveUpLevel2Cost))
        gainedDoom = gainedDoom.add(gainedDoom.times(this.doomUpgrade2.count));
        return gainedDoom;
    }
    clearEnergyDown = () =>{
        this.energyResource.info.setDecimal(new Decimal(0))
        this.effort.info.building.info.setDecimal(new Decimal(0))
        this.drive.info.building.info.setDecimal(new Decimal(0))
    }
    

    gUL2: BasicCommand = {
        command: this.energy.giveUpLevel2,
        label: "Give up, accept doom",
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
        description: '+1 Energy Gain',
        hidden: () => this.datamap.unlocksStates.one < 1,
        outcome: () => 'More Energy!',
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
            { expo: { initial: 10, coefficient: 2 }, resource: this.doom },
        ],
        description: '-1 Base Energy Gain from Clicking',
        hidden: () => this.datamap.unlocksStates.two < 1,
        outcome: () => {
            const now = this.datamap.cell.d1;
            return `Current: ${this.energyGainClickBase()}`
        },
    })

    doomUpgrade2: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Anti Doom',
            get: () => this.datamap.cell.d2,
            setDecimal: (dec) => {
                this.datamap.cell.d2 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 5, coefficient: 1.2 }, resource: this.doom },
            { expo: { initial: 4, coefficient: 2 }, resource: this.antiEnergyResource },
        ],
        description: '+1 Base Doom Gain',
        hidden: () => this.datamap.unlocksStates.two < 2,
        outcome: () => {
            return ``
        },
    })


    calcEnergy = () => {
        this.energyResource.calculate();
    }

    extraLoad = () => {
        console.log('EXTRALOAD');
        this.calcEnergy();
        this.antiEnergyResource.calculate();
    }

}

