import Decimal from "break_infinity.js";
import { Datamap } from "./Datamap";
import Engine from "./Engine";

export default class Radiation {
    constructor (public engine: Engine) {

    }
}

export interface Radiation_Data {
    x1: Decimal;
    x2: Decimal;
    x3: Decimal;
    x4: Decimal;
    x5: Decimal;
}

export function Radiation_Data_Init ():Radiation_Data {
    let rd: Radiation_Data = {
        x1: new Decimal(0),
        x2: new Decimal(0),
        x3: new Decimal(0),
        x4: new Decimal(0),
        x5: new Decimal(0),
    }

    return rd;
}

export function Radiation_Data_SetDecimals (data: Datamap) {
    
}