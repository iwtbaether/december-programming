import Decimal from "break_infinity.js";
import React, { CSSProperties, ReactNode } from "react";
import { gEngine } from "..";
import { SingleBuilding } from "../engine/externalfns/decimalInterfaces/SingleBuilding";
import TipFC from "./comps/TipFC";
import DisplayDecimal from "./DisplayDecimal";

interface CompProps {}
interface CompState {}
export default class BuildingsUI extends React.Component<CompProps, CompState> {
    
    render () {
        return ( <div>
   
                </div>)

    }

}

export class SingleBuildingUI extends React.Component<{building: SingleBuilding, hotkey? :string}, {open: boolean}> {

    constructor(props:any){
        super(props)
        this.state = {
            open: false
        }
    }

    _handleKeyDown = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === this.props.hotkey) this.props.building.buy();
    }

    componentDidMount () {
        document.addEventListener("keydown", this._handleKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener("keydown", this._handleKeyDown);
    }
    /*
    componentDidMount =()=> {
        let ref: React.RefObject<SingleBuildingUI> = React.createRef()
        ReactDOM.findDOMNode(ref.current)?.addEventListener('mouseover',this.over)
        ReactDOM.findDOMNode(ref.current)?.addEventListener('mouseleave',this.leave)
    }

    componentWillUnmount=()=> {
        let ref: React.RefObject<SingleBuildingUI> = React.createRef()
        ReactDOM.findDOMNode(ref.current)?.removeEventListener('mouseover',this.over)
        ReactDOM.findDOMNode(ref.current)?.removeEventListener('mouseleave',this.leave)    
    }*/

    over = () => {
        //console.log('over');
        
        this.setState({open:true})
    }

    classNames = ['CostAble','CostUnable','CostCapped']

    getTip () {

        const building = this.props.building;
        
        return (<div>
                {building.info.description}
                <hr/>
                {building.getCosts().map((cost_and_name,index)=>{
                    let cn = 0;
                    if (cost_and_name.can === false) cn = 1;
                    if (cost_and_name.capped === true) cn = 2;
                    return (
                    <span key={`tooltip${cost_and_name.name}cost`} className={this.classNames[cn]}>
                {cost_and_name.name} : <DisplayDecimal decimal={cost_and_name.cost} />
                    <br/></span>)
                })}
                <hr/>
                {building.info.outcome()}
            </div>)

    }

    leave = () => {
        //console.log('out');
        
        this.setState({open:false})
    }

    buy = (ev: React.MouseEvent) => {
        if (ev.shiftKey) {
            this.props.building.buyMaxMaybe();
        } else if (ev.ctrlKey) {
            this.props.building.buyN(new Decimal(10))
        } else if (ev.altKey) { 
            this.props.building.buyN(new Decimal(25))
        } else this.props.building.buy();
        gEngine.notify();
    }


    render () {
        
        const building = this.props.building;
        if (building.info.hidden()) return null;
        const tipDiv = this.state.open;

        const stylelist2 = ['disabled-button', 'active-button', 'capped-button'];
        const bcb = building.canBuy() //0 = no, 1= yes, 2 = capped
        let style2 = stylelist2[bcb];
        if (building.info.active) {
            style2 += ' middle-button'
        }

        //const style = (building.canBuy())? CSSSTYLES.activeButton: CSSSTYLES.disabledButton;
       
    return (
        <span style={{position:'relative'}}>
            {building.info.active && <button className={'base-button left-button red-text'} onClick={building.activeDOWN}>{building.activeDISABLED()?.toNumber()}</button>}
            <TipFC tip={this.getTip()}/>
       <button className={style2} onClick={this.buy} disabled={bcb !== 1}>
    {building.info.building.info.name} <span className='comment-text'>({building.count.toNumber()})</span>
        </button>

            {building.info.active && <button className={'base-button right-button green-text'} onClick={building.activeUP}>{building.activeABLED()?.toNumber()}</button>}
        </span>
        )

    }
}


const BTStyle: React.CSSProperties = {
    border: '2px solid black',
    zIndex: 1,
    textAlign: 'center',
    position: 'absolute',
    whiteSpace: 'pre',
    margin: '5px',
    top: '10px',
    padding: '5px',
    pointerEvents: 'none',    
    display: 'inline-block',
    overflow: 'visible'

}