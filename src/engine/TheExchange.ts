import Engine from "./Engine";

export default class TheExchange {
    constructor (public engine: Engine ){

    }

    get data (): TheExchange_Data {
        return this.engine.datamap.theExchange
    }

    get currency () {
        return this.engine.datamap.crafting.currency;
    }

    sellTrans = () => {
        if (this.currency.transmutes < CEX.CEX_transToCopper) return;
        this.currency.chaos ++;
        this.currency.transmutes -= CEX.CEX_transToCopper;
        this.engine.notify();
    }

    buyTrans = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.transmutes += CEX.CEX_transToCopper - 1;
        }
        this.engine.notify();
    }

    sellAug = () => {
        if (this.currency.augmentations < CEX.CEX_augToCopper) return;
        this.currency.chaos ++;
        this.currency.augmentations -= CEX.CEX_augToCopper;
        this.engine.notify();
    }
    buyAug = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.augmentations += CEX.CEX_augToCopper - 1;
        }
        this.engine.notify();
    }

    sellDoom = () => {
        if (this.currency.doomOrbs < CEX.CEX_doomToCopper) return;
        this.currency.chaos ++;
        this.currency.doomOrbs -= CEX.CEX_doomToCopper;
        this.engine.notify();
    }
    buyDoom = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.doomOrbs += CEX.CEX_doomToCopper;
        }
        this.engine.notify();
    }

}

export interface TheExchange_Data {

}

export function TheExchange_Data_Init (): TheExchange_Data {
    return {}
}

const CEX_transToCopper = 4
const CEX_augToCopper = 15
const CEX_doomToCopper = 1

export const CEX = {
    CEX_augToCopper, CEX_transToCopper, CEX_doomToCopper
}