import Decimal from "break_infinity.js";
import { GardenData, GardenData_Init, GardenData_SetDecimals } from "./garden/Garden";

export interface Datamap {
    //core data
    autosave: boolean;
    autosaveCounter: number;
    last: number;
    nav: number,
    activity: number,

    testDec: Decimal;
    cell: I_HoldDecimals;
    unlocksStates: {
        one: number,
        two: number,
        three: number,
        four: number,
        five: number,
    };
    garden: GardenData;
}

export function newDefaultMap () {
    let map: Datamap = {
        autosave: false,
        autosaveCounter: 0,
        activity: 0,
        last: Date.now(),
        nav: 0,
        cell: {
            a: ZERO,
            aa: ZERO,
            b: ZERO,
            c: ZERO,
            cc: ZERO,
            d1: ZERO,
            d2: ZERO,
            d3: ZERO,
            doom: ZERO,
            gloom: ZERO,
            zoom: ZERO,
            swimmerNumber: new Decimal(1),
        },
        unlocksStates: {
            five: 0,
            four: 0,
            one: 0,
            three: 0,
            two: 0,
        },



        testDec: new Decimal(0),
        garden: GardenData_Init(),
    }
    return map;
}

interface I_HoldDecimals {
        a: Decimal,
        aa: Decimal,
        b: Decimal, 
        c: Decimal,
        cc: Decimal,
    doom: Decimal,
    gloom: Decimal,
    zoom: Decimal,
        d1: Decimal,
        d2: Decimal,
        d3: Decimal,
        swimmerNumber: Decimal,
    [key: string]: Decimal
}


export function setDecimals (data: Datamap) {
    data.testDec = new Decimal(data.testDec);

    Object.keys(data.cell).forEach(key => {
        data.cell[key] = new Decimal(data.cell[key])
    });
    
    GardenData_SetDecimals(data);
    //data.whateverdecimal = new Decimal(whateverdecimal)
}

const ZERO = new Decimal(0);