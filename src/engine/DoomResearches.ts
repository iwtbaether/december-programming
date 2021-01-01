import Decimal from "break_infinity.js";
import Engine from "./Engine";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import { SingleResearch } from "./Research";

export default class DoomResearches {
        constructor(public engine: Engine) {

    }

    get data() {
        return this.engine.datamap.doomResearch
    }

    getCompleted = (): SingleResearch[] => {
        let rlist: SingleResearch[] = [];
        return rlist;
    }

    getAvailable = (): SingleResearch[] => {
        let rlist: SingleResearch[] = [];
        return rlist;
    }

    autoclicker_sr: SingleResearch = new SingleResearch({
        name: "Unlock Autoclickers",
        hidden: () => false,
        description: "Autclickers click...",
        get: () => this.data.autoclicker,
        makeTrue: () => {
            this.data.autoclicker = true
        },
        costs: [
            { resource: this.engine.doom, count: new Decimal(100000) },
        ]
    })

    gloomShard: SingleResearch = new SingleResearch({
        name: "Unlock Gloom Shard",
        hidden: () => this.engine.datamap.cell.gloomGen1.eq(0) && this.data.gloomShard === false,
        description: "Create a doom shard when you clear a craft",
        get: () => this.data.gloomShard,
        makeTrue: () => {
            this.data.gloomShard = true
        },
        costs: [
            { resource: this.engine.doom, count: new Decimal(1e7) },
            { resource: this.engine.gloom, count: new Decimal(1e7) },
        ]
    })

    doomGardenSpeed: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Doomed Garden',
            get: () => this.engine.datamap.cell.doomGardenSpeed,
            setDecimal: (dec) => {
                this.engine.datamap.cell.doomGardenSpeed = dec
                this.engine.garden.setGardenSpeedMulti();
            },
        }),
        costs: [
            { expo: { initial: 100, coefficient: 10 }, resource: this.engine.doom },
        ],
        description: `10% Increased Garden Speed`,
        hidden: () => this.engine.datamap.unlocksStates.one < 5,
        outcome: () => {
            let now = this.engine.datamap.cell.doomGardenSpeed;
            return `Current: ${now.times(10).floor()}% Increased Garden Speed`
        },
    })

    doomJobSpeed: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Doomed Job',
            get: () => this.engine.datamap.cell.doomJobSpeed,
            setDecimal: (dec) => {
                this.engine.datamap.cell.doomJobSpeed = dec
                this.engine.jobs.calcJobSpeed();
            },
        }),
        costs: [
            { expo: { initial: 1.5e4, coefficient: 5 }, resource: this.engine.doom },
        ],
        description: `10% Increased Job Speed`,
        hidden: () => this.engine.datamap.unlocksStates.one < 6,
        outcome: () => {
            let now = this.engine.datamap.cell.doomJobSpeed;
            return `Current: ${now.times(10).floor()}% Increased Job Speed`
        },
    })

    
}


export interface DoomResearchData {
    autoclicker: boolean;
    gloomShard: boolean;
    purpose: boolean; //unlocks jobs! first job is swimming
}

export function DoomResearchData_Init(): DoomResearchData {
    return {
        autoclicker: false,
        purpose: false,
        gloomShard: false,
    }
}