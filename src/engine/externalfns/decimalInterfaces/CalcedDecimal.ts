import Decimal from "break_infinity.js";

export default class CalcedDecimal {
    constructor(
        private calc: ()=>Decimal,
    ){
        this.current = this.calc();
        //this.set(); must set in constructor
    }

    set = () => {
        this.current = this.calc();
    }

    current: Decimal;
}