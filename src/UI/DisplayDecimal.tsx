import Decimal from "break_infinity.js"
import React from "react"

import * as ADNotations from '../engine/externalfns/ad-notations.esm';
const SCIENNOT = new ADNotations.MixedScientificNotation();


const DisplayDecimal: React.FC<{decimal: Decimal}> = (props) => (
    <span>
        {props.children}{SCIENNOT.formatDecimal(props.decimal,2)}
    </span>
)
//{props.decimal.toFixed(2)}

export default DisplayDecimal;
