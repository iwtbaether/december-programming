import Decimal from "break_infinity.js"
import React from "react"

import * as ADNotations from '../engine/externalfns/ad-notations.esm';
const SCIENNOT = new ADNotations.MixedScientificNotation();


const DisplayDecimal: React.FC<{decimal: Decimal}> = (props) => (
    <span className='DisplayDecimal'>
        
        {props.children}
        {props.decimal.abs().greaterThanOrEqualTo(1) && SCIENNOT.formatDecimal(props.decimal,2)}
        {props.decimal.abs().lessThan(1) && props.decimal.toFixed(3)}
    </span>
)
//{props.decimal.toFixed(2)}

export default DisplayDecimal;

export function DecimalToString (decimal: Decimal): string {
    let str = decimal.abs().greaterThan(1)?
        SCIENNOT.formatDecimal(decimal,2) :
        decimal.toFixed(3)

    return str;
}