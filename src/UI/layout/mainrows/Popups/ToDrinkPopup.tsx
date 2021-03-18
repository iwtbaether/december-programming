import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import JuiceCanvas from "../JuiceCanvas";
import { JuiceDisplay } from "../JuiceRow";



const ToDrinkPopup = (props: { data: Datamap }) => {
    const engine = gEngine;
    const data = props.data;
    return (
        <FlexColumn>
            <FlexRow>
                <FlexColumn>
                    <span>
                        CURRENT
                    </span>
                    <JuiceCanvas juices={data.juice.crushed} guide={data.juice.guide} />
                    <JuiceDisplay juiceData={data.juice.crushed} />
                </FlexColumn>
                <FlexColumn>
                    <span style={{width:'230px'}}>LAST</span>
                    {(data.juice.last_crushed && data.juice.last_guide) && <React.Fragment>
                    <JuiceCanvas juices={data.juice.last_crushed} guide={data.juice.last_guide} />
                    <JuiceDisplay juiceData={data.juice.last_crushed} />
                    </React.Fragment>
                    }

                </FlexColumn>
                
            </FlexRow>
            <div style={{display:'flex',justifyContent:'space-between'}}>
            <button onClick={engine.garden.juice.finishDrink}>
                Drink Juice & replace Last
            </button>
            <button onClick={engine.clearPopup}>
                Close
            </button>
            </div>
        </FlexColumn>
    )
}


export default ToDrinkPopup;
