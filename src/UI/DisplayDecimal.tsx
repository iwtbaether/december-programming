import Decimal from "break_infinity.js"
import React from "react"


const DisplayDecimal: React.FC<{decimal: Decimal}> = (props) => (
    <span>

        {props.decimal.toFixed(2)}
    </span>
)

export default DisplayDecimal;

;