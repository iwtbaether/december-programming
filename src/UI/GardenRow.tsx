import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { canCheat, MINUTE_MS, percentOf } from "../engine/externalfns/util";
import { TimeRequiredForSeed, SeedType, GardenPlant, SeedGrowthTimeRequired } from "../engine/garden/Garden";
import { SingleBuildingUI } from "./BuildingsUI";
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
                <div style={{flexBasis:'500px', flexShrink:0}}>
                    {data.cell.rebirth.greaterThan(0) && 
                        <div>
                            Garden Speed:   x<DisplayDecimal decimal={data.cell.rebirth.add(1)}  />
                        </div>
                    }
                    Seed Generation: {percentOf(data.garden.seedTimer, TimeRequiredForSeed)}
                    {data.garden.researches.progression > 0 && <div>

                        Seeds: <DisplayDecimal decimal={data.garden.seeds} /><br />
                        <button disabled={!engine.garden.canGetSeed()} onClick={engine.garden.getSeed} >
                            Get Seed
        </button><br />
                        {data.garden.researches.progression > 1 && <div>
                            Bag: {engine.garden.data.bag.length}/{engine.garden.maxBagSlots} seeds<br />
                            <form onSubmit={(ev: any) => {
                                ev.preventDefault();
                                const index = ev.target[0].selectedIndex;
                                if (index < 0) return;
                                //console.log(ev.target[0].selectedIndex);
                                engine.garden.plantSeed(index);
                                engine.notify();
                                //engine.garden.plantSeed()
                            }}>
                                <label htmlFor="seeds">Choose a Seed:</label>
                                <select id="seed" name="seed">
                                    {data.garden.bag.map((seed, index) => {
                                        const vk = seed.type + index;
                                        return <option value={vk} key={vk} >
                                            {SeedType[seed.type]} {index}
                                        </option>
                                    })}
                                </select>
                                <input type="submit" value='Plant' disabled={!engine.garden.canPlantSeed()} />
                            </form>
                        </div>}

                    </div>}
                    {data.garden.researches.progression > 1 && <div>

                        Garden: {engine.garden.data.plots.length}/{engine.garden.maxgGardenPlots} plots<br />
                        {data.garden.plots.map((plant, index) => {
                            return <PlotDisplay plant={plant} index={index} key={'plot' + index} />
                        })}
                    </div>}
                </div>
                <div>
                    {data.garden.researches.progression > 2 && <div>
                        <span>
                        </span>
                        <SingleBuildingUI building={engine.garden.rebirth} />
                        <SingleResearchUI research={engine.garden.res_watering} active={0} />
                        <SingleResearchUI research={engine.garden.res_expansion_one} active={0} />
                        <SingleResearchUI research={engine.garden.res_expansion_two} active={0} />
                        <SingleResearchUI research={engine.garden.res_bag_expansion} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_circle} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_squre} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_bunch} active={0} />
                        <SingleResearchUI research={engine.garden.res_seedtype_triangle} active={0} />
                        <SingleResearchUI research={engine.garden.res_doomfromhope} active={0} />
                    </div>}
                </div>
                <div>
                    {data.garden.researches.progression > 2 && <div style={{display:"flex",flexDirection:'column'}}>

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
                        <hr/>
                        {data.garden.researches.typeCircle && <DisplayNumber num={engine.garden.gardenSpeedMult} name="Plant Growth Multi:" />  }
                        {data.garden.researches.typeBunch && <span>
                        <DisplayNumber num={engine.garden.seedGainMult} name="Fruit Gain Multi:"  />
                        </span>}
                        {data.garden.researches.typeTriangle && <span>
                        <DisplayNumber num={engine.garden.waterTimeMulti} name="Watering Time Multi:"  />
                        </span>}
                        {data.garden.researches.doomedSeeds && <span style={{display:'flex', flexDirection:'row'}}>
                        <span style={{flexBasis: '200px'}}>
                            Doom Gain Multi:
                        </span>
                        <DisplayDecimal decimal={engine.garden.doomFruitMult}/>

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
            {props.plant.water > 0 && percentOf(props.plant.water, MINUTE_MS)}
        </div>
    )
}

