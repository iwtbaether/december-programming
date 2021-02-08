import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { CEX } from "../../../engine/TheExchange";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import { ListedNumber } from "../../ListedResourceClass";
import { NewSingleResearchUI, SingleResearchUI } from "../../ResearchUI";

const ExchangeRow = (props: { data: Datamap }) => {
    const currency = props.data.crafting.currency
    const exchange = gEngine.theExchange;
    return (
        <div style={{display:'flex'}}>

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
        <FlexColumn>
            <FlexColumn>
            <span>Energy Upgrades</span>

            <FlexRow>
                <NewSingleResearchUI research={exchange.EU1} />
                <NewSingleResearchUI research={exchange.EU2} />
                <NewSingleResearchUI research={exchange.EU3} />
            </FlexRow>
            <FlexRow>
             <button>100% more Energy Gain (8)</button> <button>100% increased Energy Gain (9)</button><button>10% more Energy Gain(10)</button>
             <button>
                 Energy Pylon (11)
             </button>
            </FlexRow>
            </FlexColumn>
            <FlexColumn>
            <span>Doom Upgrades</span> 
                
            <FlexRow>
                <NewSingleResearchUI research={exchange.DU1} />
                <NewSingleResearchUI research={exchange.DU2} />
                <NewSingleResearchUI research={exchange.DU3} />
            </FlexRow>
            <FlexRow>
            <button>100% more Doom Gain (8)</button> <button>100% increased Doom gain (12)</button><button>10% more Doom Gain (12)</button>
            <button>
                Doom Obelisk (12)
            </button>

            </FlexRow>
            </FlexColumn>
            <FlexColumn>

            <span>Crafting Upgrades</span> 
            <FlexRow>
                <NewSingleResearchUI research={exchange.CU1} />
            </FlexRow>
            <FlexRow>
            <button>Unlock Unique Items (8)</button> <button>Unlock T2 Enchantments (13)</button>
            <button>
                Item Storage (14)
            </button>
            <button>
                Relic Creation (15)
            </button>
            </FlexRow>
            </FlexColumn>
            
            <FlexColumn>

                
            <span>Garden Upgrades</span> 
            <FlexRow>
                <NewSingleResearchUI research={exchange.GU1} />
            </FlexRow>
            <FlexRow>
            <button>
                Seed Gain (9)
            </button>
            <button>Discard Aversion (11)</button> <button>Ascension (16)</button> <button>100% more Garden Speed (17)</button> <button>100% increased Garden Speed (17)</button>
            <button>10% more Garden Speed</button>
            </FlexRow>
            </FlexColumn>
            <FlexColumn>
            <span>Jobs Upgrades</span>
            <div>
            <NewSingleResearchUI research={exchange.JU11} />
            </div>
            <span>

            <button>100% more Work Gain (9)</button> <button>100% increased Work Gain (18)</button><button>10% more Work Gain (18)</button>
            </span>
            <div>
            <NewSingleResearchUI research={exchange.JU12} />
            </div>
            <span>
            <button>100% more Progress Gain (9)</button> <button>100% increased Progress Gain (19)</button><button>10% more Progress Gain (19)</button>
            </span>
            <div>
            <NewSingleResearchUI research={exchange.JU13} />
            </div>
            <span>
                <button>
                Job #1 Completion (9)
                </button>
            </span>

            </FlexColumn><FlexColumn>
            <span>Spellbook Upgrades</span> 
            <FlexRow>

            <button>Unlock Spellbook Crafting (20)</button>
            <button>
                Pages +1 (21)
            </button>
            <button>
                Pages +1 (23)
            </button>
            <button>
                Pages +1 (24)
            </button>
            <button>
                Pages +1 (25)
            </button>
            
            </FlexRow>
            </FlexColumn>
        </FlexColumn>
        </div>
    )
}

export default ExchangeRow;



const GERow: React.FC<{}> = (props) => (
    <div style={{display:'flex',flexDirection:'column'}}>
        {props.children}
    </div>
)

