import Decimal from "break_infinity.js";
import Engine from "./Engine";
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
            { resource: this.engine.doom, count: new Decimal(5) },
        ]
    })
}


export interface DoomResearchData {
    autoclicker: boolean;
}

export function DoomResearchData_Init(): DoomResearchData {
    return {
        autoclicker: false,
    }
}