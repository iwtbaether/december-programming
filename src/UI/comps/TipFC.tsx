import { relative } from "path"
import React from "react"
import './TipFC.scss'

const TipFC: React.FC<{ tip?: React.ReactNode }> = (props) => {
    if (props.tip === undefined) return null
    return (
        <div className='TipFC'>
            {props.tip}{props.children}
        </div>
    )

}

export const TipFC2: React.FC<{}> = (props) => {
    return (
        <div style={{position:'relative'}}>
        <div className='TipFC2'>
            {props.children}
        </div>
        </div>
    )

}

export default TipFC;


export const ChildTip: React.FC<{}> = (props) => {
    return (
        <span style={{position:'relative'}}>

        <div className='TipFC2'>
            {props.children}
        </div>
        </span>
    )

}