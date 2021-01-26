import { relative } from "path"
import React from "react"
import './TipFC.scss'

const FlexRow: React.FC <{ }> = (props) => {
    return (
        <div style={{display:'flex',flexDirection:'row',gap:'5px',flexWrap:'wrap', alignContent: 'flex-start'}}>
            {props.children}
        </div>
    )
}

export default FlexRow;