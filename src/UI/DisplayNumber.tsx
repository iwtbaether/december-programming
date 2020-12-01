import Decimal from "break_infinity.js"
import React from "react"
import { formatNumber } from "../engine/externalfns/util";


const DisplayNumber: React.FC<{num: number}> = (props) => (
    <span>
        {formatNumber(props.num)}
    </span>
)

export default DisplayNumber;