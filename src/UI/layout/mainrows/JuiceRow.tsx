import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import { I_FruitDecimals, SeedType } from "../../../engine/garden/Garden";
import { GuideTypes } from "../../../engine/garden/Juice";
import { SpiritualityLevelUnlocks } from "../../../engine/skills/Patience";
import { SingleBuildingUI } from "../../BuildingsUI";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import ProgressBar from "../../comps/ProgressBar";
import { ChildTip } from "../../comps/TipFC";
import DisplayDecimal from "../../DisplayDecimal";
import { ListedDecimal } from "../../ListedResourceClass";
import FruitResources from "./FruitResources";
import JuiceCanvas from "./JuiceCanvas";
import { spellBookNames } from "./MagicRow";
import { DICT_name_to_color } from "./SkillsRow";

const JuiceRow = (props: { data: Datamap }) => {
    const data = props.data;
    const juice = data.juice;
    const jClass = gEngine.garden.juice;
    const totalJuice = jClass.getTotalJuice();
    return (
        <div>
            Spiritual Juice<br />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                {juice.guide !== GuideTypes.none && <div>
                    A Guide Has Been Chosen
                {juice.guide === GuideTypes.Sara && <SSelection data={data} />}
                    {juice.guide === GuideTypes.Guth && <GSelection data={data} />}
                    {juice.guide === GuideTypes.Zammy && <ZSelection data={data} />}
                    <span>
                        <JuiceCanvas juices={juice.crushed} guide={juice.guide} />
                    </span>
                    <span>
                        <button onClick={jClass.startDrink} disabled={totalJuice.lessThan(1000)}>
                            <ChildTip>
                                Drink current Juice and move onto a new Juicer<br />
                                <ProgressBar current={totalJuice} max={1000} bg='black'  color='white'/>
                            </ChildTip>
                                    Drink Juice!
                                </button>
                        {data.juice.last_crushed && <button onClick={() => { gEngine.setPopup(6) }}>View Powers from Juice</button>}
                    </span>
                    {data.skillManager.spiritualGardening.level.greaterThanOrEqualTo(SpiritualityLevelUnlocks.juiceTrades) && <FlexRow>
                        <button onClick={()=>{gEngine.setPopup(7)}}>
                            <ChildTip>Trade FRESH juice to your guide for new treasures</ChildTip>
                            Juice Trades 
                        </button>
                        
                    </FlexRow>}
                </div>}

                {juice.guide !== GuideTypes.none && <FlexColumn>
                    <span>Juice!</span>
                    <span>
                        <ProgressBar color={DICT_name_to_color['Time']} bg='black' current={jClass.tickCounter} max={jClass.tickLength}>
                            Tick
                        </ProgressBar>
                    </span>
                    {canCheat && <button onClick={jClass.dataReset}>Reset Juice Data</button>}

                    <FlexRow>
                        <FlexColumn>
                        {data.skillManager.spiritualGardening.level.greaterThanOrEqualTo(SpiritualityLevelUnlocks.juicerUpgrades) && <div>
                        <div>
                            Juicer Upgrades
                        </div>
                        <SingleBuildingUI building={jClass.hopperLevel} />
                        <SingleBuildingUI building={jClass.pipeLevel} />
                        <SingleBuildingUI building={jClass.powerplantLevel} />
                    </div>}

                            {juice.guide === GuideTypes.Sara && <span>Available Doom Fruit: <DisplayDecimal decimal={data.garden.fruits.doom} /></span>}
                            {juice.guide === GuideTypes.Guth && <span>Available Plain Fruit: <DisplayDecimal decimal={data.garden.fruits.plain} /></span>}
                            {juice.guide !== GuideTypes.Zammy && <button onClick={jClass.toggleHopper}>
                                Fill Hopper {juice.fillingHopper ? 'ON' : 'OFF'}
                            </button>}
                            {juice.guide === GuideTypes.Zammy && <button onClick={jClass.toggleHopper}>
                                Auto Harvest & Fill Hopper {juice.fillingHopper ? 'ON' : 'OFF'}
                            </button>}
                            <span>Hopper Fill speed: <DisplayDecimal decimal={jClass.calced_hopperFillSpeed.current} /> / tick (<DisplayDecimal decimal={jClass.tickedNumbers.toHopper} /> last tick) </span>
                            <span>
                                <ProgressBar bg='black' color={DICT_name_to_color['Space']} current={juice.hopperFruit} max={jClass.calced_maxHopperFill.current}>
                                    Fuel Hopper: <DisplayDecimal decimal={juice.hopperFruit} /> / <DisplayDecimal decimal={jClass.calced_maxHopperFill.current} />
                                </ProgressBar>
                            </span>
                            <span>
                                Pipes carry [1%] of Fruit per tick to the powerplant (+<DisplayDecimal decimal={jClass.tickedNumbers.toPlant} /> last tick)
                    </span>
                            <span style={{fontSize:'1.2em'}}>
                                Fruit in Powerplant: <DisplayDecimal decimal={juice.powerPlantFruit} />
                            </span>
                            <span>
                                Each tick your guide converts <span className='tippedText'>
                                    <ChildTip>
                                        <span>
                                            log_10(Fruit In Powerplant)/4 fruit is used to convert an equal amount to power
                            </span>
                                        <br />
                                        <span>
                                            Total fruit wasted in power conversion: <DisplayDecimal decimal={juice.fruitsSpentMakingPower} />

                                        </span>

                                    </ChildTip>
                        some
                        </span> fruit in the Power Plant to Power. (-<DisplayDecimal decimal={jClass.tickedNumbers.usedPPF} /> fruit last tick)
                    </span>
                            <span className='yellow-text' style={{ fontSize: '2em' }}>
                                Power: <DisplayDecimal decimal={juice.powerAmount} /> (+<DisplayDecimal decimal={jClass.tickedNumbers.powerGain} /> power last tick)
                    </span>
                            <span>
                                1% of power decays per tick. <DisplayDecimal decimal={juice.powerDecayed} /> total Power decayed. (<DisplayDecimal decimal={jClass.tickedNumbers.toDecay} /> last tick)
                    </span>
                        </FlexColumn>
                        <FlexColumn>

                            <span>
                                <button onClick={() => { gEngine.setPopup(4) }}>
                                    Select Fruit To Crush
                        </button>
                                {data.juice.toCrush !== null && <button onClick={jClass.clearCrushedFruit}>Clear</button>}
                            </span>
                            <span>
                                {data.juice.toCrush === null && <span> No crush target</span>}
                                {data.juice.toCrush !== null && <span> Crushing: {SeedType[data.juice.toCrush].toUpperCase()} FRUIT (+<DisplayDecimal decimal={jClass.tickedNumbers.crushed} /> last tick)</span>}
                            </span>
                            <span>
                                The Crusher uses 1% of power per tick to turn Fruits into Juice
                    </span>
                            <span>
                                <span>
                                    Juice Contents
                        </span>
                                <JuiceDisplay juiceData={juice.crushed} />
                            </span>

                        </FlexColumn>
                    </FlexRow>

                    

                </FlexColumn>}

                {juice.guide === GuideTypes.none && <GuideSelection data={data} />}

                <div>
                    <FruitResources data={data} />
                </div>
            </div>
        </div>
    )
}

