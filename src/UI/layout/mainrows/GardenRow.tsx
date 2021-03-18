import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat, percentOf } from "../../../engine/externalfns/util";
import { TimeRequiredForSeed, GardenSeed, SeedType, GardenPlant } from "../../../engine/garden/Garden";
import { GuideTypes } from "../../../engine/garden/Juice";
import { SingleBuildingUI } from "../../BuildingsUI";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import ProgressBar from "../../comps/ProgressBar";
import TipFC, { ChildTip } from "../../comps/TipFC";
import DisplayDecimal from "../../DisplayDecimal";
import DisplayNumber from "../../DisplayNumber";
import ListedResourceClass, { ListedNumber, ListedDecimal } from "../../ListedResourceClass";
import { NewSingleResearchUI } from "../../ResearchUI";
import FruitResources from "./FruitResources";

const GardenRow = (props: { data: Datamap }) => {
    const data = props.data;
    const engine = gEngine;
    const garden = gEngine.garden;
    const wt = garden.waterTimeBase.times(garden.waterTimeMulti).div(1000)
    return (
        <div>
            Spiritual Garden<br />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flexBasis: '500px', flexShrink: 0, display: "flex", flexDirection: 'column' }}>
                    {data.cell.rebirth.greaterThan(0) &&
                        <div>
                            Garden Speed:   x<DisplayDecimal decimal={garden.gardenSpeedMulti} />
                        </div>
                    }
                    {data.garden.researches.watering && <span>
                        Watering Time: <DisplayDecimal decimal={wt} /> units
                    </span>}
                    {data.jobs.notReset.records.zero.greaterThan(0) && <span style={{ display: 'flex' }}>Seed Gain Speed: x<DisplayNumber num={engine.jobs.seedGainSpeedMult * engine.crafting.gardeningCalcData.seedGainMore} /></span>}
                    Seed Generation: {percentOf(data.garden.seedTimer, TimeRequiredForSeed)}
                    {garden.equipment.fruitGainBase > 0 && <div style={{ position: 'relative' }}>
                        Total Fruit Gain: <DisplayNumber num={garden.getFruitGain()} />
                        <TipFC tip={<span>
                            Base <DisplayNumber num={garden.equipment.fruitGainBase + 1} /> * Mult <DisplayNumber num={garden.fruitGainMult} />
                        </span>} />
                    </div>}
                    {data.garden.researches.progression > 0 && <div style={{ marginBottom: '5px',display:"flex",flexDirection:'column' }}>
                        <span>

                        Seeds: <DisplayDecimal decimal={data.garden.seeds} /><br />
                        </span>
                        <FlexRow>

                        <button disabled={!engine.garden.canGetSeed()} onClick={engine.garden.getSeed} >
                            Grab Seed
                        </button>
                        {garden.data.juicin && <button onClick={()=>{gEngine.setNav(10)}}>
                            <ChildTip>
                                Your Spiritual prowess has attracted attention 
                            </ChildTip>
                            Go Make Juice
                        </button>}
                        </FlexRow>
        <br />
                            
                    <div style={{display:'flex',flexDirection:'row'}}>
                        {data.garden.researches.progression > 1 && <BagDisplay />}

                    {data.garden.researches.progression > 1 && <div style={{ display: 'flex', flexDirection: 'column',flexGrow:1}}>

                        <span style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>

                            Garden: {engine.garden.data.plots.length}/{engine.garden.maxgGardenPlots} plots<br />
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '3px', flexDirection:'row'}}>
                            {data.garden.plots.map((plant, index) => {
                                return <NewPlotDisplay plant={plant} index={index} key={'plot' + index} />
                            })}
                        </div>

                    </div>}
                            </div>
                            </div>}
                </div>
                            <FlexColumn>

                    <FlexRow>
                        {data.garden.researches.progression > 2 && <React.Fragment>

                            <SingleBuildingUI building={engine.garden.rebirth} />
                            <SingleBuildingUI building={gEngine.determination} />
                            <SingleBuildingUI building={engine.garden.wateringCan} />
                            <SingleBuildingUI building={engine.garden.denseWater} />
                            <SingleBuildingUI building={engine.garden.bunchPower} />
                            <NewSingleResearchUI research={engine.garden.res_watering} />
                            <NewSingleResearchUI research={engine.garden.res_expansion_one} />
                            <NewSingleResearchUI research={engine.garden.res_expansion_two} />
                            <NewSingleResearchUI research={engine.garden.res_expansion_three} />
                            <NewSingleResearchUI research={engine.garden.res_bag_expansion} />
                            <NewSingleResearchUI research={engine.garden.res_seedtype_circle} />
                            <NewSingleResearchUI research={engine.garden.res_seedtype_squre} />
                            <NewSingleResearchUI research={engine.garden.res_seedtype_bunch} />
                            <NewSingleResearchUI research={engine.garden.res_seedtype_triangle} />
                            <NewSingleResearchUI research={engine.garden.res_doomfromhope} />
                            <NewSingleResearchUI research={engine.garden.res_seedtype_egg} />
                            <NewSingleResearchUI research={engine.garden.res_doomedDiscard} />


                        </React.Fragment>}
                        <SingleBuildingUI building={engine.garden.seedGeneration} />
                    {canCheat && <button onClick={engine.garden.juice.dataReset}>Reset Juice Data</button>}
                    </FlexRow>
                    {garden.data.adverse.length > 0 && <FlexRow>
                        <span>Can't Grab ({data.garden.adverse.length}):</span>
                        {data.garden.adverse.map((type)=>{
                            return(<span key={`adverse${type}`}>
                                [{SeedType[type]}]
                            </span>)
                        })}
                        </FlexRow>}
                            </FlexColumn>
                    <div>
                        {data.garden.researches.progression > 2 && <FruitResources data={data}/>}



                </div>
            </div>
        </div>
    )
}

