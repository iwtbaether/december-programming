import Decimal from "break_infinity.js";
import _ from "lodash";
import { BasicCommand } from "../UI/comps/BasicCommand";
import DisplayDecimal from "../UI/DisplayDecimal";
import CoreEngine from "./CoreEngine";
import EnergyModule from "./EnergyModule";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";


export const AUTOSAVE_INTERVAL = 1000 * 60;

export default class Engine extends CoreEngine {

    energyModule: EnergyModule = new EnergyModule(this);
    startup: boolean = true;
    processDelta = (delta: number) => {

        if (this.startup) {
            this.startup = false;
            this.calcEnergy();
        }

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
        return this.effort.count.add(1);
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
        setDecimal: (decimal) => this.datamap.cell.a = decimal,
        calculateGain: () => {
            const mult: Decimal = this.energyGainMult();
            let base = this.energyGainPerSecondBase();
            if (this.datamap.activity === 1) base = base.add(this.energyGainFromActivityBase());
            return base.times(mult)
        }
    })
    doom: SingleResource = new SingleResource({
        name: 'Doom',
        get: () => this.datamap.cell.doom,
        setDecimal: (d) => this.datamap.cell.doom = d,
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
            this.energyResource.gainResource(
                Decimal.times(this.energyGainClickBase(), this.energyGainMult())
            )
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
        const gainedDoom = Decimal.floor(this.energyResource.count.divideBy(this.energy.giveUpLevel2Cost))
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
            name: 'Doomed Energy',
            get: () => this.datamap.cell.d1,
            setDecimal: (dec) => {
                this.datamap.cell.d1 = dec
                this.calcEnergy();
            },
        }),
        costs: [
            { expo: { initial: 10, coefficient: 2 }, resource: this.doom },
        ],
        description: '+x1 Energy Gain',
        hidden: () => this.datamap.unlocksStates.two < 1,
        outcome: () => {
            const now = this.datamap.cell.d1.add(1);
            return `${now.toString()}x -> ${now.add(1).toString()}x`
        },
    })


    calcEnergy = () => {
        this.energyResource.calculate();
    }

    extraLoad = () => {
        //console.log('EXTRALOAD');
        //this.calcEnergy();

    }

}

