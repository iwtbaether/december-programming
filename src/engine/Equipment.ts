import Engine from "./Engine";

export default class Equipment {
    constructor(public engine: Engine) {

    }
}

interface PoEMod {
    name: string,
    description: (value: number) => string,
    
}

/** POE Style Equipment, essentially infnite currency, cool?
 *  #1 DOOM STONES!!!! 
 * _____ DOOM STONE OF _____
 * Prefixes
 *      + Flat Doom Gain
 *      Doom Per Second
 *      - Base Energy Gain From Clicking
 * Suffixes
 *      x Doom Gain Mult
 *      Anti Energy per second
 *      
 *       
 * 
 * 
 * 
 */