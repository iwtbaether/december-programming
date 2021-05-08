import Decimal, { DecimalSource } from "break_infinity.js"
import { relative } from "path"
import React, { ReactNode } from "react"
import DisplayDecimal from "../DisplayDecimal"
import './TipFC.scss'

export interface ProgressBarProps {
    ETAs: DecimalSource;
}

const CalETA: React.FC <ProgressBarProps> = (props) => {
    let ETA_second = new Decimal(props.ETAs);
    if (ETA_second.lessThan(0)) return null;
    if (ETA_second.lt(60)) return <span><DisplayDecimal decimal={ETA_second}/> seconds</span>
    else if (ETA_second.lt(60 * 60)) return <span><DisplayDecimal decimal={ETA_second.div(60)}/> minutes</span>
    else if (ETA_second.lt(60 * 60 * 24)) return <span><DisplayDecimal decimal={ETA_second.div(60 * 60)}/> hours</span>
    else if (ETA_second.lt(60 * 60 * 24 * 7)) return <span><DisplayDecimal decimal={ETA_second.div(60 * 60 * 24)}/> days</span>
    else if (ETA_second.lt(60 * 60 * 24 * 7 * 4.3)) return <span><DisplayDecimal decimal={ETA_second.div(60 * 60 * 24 * 7)}/> weeks</span>
    else if (ETA_second.lt(60 * 60 * 24 * 7 * 52 )) return <span><DisplayDecimal decimal={ETA_second.div(60 * 60 * 24 * 7 * 4.3)}/> months</span>
    else if (true) return <span><DisplayDecimal decimal={ETA_second.div(60 * 60 * 24 * 7 * 52)}/> years</span>

    return (
        <div>
            <DisplayDecimal decimal={ETA_second}/>
        </div>
    )
}


export default CalETA;