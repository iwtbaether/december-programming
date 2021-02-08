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
}

const ProgressBar: React.FC <ProgressBarProps> = (props) => {
    const widthPercent = Decimal.div(props.current,props.max).times(100).toNumber().toFixed(0).toString() + "%";
    
    return (
        <div style={{backgroundColor:props.bg, border:'1px solid'}} className='base2-text'>
            <div style={{width:widthPercent, backgroundColor:props.color, whiteSpace:'nowrap', textAlign:'left', paddingLeft:'2px'}} className={props.className}>
                {props.children} {widthPercent}
            </div>
        </div>
    )
}

export default ProgressBar;