import Decimal from "break_infinity.js";
import { Datamap } from "../Datamap";
import Engine from "../Engine";

export default class Garden {
    constructor(public engine: Engine) {

    }
    
 }

enum SeedType {
    hope,
}

interface GardenSeed {
    type: SeedType;
    count: number;
}

interface GardenPlant {
    seed: GardenSeed;
    plantTimer: number;
}

export interface GardenData {
    seedTimer: number;
    seeds: Decimal;
    bagSlot1: GardenSeed | null;
    bagSlot2: GardenSeed | null;
    bagSlot3: GardenSeed | null;
    gardenSlot1: GardenPlant | null;
    gardenSlot2: GardenPlant | null;
    gardenSlot3: GardenPlant | null;
    gardenSlot4: GardenPlant | null;
    gardenSlot5: GardenPlant | null;
    gardenSlot6: GardenPlant | null;
    gardenSlot7: GardenPlant | null;
    gardenSlot8: GardenPlant | null;
    gardenSlot9: GardenPlant | null;
}

export function GardenData_Init (): GardenData {
    const ZERO = new Decimal(0);
    return {
        seedTimer: 0,
        seeds: ZERO,
        bagSlot1: null,
        bagSlot2: null,
        bagSlot3: null,
        gardenSlot1: null,        
        gardenSlot2: null,        
        gardenSlot3: null,        
        gardenSlot4: null,        
        gardenSlot5: null,        
        gardenSlot6: null,        
        gardenSlot7: null,        
        gardenSlot8: null,        
        gardenSlot9: null,        
    }
}

export function GardenData_SetDecimals (data:Datamap) {

}
