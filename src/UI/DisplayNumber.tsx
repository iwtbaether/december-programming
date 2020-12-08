import Decimal from "break_infinity.js"
import React from "react"
import { formatNumber } from "../engine/externalfns/util";


const DisplayNumber: React.FC<{num: number, name? :string}> = (props) => (
    <span style={{display:"flex",flexDirection:'row'}}>
        {props.name && <span style={{flexBasis:'200px'}}>{props.name}</span>}
        {formatNumber(props.num)}
    </span>
)

export default DisplayNumber;