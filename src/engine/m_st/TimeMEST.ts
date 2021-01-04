import { gEngine } from "../..";
import Engine from "../Engine";

export default class TimeMEST {
    constructor(public engine: Engine) {

    }
}

export function isTimeUnlocked (): boolean {
    return gEngine.datamap.unlocksStates.one >= 8;
}