export default JuiceRow;


const GuideSelection = (props: { data: Datamap }) => {
    const data = props.data;
    return (
        <FlexColumn>
            <span>Juicing Fruits requires a Guide. Be careful, you can't easily choose a new Guide.</span>
            <FlexRow>
                <SSelection data={data} />
                <GSelection data={data} />
                <ZSelection data={data} />
            </FlexRow>
            {data.juice.last_crushed && <button onClick={() => { gEngine.setPopup(6) }}>View Powers from Juice</button>}
            
        </FlexColumn>
    )
}

export function sum_I_FruitDecimals(toSum: I_FruitDecimals): Decimal {
    return toSum.bunched.add(toSum.circular).add(toSum.doom).add(toSum.egg).add(toSum.hope).add(toSum.knowledge).add(toSum.plain).add(toSum.square).add(toSum.triangular);
}

export const JuiceDisplay = (props: { juiceData: I_FruitDecimals }) => {
    const juice = props.juiceData
    const totalJuice = sum_I_FruitDecimals(juice);
    return (<span>
        <ListedDecimal resource={juice.hope} name={'Hope '} />
        <ListedDecimal resource={juice.circular} name={'Circular '} />
        <ListedDecimal resource={juice.square} name={'Square '} />
        <ListedDecimal resource={juice.bunched} name={'Bunched '} />
        <ListedDecimal resource={juice.triangular} name={'Triangular '} />
        <ListedDecimal resource={juice.doom} name={'Doom '} />
        <ListedDecimal resource={juice.egg} name={'Egg '} />
        {/*<ListedDecimal resource={juice.plain} name={'Plain'} />
        <ListedDecimal resource={juice.knowledge} name={'Knowledge'} />*/}
        <ListedDecimal resource={totalJuice} name={'Total Juiced Fruit'} />
    </span>)
}

