import Decimal, { DecimalSource } from "break_infinity.js";

export default interface ExpoCurve {
    coefficient: number,
    initial: DecimalSource,
}

export function expoI_getCost(expo: ExpoCurve, owned:Decimal) {

    
    return Decimal.mul(expo.initial, Decimal.pow(expo.coefficient, owned))

    //Math.floor(expo.initial*Math.pow(expo.coefficient,owned))
}

export function expoI_maxBuyAmount (expo: ExpoCurve, owned:Decimal, currency: Decimal) {
    let b = expo.initial;
    let r = expo.coefficient;
    let k = owned
    let c = currency

    let dlogresult = Decimal.log(Decimal.add(1, Decimal.div(Decimal.mul(c,(r-1)),Decimal.mul(b,Decimal.pow(r, k)))) ,r)
    //let logresult = Math.log(1+((c*(r - 1))/(b*Math.pow(r, k))))
    //let logchange = logresult / Math.log(r);
    let result = Decimal.floor(dlogresult)

    return result;
}  

export function expoI_maxBuyCost (expo: ExpoCurve, owned:Decimal, currency: Decimal) {

    let n = expoI_maxBuyAmount(expo, owned, currency);
    
    return expoI_buyNCost(expo, owned, n)
}

export function expoI_buyNCost (expo: ExpoCurve, owned: Decimal, n: Decimal) {
    let b = expo.initial;
    let r = expo.coefficient;
    let k = owned
    
    let dec_result = Decimal.mul(b, Decimal.div(Decimal.mul(Decimal.pow(r,k),Decimal.pow(r,n).minus(1)),(r-1)) )
    //let old = Math.floor( b * (Math.pow(r,k)*(Math.pow(r,n)-1)) / (r - 1) )

    return dec_result
}

/* No mod in decimal!!
export function expoI_buyNextCost (expo: ExpoCurve, owned: Decimal, next: number) {
    let k = owned;
    let deci_n = next.minus(Decimal.mo)
    //let n = next - k % next;

    return expoI_buyNCost(expo, owned, n)
}*/

export interface ExpoObject {
    [key:string]:ExpoCurve,
}