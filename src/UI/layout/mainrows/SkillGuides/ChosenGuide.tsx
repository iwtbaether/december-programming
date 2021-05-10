import Decimal, { DecimalSource } from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import Magic_Skill from "../../../../engine/skills/Magic";
import { LevelAndDescription, MagicEquipmentLADs } from "../../../../engine/skills/MagicEquipment";
import Patience_Skill, { SpiritualityLevelUnlocks } from "../../../../engine/skills/Patience";
import { SingleManagedSkill } from "../../../../engine/skills/SingleManagedSkill";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import ProgressBar from "../../../comps/ProgressBar";
import { ChildTip } from "../../../comps/TipFC";
import { DICT_name_to_color } from "../SkillsRow";
import MagicGuide from "./MagicGuice";
import PatienceGuide from "./PatienceGuide";

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
      innerDiv = <FortitudeGuide skill={m.skills.fortitude} />
      break;

    case m.skills.spirituality:
      innerDiv = <SpiritualityGuide chosenSkill={m.skills.spirituality} />
      break;
    
    case m.skills.magic:
      innerDiv = <MagicGuide chosenSkill={m.skills.magic} />
      break;

    default:
      innerDiv = <span>{m.openGuide.name} not implemented yet. orz</span>;
      break;
  }

  return <div style={{ border: '2px solid', borderColor: color, padding: '5px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>

      <span style={{ color: color, fontSize: '1.3em' }}>
        {m.openGuide.name}
      </span>
      {m.openGuide?.canLevel() && <button style={{ color: color, borderColor: color }} onClick={m.openGuide.levelUp}>
        {`<<`}LEVEL UP{`>>`}
      </button>}
      <button onClick={m.closeSkill}>
        Close
                    </button>
    </div>
    {innerDiv}
  </div>
};

export default ChosenGuide;





const FortitudeGuide = (props: { skill: SingleManagedSkill }) => {
  const level = props.skill.getData().level;
  const color = DICT_name_to_color[props.skill.name]

  return (<FlexColumn>
    <div>
      <b>Gain Fortitude Experience</b> when you perform <span className='tippedText'>
        <ChildTip>
          Difficulty: 3XP<br />
        Gloom: 2XP<br />
        Rebirth: 1XP
      </ChildTip>significant resets
    </span>.
    </div>
    <div>
      You can also <button>Check in!</button> each day for Fortitude XP.
    </div>
    <div style={{display:'flex',flexDirection:'column'}}>
    <ColorIfGtoE
      text={'Level 1: Keep Exchange Upgrades'}
      color={color}
      base={level}
      compare={0}
      />
    <ColorIfGtoE
      text={'Level 2: Keep Some Job XP Upgrades'}
      color={color}
      base={level}
      compare={1}
      />
    <ColorIfGtoE
      text={'Level 3: Keep Some Garden Upgrades'}
      color={color}
      base={level}
      compare={2}
      />
      </div>

  </FlexColumn>)
}

const SpiritualityGuide = (props: { chosenSkill: SingleManagedSkill }) => {
  const skillData = props.chosenSkill.getData();
  const level = skillData.level;
  const color = DICT_name_to_color[props.chosenSkill.name]

  return (<FlexColumn>
    
    <div>
      <b>Gain Spirituality XP</b> each time you grab a seed.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juicerUpgrades + 1}: Unlock Juicer Upgrades`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juicerUpgrades}
        />
      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juiceTrades + 1}: Unlock Juice Trades`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juiceTrades}
      />
      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.startingHope + 1}: Start with ${level.toString()} Hope Fruit`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.startingHope}
      />
      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juiceEarlyUnlock + 1}: Unlock Juice without Harvesting a special fruit`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juiceEarlyUnlock}
      />
      {/** 
     
    <ColorIfGtoE text={'Level 30: Unlock Juice Items'}
      color={color} base={level} compare={29} hideBefore={19}
      />
    <ColorIfGtoE text={'Level 40: Unlock Juicer Crafting'}
      color={color} base={level} compare={39} hideBefore={29}
      />
    */}
    </div>

  </FlexColumn>)
}


export const ColorIfGtoE = (props: { text: string, color: string, base: Decimal, compare: DecimalSource, hideBefore?: DecimalSource }) => {
  const { text, color, base, compare, hideBefore } = props;
  if (hideBefore) if (props.base.lessThan(hideBefore)) return null;
  const colored = base.greaterThanOrEqualTo(compare);
  //BAD FOR PERFOMANCE, USE CLASSNAME DUMMY

  return <span style={colored ? { color: color } : {}}>
   {text}
  </span>
}

export const LadsToLevels = (props: {lads: LevelAndDescription[], color: string, base: Decimal}) => {
  const { lads, color, base} = props;
  return (<React.Fragment>
    {lads.map(((lad,index)=>{
      return <LevelText {...{lad, color, base}} key={index}/>
    }))}
  </React.Fragment>)
}

export const LevelText = (props: {lad: LevelAndDescription, color: string, base: Decimal}) => {
  const { lad, color, base} = props;
  const colored = base.greaterThanOrEqualTo(lad.level)
  //BAD FOR PERFOMANCE, USE CLASSNAME DUMMY
  return (<span style={colored ?{color:color}:{}}>
    Level {lad.level+1}: {lad.descrption}
  </span>)

}