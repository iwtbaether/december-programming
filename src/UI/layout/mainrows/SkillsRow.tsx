import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { lockSkill, UnlockSkill } from "../../../engine/skills/SkillManager";
import { SingleManagedSkill } from "../../../engine/skills/SingleManagedSkill";
import { CEX } from "../../../engine/TheExchange";
import CheatDiv from "../../comps/CheatDiv";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import ProgressBar from "../../comps/ProgressBar";
import DisplayDecimal from "../../DisplayDecimal";
import { ListedNumber } from "../../ListedResourceClass";
import { NewSingleResearchUI, SingleResearchUI } from "../../ResearchUI";
import ChosenGuide from "./SkillGuides/ChosenGuide";

const ZERO = new Decimal(0);
const ONE = new Decimal(1);
const TEN = new Decimal(10)
const ONEK = new Decimal(1000)
const FOURM = new Decimal(4000000);

export const DICT_name_to_color: {[index:string]:string} = {
    'Matter':'Brown',
    'Energy':'Yellow',
    'Space':'Purple',
    'Time':'Wheat',

    'Spirituality':'Green',
    'Magic':'SkyBlue',
    'Patience':'LightGreen',
    'Fortitude':'Red',


}

let patienceUnlocked: boolean = false;

const SkillsRow = (props: { data: Datamap }) => {
    const manager = gEngine.skillManager
    return (
        <FlexRow>
            <FlexColumn>
                <span style={{ textAlign: "center" }}>
                Thetan
                </span>
                <SingleSkillDiv 
                    unlock={{ source: props.data.jobs.jobProgress, goal: FOURM, ulString: 'Reach Size' }}
                    skill={manager.skills.patience}
                />
                <SingleSkillDiv 
                    unlock={{ source: props.data.cell.swimmerNumber, goal: ONEK, ulString: 'Keep Trying',  }}
                    skill={manager.skills.fortitude}
                />
                
                <SingleSkillDiv 
                    unlock={{ source: props.data.cell.rebirth, goal: TEN, ulString: 'Reach Rebirth Level',  }}
                    skill={manager.skills.spirituality}
                />
                <SingleSkillDiv
                    unlock={{ source: (props.data.magic.spellbook !== null)?ONE:ZERO, goal: ONE, ulString: 'Get A Spellbook', }}
                    skill={manager.skills.magic}
                />
                <span style={{ textAlign: "center" }}>
                MEST
                </span>
                <SingleSkillDiv
                    unlock={{ source: ZERO, goal: ONEK, ulString: 'Own Spaces',  }}
                    skill={manager.skills.matter}
                />
                <SingleSkillDiv 
                    unlock={{ source: props.data.cell.aewf, goal: TEN, ulString: 'Reach Gloom Level', }}
                    skill={manager.skills.energy}
                />
                <SingleSkillDiv 
                    unlock={{ source: ZERO, goal: ONE, ulString: 'Achieve Presence',  }}
                    skill={manager.skills.space}
                />
                <SingleSkillDiv 
                    unlock={{ source: ZERO, goal: ONE, ulString: 'Skip a Day',   }}
                    skill={manager.skills.time}
                />
            </FlexColumn>
            
            {manager.openGuide && <FlexColumn>
                  
                <ChosenGuide data={props.data}/>
            </FlexColumn>}
        </FlexRow>
    )
}

export default SkillsRow;

interface SingleSkillDivProps {
    unlock: { source: Decimal, goal: Decimal, ulString: string },
    skill: SingleManagedSkill;
}



const SingleSkillDiv = (props: SingleSkillDivProps) => {
    const skillData = props.skill.getData();
    const locked = !skillData.unlocked;
    const disabled = props.unlock.goal.greaterThan(props.unlock.source);
    const color = DICT_name_to_color[props.skill.name];

    const displayLevel = skillData.level.add(1);

    let current, goal;
    if (locked) {
        current = props.unlock.source;
        goal = props.unlock.goal;
    } else {
        //current xp
        current = props.skill.getData().xp;
        //goal xp
        goal =  props.skill.reqXP;
    }
    return (
        <div style={{ border: `2px solid ${color}`, padding: '2px', width: '222px' }}>
            <div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ color: color, fontSize: '1.3em' }}>
                        {props.skill.name}
                    </span>

                    {/** Locked Button Div */}
                    {locked && <div>
                        {disabled && <button disabled={disabled}>
                            Unlock
                    </button>}
                        {!disabled && <button style={{ boxShadow: `0px 0px 2px 2px ${color}`, color: color }} onClick={()=>{UnlockSkill(props.skill)}}>
                            Unlock
                    </button>}
                    </div>}

                    {/** UNLocked Button Div */}
                    {!locked && <FlexRow>

                        <button style={{ color: color }} onClick={props.skill.open}>
                            Guide
                    </button>
                        <CheatDiv>
                            <button onClick={()=>{lockSkill(props.skill)}}>
                                D:L
                            </button>
                        </CheatDiv>
                    </FlexRow>}

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {locked && <span>
                        {props.unlock.ulString}
                    </span>}
                    {!locked && <span style={{ color:color}}>
                        {`Level: ${displayLevel.toNumber()}`}
                    </span>}
                    <span>
                        <DisplayDecimal decimal={current} />/<DisplayDecimal decimal={goal} />
                    </span>
                </div>
                <ProgressBar current={current} max={goal} bg={'black'} color={color} />
            </div>
        </div>
    )

    return (
        <div style={{ border: `2px solid ${color}`, padding: '2px', width: '222px' }}>
        </div>
    )
}

const SSD_Style: React.CSSProperties = {
    border: '1px solid',

}