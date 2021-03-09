import Decimal, { DecimalSource } from "break_infinity.js"
import { relative } from "path"
import React, { ReactNode } from "react"
import './TipFC.scss'

export interface ProgressBarProps {
    current: DecimalSource;
    max: DecimalSource;
    color: string;
    bg: string;
    className?: string
    hideP?: boolean
}

const ProgressBar: React.FC <ProgressBarProps> = (props) => {
    let widthPercent = Decimal.div(props.current,props.max).times(100);
    let widthPercentStr = Decimal.clamp(widthPercent, 0, 100).toNumber().toFixed(0).toString() + "%";

    return (
        <div style={{backgroundColor:props.bg}} className='pb-text'>
            <div style={{width:widthPercentStr, backgroundColor:props.color, whiteSpace:'nowrap', textAlign:'left', paddingLeft:'2px'}} className={props.className}>
                {props.children} {!props.hideP && <span>{widthPercentStr}</span>}
            </div>
        </div>
    )
}

export default ProgressBar;