export default GardenRow;




const BagDisplay = () => {
    const engine = gEngine;
    const data = engine.datamap;
    const cps = engine.garden.canPlantSeed();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow:0,flexShrink:0,flexBasis:'150px' }}>
            <span style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                Bag: {engine.garden.data.bag.length}/{engine.garden.maxBagSlots} seeds<br />
            </span>
            <div style={{ display: "flex", flexDirection: 'column-reverse', flexWrap: 'nowrap' }}>
                {data.garden.bag.map((seed, index) => {
                    return <NewSeedDisplay seed={seed} index={index} key={'bag' + index} canPlantSeed={cps} />
                })}
            </div>

        </div>
    )
}


const NewSeedDisplay = (props: { seed: GardenSeed, index: number, canPlantSeed: boolean }) => {

    return <div style={{ display: 'flex', flexDirection: "column"}} className='NewSeedDisplay'>
        <span>
            {SeedType[props.seed.type].toUpperCase()} SEED
        </span>

        <button onClick={() => { gEngine.garden.plantSeed(props.index) }} disabled={!props.canPlantSeed} >
            Plant
        </button>

        {gEngine.datamap.garden.researches.doomedSeeds2 && <button hidden={gEngine.datamap.juice.guide === GuideTypes.Sara} onClick={() => { gEngine.garden.discardSeed(props.index) }}>
            Discard
        </button>}
    </div>
}

const NewPlotDisplay = (props: { plant: GardenPlant, index: number }) => {
    const engine = gEngine;

    const req = engine.garden.seedGrowthTimeRequired(props.plant.seed);
    const growthPErcent = percentOf(props.plant.plantTimer, req);
    const waterTime = engine.garden.waterTimeBase.times(engine.garden.waterTimeMulti).toNumber();
    const waterPercent = percentOf(props.plant.water, waterTime);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '150px', flexShrink: 0, padding: '3px', gap: '3px' }} className='NewPlotDisplay'>

            <span style={{ textAlign: 'center' }}>
                {SeedType[props.plant.seed.type].toUpperCase()} PLANT
            </span>

            {req > props.plant.plantTimer &&

                    <button disabled className=''>
                <FlexRow>
                        Growth:
                    <span style={{ flexGrow: 1 }}>
                        <ProgressBar current={props.plant.plantTimer} max={req} color={''} bg={'black'} className={'green-bg'} />
                    </span>
                </FlexRow>
            </button>
            }

            {req <= props.plant.plantTimer &&
                <button onClick={() => { engine.garden.harvest(props.index); }} className='HarvestButton'>
                    Harvest
                </button>
            }

            {engine.datamap.garden.researches.watering &&

                <button onClick={() => { engine.garden.waterPlant(props.index); }} style={{ whiteSpace: 'nowrap' }}>
                    <FlexRow>
                        <span>
                            Water
                    </span>
                        <span style={{ flexGrow: 1 }}>
                            <ProgressBar current={props.plant.water} max={waterTime} color={''} className='blue-bg' bg={'black'} />
                        </span>
                    </FlexRow>
                </button>
            }

        </div>
    )
}