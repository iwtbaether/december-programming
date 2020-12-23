import React from "react";
import Research, { SingleResearch } from "../engine/Research";
import TipFC from "./comps/TipFC";
import DisplayDecimal from "./DisplayDecimal";

interface CompProps {research: Research}
interface CompState {subnav: number}
export default class ResearchUI extends React.Component<CompProps, CompState> {

    constructor(props:any){
        super(props)
        this.state = {
            subnav: 0,
        }
    }

    setFn = (num:number) => {
        this.setState({subnav:num})
    }
    
    render () {
        const research = this.props.research;
        return ( <div>

            Doom Research
            <div className='NavRow flexrow'>
                <ResearchNavButton navKey={NavKeys.Available} active={this.state.subnav} setFn={this.setFn} />
                <ResearchNavButton navKey={NavKeys.Completed} active={this.state.subnav} setFn={this.setFn} />
            </div>
            <div className='flexrow gap wrap'>
            </div>

                </div>)

    }

}

export class SingleResearchUI extends React.Component<{research: SingleResearch, active: number}, {open: boolean}> {

    constructor(props:any){
        super(props)
        this.state = {
            open: false
        }
    }

    over = () => {
        //console.log('over');
        
        this.setState({open:true})
    }

    getTip () {

        const research = this.props.research;
        
        return (<div>
                {research.info.name}
                <hr/>
                {research.getCosts().map((cost_and_name)=>{
                    return (
                    <span key={`tooltip${cost_and_name.name}cost`} className={cost_and_name.can?'CostAble':'CostUnable'}>
                {cost_and_name.name} : <DisplayDecimal decimal={cost_and_name.cost} /><br/>
                    </span>)
                })}
                <hr/>
                {research.info.description}
            </div>)

    }

    leave = () => {
        //console.log('out');
        
        this.setState({open:false})
    }


    render () {
        
        const research = this.props.research;
        if (research.info.hidden() && this.props.active === 0) return null;
        const have = research.info.get();
        if (have && this.props.active === 0) return null;
        const tipDiv = this.state.open;

        const stylelist = ['disabled-button', 'active-button', 'capped-button'];
        const style = stylelist[research.canBuy()];
       
    return (
        <span onMouseOver={this.over} onMouseOut={this.leave} style={{position:'relative', overflow: 'visible'}} >
            <TipFC tip={this.getTip()}/>
       {(!have && this.props.active === 0) && <button className={style} disabled={style != 'active-button'} onClick={()=>{research.buy(); this.leave()}}>
    {research.info.name}
        </button>}
        {(have && this.props.active === 1 ) && <span className='researched' >
    {research.info.name}
        </span>}
        </span>
        )

    }
}

enum NavKeys {
    'Available','Completed'
}

class ResearchNavButton extends React.Component<{navKey: number, setFn: (num:number)=>void, active: number}, {}> {

    
    render () {        
        const key = this.props.navKey
        const str = NavKeys[key]

        const style = (key === this.props.active)?'ActiveNavButton':'NavButton';

        return (<button className={style} onClick={()=>{this.props.setFn(key)}}>
            {str.toUpperCase()}
        </button>)

    }

}


export class NewSingleResearchUI extends React.Component<{research: SingleResearch}, {open: boolean}> {

    constructor(props:any){
        super(props)
        this.state = {
            open: false
        }
    }

    over = () => {
        //console.log('over');
        
        this.setState({open:true})
    }

    getTip () {

        const research = this.props.research;
        
        return (<div>
                {research.info.description}
                <hr/>
                {research.getCosts().map((cost_and_name)=>{
                    return (
                    <span key={`tooltip${cost_and_name.name}cost`} className={cost_and_name.can?'CostAble':'CostUnable'}>
                {cost_and_name.name} : <DisplayDecimal decimal={cost_and_name.cost} /><br/>
                    </span>)
                })}
            </div>)

    }

    leave = () => {
        //console.log('out');
        
        this.setState({open:false})
    }


    render () {
        
        const research = this.props.research;
        if (research.info.hidden()) return null;
        const have = research.info.get();
    
        const tipDiv = this.state.open;

        const stylelist = ['disabled-button', 'active-button', 'capped-button'];
        const style = stylelist[research.canBuy()];
       
    return (
        <span style={{position:'relative', overflow: 'visible'}} >
        <TipFC tip={this.getTip()}/>
       {(!have) && <button className={style} disabled={style != 'active-button'} onClick={()=>{research.buy(); this.leave()}}>
    {research.info.name}
        </button>}
        {(have) && <button disabled className='achieved-button'>
    {research.info.name}
        </button>}
        </span>
        )

    }
}