const SSelection = (props: { data: Datamap }) => {
    const data = props.data;
    return (

        <div className='blue-text blue-border' style={{ padding: '3px' }}>
            <FlexColumn>
                <span style={{ textAlign: 'center', fontSize: '1.5em' }}>
                    Guide {spellBookNames[1]}
                                </span>
                <span>
                    <b>Disables</b> your ability to discard seeds
                                </span>
                <span>
                    Hiring Fee: All of your Knowledge <span className='tippedText'><ChildTip>Seeds, Plants, Fruit</ChildTip>stuff</span>
                </span>
                <span>
                    Uses Doom Fruit to Juice
                                </span>
                <button hidden={data.juice.guide !== GuideTypes.none} onClick={() => { gEngine.garden.juice.chooseGuide(GuideTypes.Sara) }}>
                    Choose
                                </button>
            </FlexColumn>
        </div>

    )
}

const GSelection = (props: { data: Datamap }) => {
    const data = props.data;
    return (

        <div className='green-text green-border' style={{ padding: '3px' }}>
            <FlexColumn>
                <span style={{ textAlign: 'center', fontSize: '1.5em' }}>
                    Guide {spellBookNames[2]}
                    </span>
                <span>
                    Repairs Watering Cans with Hope Fruit
                    </span>
                <span>
                    Hiring Fee: 10k Plain Fruit
                    </span>
                <span>
                    Uses Plain Fruit to Juice
                    </span>
                <button hidden={data.juice.guide !== GuideTypes.none} onClick={() => { gEngine.garden.juice.chooseGuide(GuideTypes.Guth) }} disabled={data.garden.fruits.plain.lessThan(10000)}>
                    Choose
                    </button>
            </FlexColumn>
        </div>

    )
}

const ZSelection = (props: { data: Datamap }) => {
    const data = props.data;
    return (

        <div className='red-text red-border' style={{ padding: '3px' }}>
            <FlexColumn>
                <span style={{ textAlign: 'center', fontSize: '1.5em' }}>
                    Guide {spellBookNames[3]}
                    </span>
                <span>
                    Hiring Fee: 1 Fruit of Knowledge
            </span>
                <span>
                    Automatically Harvests Plants
                    </span>
                <span>
                    Uses Harvested Plants to Juice
                    </span>
                <button hidden={data.juice.guide !== GuideTypes.none}
                    disabled={data.garden.fruits.knowledge.lessThan(1)}
                    onClick={() => { gEngine.garden.juice.chooseGuide(GuideTypes.Zammy) }}>
                    Choose
                    </button>
            </FlexColumn>
        </div>

    )
}
