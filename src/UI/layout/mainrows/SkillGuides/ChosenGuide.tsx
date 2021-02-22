import Decimal, { DecimalSource } from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SingleManagedSkill } from "../../../../engine/skills/SingleManagedSkill";
import FlexColumn from "../../../comps/FlexColumn";
import { ChildTip } from "../../../comps/TipFC";
import { DICT_name_to_color } from "../SkillsRow";

const ChosenGuide = (props: { data: Datamap }) => {
  const m = gEngine.skillManager
  if (m.openGuide === undefined) return null;

  let innerDiv = <span>Uh oh, this isn't working</span>
  const color = DICT_name_to_color[m.openGuide.name]

  switch (m.openGuide) {
    case m.skills.patience:
        innerDiv = <PatienceGuide chosenSkill={m.skills.patience} />
        break;

    case m.skills.fortitude: 
      innerDiv = <FortitudeGuide skill={m.skills.fortitude}/>
      break;
  
    default:
      innerDiv = <span>{m.openGuide.name} not implemented yet. orz</span>;
      break;
  }

  return <div style={{border:'2px solid',borderColor:color, padding: '5px'}}>
    <div style={{display:'flex',justifyContent:'space-between'}}>

    <span style={{ color: color, fontSize: '1.3em' }}>
                        {m.openGuide.name}
                    </span>
                    <button onClick={m.closeSkill}>
                        Close
                    </button>  
    </div>
    {innerDiv}
  </div>
};

export default ChosenGuide;

const PatienceGuide = (props: {chosenSkill: SingleManagedSkill}) => {
  const color = DICT_name_to_color[props.chosenSkill.name]
  
  return (<div>
    This is the {props.chosenSkill.name} guide!<br/>
    <div>
    <b>Gain Patience Experience</b> when you prestige a job with at least 1M progress.
    </div>
    <div>
      Patience levels give Patience Currency that can be used to make Patience Items.
    </div>
    <div>

    </div>
  </div>)
}

const FortitudeGuide = (props: {skill: SingleManagedSkill}) => {
  const level = props.skill.getData().level;
  const color = DICT_name_to_color[props.skill.name]

  return (<FlexColumn>
    <div>
    <b>Gain Fortitude Experience</b> when you perform <span className='tippedText'> 
      <ChildTip>
        Difficulty: 3XP<br/>
        Gloom: 2XP<br/>
        Rebirth: 1XP
      </ChildTip>significant resets
    </span>.
    </div>
    <ColorIfGtoE
      text={'Level 0: Keep Exchange Upgrades'}
      color={color}
      base={level}
      compare={0}
    />
    <ColorIfGtoE
      text={'Level 1: Keep Some Job XP Upgrades'}
      color={color}
      base={level}
      compare={1}
    />
    <ColorIfGtoE
      text={'Level 2: Keep Some Garden Upgrades'}
      color={color}
      base={level}
      compare={2}
    />
    
  </FlexColumn>)
}

const ColorIfGtoE = (props: {text: string, color: string, base: Decimal, compare: DecimalSource}) => {
  const colored = props.base.greaterThanOrEqualTo(props.compare);
  
  return <span style={colored?{color:props.color}:{}}>
    {props.text}
  </span>
}