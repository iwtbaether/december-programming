import ExpoCurve, { expoI_getCost, expoI_maxBuyAmount, expoI_buyNCost } from "./ExpoCurve";


import Decimal, { DecimalSource } from "break_infinity.js";
import { Datamap } from "../../Datamap";



export default interface Decimal_ExpoCommand {
    expo: ExpoCurve,
    countFns: CountFns;
    currencyFns: CurrencyFns;
    
    //command: DecoupledCommand2,
    name: string;


    hidden?: (data: Datamap) => boolean;
    change?: string;
    img?: string;
    tip?: string;
}

export interface CountFns {
    get: (data: Datamap) => Decimal;
    gain: (data: Datamap, ammount: DecimalSource) => void;
}

export interface CurrencyFns {
    get: (data: Datamap) => Decimal;
    spend: (data: Datamap, ammount: Decimal) => void;
    name: string;
}

export function expoCommand_buy(data: Datamap, expoCommand: Decimal_ExpoCommand) {
    //console.log(data, expoCommand);
    
    if (expoCommand_Able(data, expoCommand) === false) {
        //console.log('unable');
        //let have = expoCommand.currencyFns.get(data);
        //let cost = expoCommand_Cost(data, expoCommand);
        //console.log(have, cost);
        
        return; }
    else {
        //console.log('able');
        expoCommand.currencyFns.spend(data, expoCommand_Cost(data, expoCommand));
        expoCommand.countFns.gain(data, 1);
    }
}

export function expoCommand_Cost(data: Datamap, expoCommand: Decimal_ExpoCommand) {
    return expoI_getCost(expoCommand.expo, expoCommand.countFns.get(data))
}

export function expoCommand_Able(data: Datamap, ep: Decimal_ExpoCommand) {
    return expoCommand_Cost(data, ep).lessThanOrEqualTo(ep.currencyFns.get(data));
}

export function expoCommand_maxAmmount(data: Datamap, ep: Decimal_ExpoCommand) {
    return expoI_maxBuyAmount(ep.expo, ep.countFns.get(data), ep.currencyFns.get(data));
}
export function expoCommand_maxCost(data: Datamap, ep: Decimal_ExpoCommand) {
    let ammount = expoCommand_maxAmmount(data, ep);
    return expoI_buyNCost(ep.expo, ep.countFns.get(data), ammount);
}

export function expoCommand_buyMax(data: Datamap, ep: Decimal_ExpoCommand) {
    let ammount = expoCommand_maxAmmount(data,ep);
    let cost = expoCommand_maxCost(data,ep)

        if (ep.currencyFns.get(data).greaterThanOrEqualTo(cost)) {
            ep.currencyFns.spend(data, cost );
            ep.countFns.gain(data, ammount);
        }
}

