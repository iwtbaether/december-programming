import { relative } from "path"
import React from "react"
import './TipFC.scss'

const FlexColumn: React.FC <{ }> = (props) => {
    return (
        <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
            {props.children}
        </div>
    )
}

export default FlexColumn;