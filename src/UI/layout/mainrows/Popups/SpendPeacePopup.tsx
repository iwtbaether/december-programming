import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import { SingleBuildingUI } from "../../../BuildingsUI";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import DisplayDecimal from "../../../DisplayDecimal";
import { ListedNumber } from "../../../ListedResourceClass";
import { Discord } from "../OptionsRow";
import { DisplayFormPowers } from "../SkillGuides/PatienceGuide";
import ClosePopup from "./ClosePopup";



const SpendPeacePopup = (props: { data: Datamap }) => {
    const patience = gEngine.skillManager.skills.patience;
    const claimed = patience.data2.claimedBoxes;

    return (
        <FlexColumn>

        <FlexRow>
            <FlexColumn>
                <span style={{fontSize:'1.2em'}}>
                    Prestige
                </span>
                <span>
                    Reseting Patience allows you to acquire<br/>
                    boxes faster again, unallocates spent Peace,<br/>
                    and gives fortitude experience.
                </span>
                <span className='red-text'>
                    LOSE Patience Forms and Shrooms 
                </span>
                <span className='green-text'>
                    Keep Peace and refund spent Peace
                </span>
                <span className='yellow-text'>
                    Requires 20 opened boxes
                </span>
                <button onClick={patience.prestige}>
                    Prestige (+{claimed} Fortitude xp)
                </button>
            </FlexColumn>
            <FlexColumn>
                <span style={{fontSize:'1.2em'}}>
                    Upgrades
                </span>
                <SingleBuildingUI building={patience.building_FormAugmentaionPower}  />
                <button>
                    Form Augmentation Power
                </button>
                <button>
                    Persistant Autoclickers
                </button>
                <button>
                    Unlock Mana Mushroom
                </button>
                <button>
                    Double Chance of Shrooms
                </button>
                <button>
                    Unlock Shroom Crafting
                </button>
            </FlexColumn>
            <FlexColumn>
                <span>

                This whole popup is WIP/Drawing board. It does nothing!
                </span>
                <span>
                    Come suggest stuff in <Discord/> :)
                </span>
            </FlexColumn>
        </FlexRow>
                <span>

                <ClosePopup/>
                </span>
        </FlexColumn>

    )
}

export default SpendPeacePopup;
