import Engine from "../Engine";

export default class Magic {

    constructor (private engine: Engine) {

    }

    get data (): Magic_Data {
        return this.engine.datamap.magic;
    }

}

export interface Magic_Data {

}

export function Magic_Data_Init (): Magic_Data {
    return {

    }
}