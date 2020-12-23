import { isPlainObject } from "lodash";
import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import Engine from "../engine/Engine";
import { canCheat, MINUTE_MS, percentOf } from "../engine/externalfns/util";
import { TimeRequiredForSeed, SeedType, GardenPlant, SeedGrowthTimeRequired, GardenSeed } from "../engine/garden/Garden";
import {  SingleBuildingUI } from "./BuildingsUI";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";
import ListedResourceClass from "./ListedResourceClass";
import { SingleResearchUI } from "./ResearchUI";

const GardenRow = (props: { data: Datamap }) => {
    const data = props.data;
    const engine = gEngine;
    return (
        <div>
            Spiritual Garden<br />
            {canCheat && <div>
                <button onClick={engine.garden.resetGarden}>
                    Reset Garden
          </button>
            </div>}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flexBasis: '500px', flexShrink: 0 }}>
                    {data.cell.rebirth.greaterThan(0) &&
                        <div>
                            Garden Speed:   x<DisplayDecimal decimal={data.cell.rebirth.add(1)} />
                        </div>
                    }
                    {data.jobs.farthesthProgress.greaterThan(0) && <span style={{display:'flex'}}>Seed Gain Speed: x<DisplayNumber num={engine.jobs.seedGainSpeedMult}/></span>}
                    Seed Generation: {percentOf(data.garden.seedTimer, TimeRequiredForSeed)}
                    {data.garden.researches.progression > 0 && <div>

                        Seeds: <DisplayDecimal decimal={data.garden.seeds} /><br /><br/>
                        <button disabled={!engine.garden.canGetSeed()} onClick={engine.garden.getSeed} >
                            Grab Seed
        </button><br />
                        {data.garden.researches.progression > 1 && <BagDisplay />}

                    </div>}
                    {data.garden.researches.progression > 1 && <div>

                        Garden: {engine.garden.data.plots.length}/{engine.garden.maxgGardenPlots} plots<br />
                        <div style={{display:'flex',flexWrap:'wrap'}}>
            <div style={{height:'100px', flexBasis:'20px',flexShrink:0}}/>
                        {data.garden.plots.map((plant, index) => {
                            return <NewPlotDisplay plant={plant} index={index} key={'plot' + index} />
                        })}
                        </div>
                    </div>}
                </div>
                <div>
                    {data.garden.researches.progression > 2 && <div>
                        <span>
                        </span>
                        <SingleBuildingUI building={engine.garden.rebirth} />
                        <SingleBuildingUI building={engine.garden.wateringCan} />
                        <SingleResearchUI research={engine.garden.res_watering} active={0} />
                        <SingleResearchUI research={engine.garden.res_expansion_one} active={0} />
                        <SingleResearchUI research={engine.garden.res_expansion_two} active={0} />
                        <SingleResearchUI research={engine.garden.res_bag_expansion} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_circle} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_squre} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_bunch} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_triangle} active={0} />
                        <SingleResearchUI research={engine.garden.res_doomfromhope} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_egg} active={0} />
                        <SingleResearchUI research={engine.garden.res_doomedDiscard} active={0} />
                    </div>}
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
                        {data.garden.researches.typeCircle && <DisplayNumber num={engine.garden.gardenSpeedMult} name="Plant Growth Multi:" />}
                        {data.garden.researches.typeBunch && <span>
                            <DisplayNumber num={engine.garden.fruitGainMult} name="Fruit Gain Multi:" />
                        </span>}
                        {data.garden.researches.typeTriangle && <span>
                            <span style={{ minWidth: '200px', display: 'inline-block' }}>
                                Water Time Multi
                            </span>
                            <DisplayDecimal decimal={engine.garden.waterTimeMulti}>
                            </DisplayDecimal>
                        </span>}
                        {data.garden.researches.doomedSeeds && <span style={{ display: 'flex', flexDirection: 'row' }}>
                            <span style={{ flexBasis: '200px' }}>
                                Doom Gain Multi:
                        </span>
                            <DisplayDecimal decimal={engine.garden.doomFruitMult} />

                        </span>}
                        {data.garden.researches.typeEgg && <span style={{ display: 'flex', flexDirection: 'row' }}>
                            <span style={{ flexBasis: '200px' }}>
                                Job Speed Multi:
                        </span>
                            <DisplayDecimal decimal={engine.garden.jobSpeedMult} />

                        </span>}

                    </div>}


                </div>
            </div>
        </div>
    )
}

export default GardenRow;



const PlotDisplay = (props: { plant: GardenPlant, index: number }) => {
    const req = SeedGrowthTimeRequired(props.plant.seed);
    const engine = gEngine;
    return (
        <div>
            {SeedType[props.plant.seed.type]} Plant -
            Growth: {percentOf(props.plant.plantTimer, req)}
            {req < props.plant.plantTimer && <button onClick={() => {
                engine.garden.harvest(props.index);
            }}>
                Harvest
            </button>}
            {engine.datamap.garden.researches.watering && <button onClick={() => {
                engine.garden.waterPlant(props.index);
            }}>
                Water
            </button>}
            {props.plant.water > 0 && Math.floor(props.plant.water / 1000)}
        </div>
    )
}

const BagDisplay = () => {
    const engine = gEngine;
    const data = engine.datamap;
    const cps = engine.garden.canPlantSeed();
    return (
        <div>
            Bag: {engine.garden.data.bag.length}/{engine.garden.maxBagSlots} seeds<br />
            <div style={{ display: "flex", flexDirection: 'row' }}>
            <div style={{height:'50px', flexBasis:'20px'}}/>
                {data.garden.bag.map((seed, index) => {
                    const vk = seed.type + index;
                    return <NewSeedDisplay seed={seed} index={index} key={'bag'+index} canPlantSeed={cps} />
                })}
            </div>

        </div>
    )
}


const NewSeedDisplay = (props: { seed: GardenSeed, index: number, canPlantSeed: boolean }) => {

    return <div style={{display: 'flex', flexDirection: "column", flexBasis:'150px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '150px', flexShrink:0 }}>

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