import { relative } from "path"
import React from "react"
import { canCheat } from "../../engine/externalfns/util"
import './TipFC.scss'

const CheatDiv: React.FC <{ }> = (props) => {
    if (!canCheat) return null;
    
    return (
        <div style={{backgroundColor:'red'}}>
            {props.children}
        </div>
    )
}

export default CheatDiv;