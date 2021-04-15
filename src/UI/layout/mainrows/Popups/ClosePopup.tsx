import { gEngine } from "../../../.."


const ClosePopup = (props: {}) => {
    return (<button onClick={gEngine.clearPopup}>Close</button>)
}

export const OpenPopup = (props: {open: number, label: string}) => {
    return (<button onClick={()=>{gEngine.setPopup(props.open)}}>{props.label}</button>)
    
}

export default ClosePopup