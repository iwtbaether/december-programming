import Decimal, { DecimalSource } from "break_infinity.js";

export class SingleResource {

    gainPS: Decimal = new Decimal(0);
    cap: Decimal;
    constructor(public info: ResourceInfo) {
        //this.calculate();
        //this.gainPS = info.calculateGain?info.calculateGain():new Decimal(0);
        this.cap = info.calculateCap?info.calculateCap():new Decimal(Infinity);
        if (this.info.get().greaterThan(this.cap)) {
            this.info.setDecimal(this.cap)
        }
    }

    get count () {
        return this.info.get();
    }

    gainResource = (amount: DecimalSource) => {
        this.info.setDecimal(
            Decimal.min(this.cap, this.info.get().add(amount))
        );
    };

    loseResource = (amount: DecimalSource) => {
        this.info.setDecimal(
            this.info.get().minus(amount)
        );
    };

    calculate = () => {
        if (this.info.calculateCap) this.cap = this.info.calculateCap();
        if (this.info.calculateGain) this.gainPS = this.info.calculateGain();
        if (this.count.greaterThan(this.cap)) {
            //console.log('count over cap');
            
            this.info.setDecimal(this.cap)
        }
    };

}

export interface ResourceInfo {
    get: ()=>Decimal,
    setDecimal: (decimal:Decimal)=>void,
    calculateCap?: ()=>Decimal,
    calculateGain?: ()=>Decimal,
    name?: string,
    key?: string,
}
