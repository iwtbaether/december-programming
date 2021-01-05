import Engine from "./Engine";
import { ItemData, ModData } from "./m_st/Crafting";

export default class Achievements {
    constructor (public engine: Engine) {

    }

    get data () {
        return this.engine.datamap.achievments;
    }

    check = (a_name: a_names) => {
        switch (a_name) {
            case a_names.hundredResets:
                if (!this.data.hundredResets) {
                    if (this.engine.datamap.cell.swimmerNumber.greaterThan(100)) {
                        this.data.hundredResets = true;
                    }
                }
                break;
        
            default:
                break;
        }
    }
}

export enum a_names {
    hundredResets
}

interface MedalOfHonor extends ItemData {
    mods: MedalOfHonorMod[]
}

interface MedalOfHonorMod extends ModData {
    mod: MedalOfHonorModList
}

enum MedalOfHonorModList {
    energy, doom, job, seed
}

export interface Achievements_Data {
    hundredResets: boolean,
}

export function Achievements_Data_Init (): Achievements_Data {
    return {
        hundredResets: false,
    }
}
