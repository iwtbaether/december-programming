import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import DisplayDecimal from "../../../DisplayDecimal";
import { ListedDecimal, ListedNumber } from "../../../ListedResourceClass";
import { DisplayFormPowers } from "../SkillGuides/PatienceGuide";
import ClosePopup from "./ClosePopup";



const FormStatsPopup = (props: { data: Datamap }) => {
    const patience = gEngine.skillManager.skills.patience;

    return ( <FlexColumn>

    <FlexRow>

<FlexColumn>
                <span style={{ textAlign: 'center' }}>
                    Form Base Power from Fruit count
        </span>

                <ListedNumber name={'Bunched Form Power'} resource={patience.powers.bPower} />
                <ListedNumber name={'Circular Form Power'} resource={patience.powers.cPower} />
                <ListedNumber name={'Egg Form Power'} resource={patience.powers.ePower} />
                <ListedNumber name={'Square Form Power'} resource={patience.powers.sPower} />
                <ListedNumber name={'Triangular Form Power'} resource={patience.powers.tPower} />
                <span style={{ textAlign: 'center' }}>
                    Form Effects
        </span>
                <DisplayFormPowers fPowers={patience.totalFormPowers.bunched} title={'Bunched'} />
                <DisplayFormPowers fPowers={patience.totalFormPowers.circular} title={'Circular'} />
                <DisplayFormPowers fPowers={patience.totalFormPowers.egg}  title={'Egg'}/>
                <DisplayFormPowers fPowers={patience.totalFormPowers.square}  title={'Square'}/>
                <DisplayFormPowers fPowers={patience.totalFormPowers.triangular} title={'Triangular'} />
                </FlexColumn>
                
                <FlexColumn>    
                <span style={{textAlign:'center'}}>
                    More Gain Totals from Forms
                </span>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.doom} name={'% More Doom Gain'} min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.energy} name={'% More Energy Gain'} min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.fruit} name={'% More Fruit Gain'}  min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.gloom} name={'% More Gloom Gain'}  min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.juice} name={'% More Juice Gain'}  min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.mana} name={'% More Mana Gain'}  min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.power} name={'% More Power Gain'}  min={0}/>
                <ListedDecimal resource={patience.totalFormPowers.totalExtraPowers.work} name={'% More Work Gain'}  min={0}/>
                
            </FlexColumn>
    </FlexRow>
                <span>
                    <ClosePopup/>
                </span>
    </FlexColumn>

    )
}

export default FormStatsPopup;
