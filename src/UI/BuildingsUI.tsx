import React, { CSSProperties, ReactNode } from "react";
import { gEngine } from "..";
import { SingleBuilding } from "../engine/externalfns/decimalInterfaces/SingleBuilding";
import DisplayDecimal from "./DisplayDecimal";

interface CompProps {}
interface CompState {}
export default class BuildingsUI extends React.Component<CompProps, CompState> {
    
    render () {
        return ( <div>
   
                </div>)

    }

}

export class SingleBuildingUI extends React.Component<{building: SingleBuilding}, {open: boolean}> {

    constructor(props:any){
        super(props)
        this.state = {
            open: false
        }
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
        <span onMouseOver={this.over} onMouseOut={this.leave} style={{position:'relative'}}>
            {building.info.active && <button className={'base-button left-button red-text'} onClick={building.activeDOWN}>{building.activeDISABLED()?.toNumber()}</button>}
            <BuildingTip tip={this.getTip()} show={tipDiv}/>
       <button className={style2} onClick={this.buy} disabled={bcb !== 1}>
    {building.info.building.info.name} <span className='comment-text'>({building.count.toNumber()})</span>
        </button>

            {building.info.active && <button className={'base-button right-button green-text'} onClick={building.activeUP}>{building.activeABLED()?.toNumber()}</button>}
        </span>
        )

    }
}

export const BuildingTip: React.FC<{ tip?: ReactNode, show: boolean}> = (props) => {
    if (props.tip === undefined) return null
    if (props.show === false) return null;
    return (
          <div className='BuildingTip' style={BTStyle}>
              {props.tip} 
        </div>
      )
  
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