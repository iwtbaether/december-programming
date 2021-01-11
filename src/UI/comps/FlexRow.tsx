import { relative } from "path"
import React from "react"
import './TipFC.scss'

const FlexRow: React.FC <{ }> = (props) => {
    return (
        <div style={{display:'flex',flexDirection:'row',gap:'5px'}}>
            {props.children}
        </div>
    )
}

export default FlexRow;