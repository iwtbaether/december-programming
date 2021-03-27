import Decimal from "break_infinity.js";
import React from "react";
import { hydrate } from "react-dom";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { canCheat } from "../../../../engine/externalfns/util";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import { ChildTip } from "../../../comps/TipFC";
import DisplayDecimal, { DisplayDecimalAsPercent } from "../../../DisplayDecimal";
import DisplayNumber from "../../../DisplayNumber";
import JuiceCanvas from "../JuiceCanvas";
import { JuiceDisplay } from "../JuiceRow";


const TODO = <span style={{color:'red'}}>[TODO]</span>

const JuiceTrades = (props: { data: Datamap }) => {
    const engine = gEngine;
    const data = props.data;
    const juices = data.juice.crushed;

    let canTrade = engine.garden.juice.tradeManger.setTrades(juices);

    return (
        <div style={{width:'800px',display:'flex',flexDirection:'column', gap:'5px'}}>
        <span style={{whiteSpace:'pre-wrap',color:'lightblue'}}>
            Trade Fresh (not drank, currently being made) Juice to your guide for rewards. This resets your juice, but you keep the previous Juice you drank and your Juicer upgrades. 
        </span>

        <FlexRow>
            <JuiceRecipe {...JR_SpellBook} able={canTrade.book} noLevel /> 
            <JuiceRecipe {...JR_SpellBookRepent} able={canTrade.absolution} noLevel /> 
            <JuiceRecipe {...JR_GuidePower} able={canTrade.oneK} /> 
            <JuiceRecipe {...JR_ThreeSilver} able={canTrade.threeS} /> 
            <JuiceRecipe {...JR_FiveSilver} able={canTrade.fiveS} /> 
            <JuiceRecipe {...JR_ThreeGold} able={canTrade.threeG} /> 
            <JuiceRecipe {...JR_MaxStars} able={canTrade.fiveSThreeG} /> 
            <JuiceRecipe {...JR_BalancedStar} able={canTrade.balancedShapes} /> 
            <JuiceRecipe {...JR_VeryGray} able={canTrade.balancedShade} />
        </FlexRow>
        <FlexRow>
            <button onClick={engine.clearPopup}>
                Close
            </button>
        </FlexRow>
        </div>
    )
}

export default JuiceTrades;

interface JuiceRecipesProps {
    name: string
    cost: string
    outcome: string
    tradeID: number
    noLevel?: boolean
    able?: boolean
}
const JuiceRecipe = (props: JuiceRecipesProps) => {

    const bgColor = props.able?'green':'black'

    return (
        <div style={{border:'1px solid white', display:'flex',flexDirection:'column', 
            width:'250px',height:'100px',justifyContent:'space-between',whiteSpace:'pre-wrap',backgroundColor:bgColor}}>
            <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>

            {!props.noLevel && <span>
                {props.name} - [Level: {gEngine.datamap.juice.trades[props.tradeID]}]
            </span>}
            {props.noLevel && <span>
                {props.name}
                </span>}
                <span>
            <button disabled={bgColor === 'black'} onClick={()=>{gEngine.garden.juice.tradeManger.tryTrade(props.tradeID)}}>
                TRADE
            </button>
                </span>
            </div>
                    
            <span>
                <span className={(bgColor==='green')?'orange-text':'red-text'}>REQ: </span>{props.cost}
            </span>
            <span style={{whiteSpace:'pre-wrap'}}>
            <span className='green-text'>RWD: </span>{props.outcome}
            </span>
        </div>
    )
}

const JR_SpellBook: JuiceRecipesProps = {
    name: 'Influenced Spellbook [TODO]',
    cost: '1k total Fruit',
    outcome: 'A spellbook that can have generic and guide specific spells',
    tradeID: 0 
}

const JR_SpellBookRepent: JuiceRecipesProps = {
    name: 'Absolution [TODO]',
    cost: 'Repentance, all magical knowledge, 10k total fruit',
    outcome: 'Your Guide will help you cast away your current Spellbook',
    tradeID: 1
}

const JR_GuidePower: JuiceRecipesProps = {
    name: 'Power Generation',
    cost: '1k total Fruit',
    outcome: '10% More Power Generation',
    tradeID: 2
}

const JR_ThreeSilver: JuiceRecipesProps = {
    name: 'Tricky',
    cost: '3 Silver Stars, No Gold Stars',
    outcome: 'Auto Plant plants 5 more seed per second',
    tradeID: 3
}

const JR_FiveSilver: JuiceRecipesProps = {
    name: 'Max and Min',
    cost: '5 Silver Stars, No Gold Stars',
    outcome: '10% More Silver Star Effect',
    tradeID: 4
}

const JR_ThreeGold: JuiceRecipesProps = {
    name: 'Min and Max',
    cost: 'No Silver Stars, 3 Gold Stars',
    outcome: '10% More Gold Star Effect',
    tradeID: 5
}

const JR_MaxStars: JuiceRecipesProps = {
    name: 'Max and Max',
    cost: '5 Silver Stars, 3 Gold Stars',
    outcome: '10% More Hopper Storage',
    tradeID: 6
}

const JR_BalancedStar: JuiceRecipesProps = {
    name: 'Balance',
    cost: 'A Star with 5 points of near equal length',
    outcome: '10% More Juice Strength',
    tradeID: 7
}

const JR_VeryGray: JuiceRecipesProps = {
    name: 'Very Gray',
    cost: `A very gray border`,
    outcome: '10% More Juice Border Effect',
    tradeID: 8
}
