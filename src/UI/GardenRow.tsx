import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { percentOf } from "../engine/externalfns/util";
import { TimeRequiredForSeed, SeedType, GardenPlant, SeedGrowthTimeRequired, GardenSeed } from "../engine/garden/Garden";
import { SingleBuildingUI } from "./BuildingsUI";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";
import ListedResourceClass, { ListedDecimal, ListedNumber } from "./ListedResourceClass";
import { NewSingleResearchUI, SingleResearchUI } from "./ResearchUI";

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
                    {data.jobs.farthesthProgress.greaterThan(0) && <span style={{ display: 'flex' }}>Seed Gain Speed: x<DisplayNumber num={engine.jobs.seedGainSpeedMult} /></span>}
                    Seed Generation: {percentOf(data.garden.seedTimer, TimeRequiredForSeed)}
                    {data.garden.researches.progression > 0 && <div style={{marginBottom:'5px'}}>

                        Seeds: <DisplayDecimal decimal={data.garden.seeds} /><br /><br />
                        <button disabled={!engine.garden.canGetSeed()} onClick={engine.garden.getSeed} >
                            Grab Seed
        </button><br />
                        {data.garden.researches.progression > 1 && <BagDisplay />}

                    </div>}
                    {data.garden.researches.progression > 1 && <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid' }}>

                        <span style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>

                            Garden: {engine.garden.data.plots.length}/{engine.garden.maxgGardenPlots} plots<br />
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {data.garden.plots.map((plant, index) => {
                                return <NewPlotDisplay plant={plant} index={index} key={'plot' + index} />
                            })}
                        </div>
                    </div>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                    {data.garden.researches.progression > 2 && <React.Fragment>

                        <SingleBuildingUI building={engine.garden.rebirth} />
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
                </div>
                <div>
                    {data.garden.researches.progression > 2 && <div style={{ display: "flex", flexDirection: 'column' }}>

                        <span>
                            Fruits:
                        </span>
                        {<ListedResourceClass resource={engine.garden.hopeFruit} />}
                        {data.garden.researches.typeCircle &&
                            <ListedResourceClass resource={engine.garden.circularFruit} />
                        }
                        {data.garden.researches.typeSquare && <ListedResourceClass resource={engine.garden.squareFruit} />}
                        {data.garden.researches.typeBunch && <ListedResourceClass resource={engine.garden.bunchedFruit} />}
                        {data.garden.researches.typeTriangle && <ListedResourceClass resource={engine.garden.triangularFruit} />}
                        {data.garden.researches.doomedSeeds && <ListedResourceClass resource={engine.garden.doomedFruits} />}
                        {data.garden.researches.typeEgg && <ListedResourceClass resource={engine.garden.eggFruit} />}
                        <hr />
                        {data.garden.researches.typeCircle && <ListedNumber resource={engine.garden.plantSpeedMult} name="Plant Growth Multi" />}
                        {data.garden.researches.typeBunch && <ListedNumber resource={engine.garden.fruitGainMult} name="Fruit Gain Multi" />}
                        {data.garden.researches.typeTriangle && <ListedDecimal resource={engine.garden.waterTimeMulti} name='Water Time Multi' />}
                        {data.garden.researches.doomedSeeds && <ListedDecimal resource={engine.garden.doomFruitMult} name='Doom Gain Multi' />}
                        {data.garden.researches.typeEgg && <ListedDecimal resource={engine.garden.gardenJobSpeedMult} name='Job Speed Multi' />}

                    </div>}


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
        <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid' }}>
            <span style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                Bag: {engine.garden.data.bag.length}/{engine.garden.maxBagSlots} seeds<br />
            </span>
            <div style={{ display: "flex", flexDirection: 'row',flexWrap:'wrap' }}>
                {data.garden.bag.map((seed, index) => {
                    return <NewSeedDisplay seed={seed} index={index} key={'bag' + index} canPlantSeed={cps} />
                })}
            </div>

        </div>
    )
}


const NewSeedDisplay = (props: { seed: GardenSeed, index: number, canPlantSeed: boolean }) => {

    return <div style={{ display: 'flex', flexDirection: "column", flexBasis: '150px' }} className='NewSeedDisplay'>
        <span>
            {SeedType[props.seed.type].toUpperCase()} SEED
        </span>

        <button onClick={() => { gEngine.garden.plantSeed(props.index) }} disabled={!props.canPlantSeed} >
            Plant
        </button>

        {gEngine.datamap.garden.researches.doomedSeeds2 && <button onClick={() => { gEngine.garden.discardSeed(props.index) }}>
            Discard
        </button>}
    </div>
}

const NewPlotDisplay = (props: { plant: GardenPlant, index: number }) => {
    const engine = gEngine;

    const req = SeedGrowthTimeRequired(props.plant.seed);
    const growthPErcent = percentOf(props.plant.plantTimer, req);
    const waterTime = engine.garden.waterTimeBase.times(engine.garden.waterTimeMulti).toNumber();
    const waterPercent = percentOf(props.plant.water, waterTime);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '150px', flexShrink: 0 }} className='NewPlotDisplay'>

            <span>
                {SeedType[props.plant.seed.type].toUpperCase()} PLANT
            </span>

            {req > props.plant.plantTimer &&
                <span>
                    Growth: {growthPErcent}
                </span>
            }

            {req <= props.plant.plantTimer &&
                <button onClick={() => { engine.garden.harvest(props.index); }}>
                    Harvest
                </button>
            }

            {engine.datamap.garden.researches.watering &&
                <button onClick={() => { engine.garden.waterPlant(props.index); }}>
                    Water {waterPercent}
                </button>
            }

        </div>
    )
}