import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import { ChildTip } from "../../../comps/TipFC";
import JuiceCanvas from "../JuiceCanvas";
import { JuiceDisplay } from "../JuiceRow";



const DidDrink = (props: { data: Datamap }) => {
    const engine = gEngine;
    const data = props.data;
    const juices = data.juice.last_crushed;
    if (juices === undefined) return null;
    const guide = data.juice.last_guide;
    if (guide === undefined) return null;
    
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
                    JUICE STRENGTH (<span className='tippedText'>?<ChildTip>This determines the magnitude of other powers</ChildTip></span>): 
                    </span>
                    <div>
                        Silver Powers 
                    </div>
                </FlexColumn>
                
            </FlexRow>
            
            <div style={{display:'flex',justifyContent:'space-between'}}>
            
            <button onClick={engine.clearPopup}>
                Close
            </button>
            </div>
        </FlexColumn>
    )
}


export default DidDrink;
