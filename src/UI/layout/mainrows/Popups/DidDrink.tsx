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



const DidDrink = (props: { data: Datamap }) => {
    const engine = gEngine;
    const data = props.data;
    const juices = data.juice.last_crushed;
    if (juices === undefined) return null;
    const guide = data.juice.last_guide;
    if (guide === undefined) return null;
    const powers = gEngine.garden.juice.drinkPowers;

    const BP = <DisplayNumber num={powers.basePower}/>
    const TODO = <span style={{color:'red'}}>[TODO]</span>

    return (
        <FlexColumn>
            <FlexRow>
                <FlexColumn>
                    <span>
                        The Juice you drank is providing you power!
                    </span>
                    <JuiceCanvas juices={juices} guide={guide} />
                    <JuiceDisplay juiceData={juices} />

                </FlexColumn>
                <FlexColumn>
                    <span>
                        JUICE STRENGTH (<span className='tippedText'>?<ChildTip>This determines the base value of Juice Powers</ChildTip></span>) 
                        : {BP}
                    </span>
                    <div style={{display:'flex',flexDirection:'column',color:'silver'}}>
                    {canCheat&&<div>
                        Silver Powers
                    </div>}
                    {/*bcest*/}
                    {powers.s1 && <span>
                        ‣ Plants take <DisplayDecimalAsPercent decimal={powers.s1.minus(1)}/> longer to grow and produce <DisplayDecimalAsPercent decimal={powers.s1.minus(1)}/> more Fruit
                    </span>}
                    {powers.s2 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.s2.minus(1)}/> more Gloom Production
                    </span>}
                    {powers.s3 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.s3.minus(1)}/> more Job Progress 
                    </span>}
                    {powers.s4 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.s4.minus(1)}/> more Hopper Storage
                    </span>}
                    {powers.s5 && <span>
                        ‣ Max Gardening Item Enchants +1
                    </span>}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',color:'gold'}}>
                    {canCheat&&<div>
                        Gold Powers
                    </div>}
                    {/*bcest*/}
                    {powers.g1 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.g1}/> more Power Generation
                    </span>}
                    {powers.g2 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.g2}/> faster Plant Growth
                    </span>}
                    {powers.g3 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.g3}/> more work gain from Job Prestige
                    </span>}
                    {powers.g4 && <span>
                        ‣ <DisplayDecimalAsPercent decimal={powers.g4} /> more Autoclickers
                    </span>}
                    {powers.g5 && <span>
                        ‣ +<DisplayDecimal decimal={powers.g5} /> Gardening Enchant Max Power
                    </span>}
                        
                    </div>
                    {powers.hd && <FlexColumn>
                        {canCheat&& <span>
                       HDPortion <DisplayDecimal decimal={powers.hd}/>
                            </span>}
                            {juices.hope.greaterThan(0) && <span>
                                ‣ <DisplayDecimalAsPercent decimal={powers.hd.times(powers.basePower)}/> more Energy Gain 
                                </span>}
                                {juices.doom.greaterThan(0) && <span>
                                    ‣ <DisplayDecimalAsPercent decimal={Decimal.minus(1,powers.hd).times(powers.basePower)}/> more Doom Gain
                                    </span>}
                    </FlexColumn>}
                </FlexColumn>
                

            </FlexRow>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <button onClick={engine.clearPopup}>
                    Close
            </button>
            </div>
        </FlexColumn>
    )
}


export default DidDrink;
