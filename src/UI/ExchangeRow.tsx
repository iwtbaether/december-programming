import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { CEX } from "../engine/TheExchange";
import { ListedNumber } from "./ListedResourceClass";

const ExchangeRow = (props: { data: Datamap }) => {
    const currency = props.data.crafting.currency
    const exchange = gEngine.theExchange;
    return (
        <div style={{display:'flex',flexDirection:'column', marginLeft:'10px',gap:'10px'}}>
            <span style={{fontWeight:'bold'}}>
            The Grand Exchange
            </span>
        <GERow>
        <ListedNumber resource={currency.transmutes} name={'Orb of Creation'} />
        <span> <button onClick={exchange.sellTrans}>Sell</button> {CEX.CEX_transToCopper} for 1 Copper Orb </span>
        <span> <button onClick={exchange.buyTrans}>Buy</button> {CEX.CEX_transToCopper - 1} for 1 Copper Orb </span>
        </GERow>
        <GERow>
        <ListedNumber resource={currency.augmentations} name={'Orb of Enchantment'} />
        <span> <button onClick={exchange.sellAug}>Sell</button> {CEX.CEX_augToCopper} for 1 Copper Orb </span>
        <span> <button onClick={exchange.buyAug}>Buy</button> {CEX.CEX_augToCopper - 1} for 1 Copper Orb </span>
        </GERow>
        <GERow>
        <ListedNumber resource={currency.doomShards} name={'Doom Shard'} />
        <span> Create 1 Doom Orb from 20 Shards </span>
        </GERow>
        <GERow>
            
        <ListedNumber resource={currency.doomOrbs} name={'Doom Pog'} />
        <span> <button onClick={exchange.sellDoom}>Sell</button> {CEX.CEX_doomToCopper} for 1 Copper Orb </span>
        <span> <button onClick={exchange.buyDoom}>Buy</button> {CEX.CEX_doomToCopper} for 1 Copper Orb </span>
        </GERow>

        <GERow>
        <ListedNumber resource={currency.chaos} name={'Copper Orb'} />
        <span>
            The common currency
        </span>
        </GERow>
        </div>
    )
}

export default ExchangeRow;



const GERow: React.FC<{}> = (props) => (
    <div style={{display:'flex',flexDirection:'column'}}>
        {props.children}
    </div>
)

