import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import ListedResourceClass, { ListedNumber, ListedDecimal } from "../../ListedResourceClass";

const FruitResources = (props: { data: Datamap }) => {
    const data = props.data;
    const engine = gEngine;
    return (

                        <div style={{ display: "flex", flexDirection: 'column' }}>

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
                            {data.garden.juicin && <ListedResourceClass resource={engine.garden.plainFruit} />}
                            {data.garden.juicin && <ListedResourceClass resource={engine.garden.knowledgeFruit} />}
                            <hr />
                            {data.garden.researches.typeCircle && <ListedNumber resource={engine.garden.plantSpeedMult} middle name="Plant Growth Multi" />}
                            {data.garden.researches.typeBunch && <ListedNumber resource={engine.garden.fruitGainMult} middle name="Fruit Gain Multi" />}
                            {data.garden.researches.typeTriangle && <ListedDecimal resource={engine.garden.waterTimeMulti} name='Water Time Multi' />}
                            {data.garden.researches.doomedSeeds && <ListedDecimal resource={engine.garden.doomFruitMult} name='Doom Gain Multi' />}
                            {data.garden.researches.typeEgg && <ListedDecimal resource={engine.garden.gardenJobSpeedMult} name='Job Speed Multi' />}

                        </div>
    )
}

export default FruitResources;

