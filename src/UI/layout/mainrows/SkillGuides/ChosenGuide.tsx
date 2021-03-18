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
      innerDiv = <FortitudeGuide skill={m.skills.fortitude} />
      break;

    case m.skills.spirituality:
      innerDiv = <SpiritualityGuide chosenSkill={m.skills.spirituality} />
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

const PatienceGuide = (props: { chosenSkill: SingleManagedSkill }) => {
  const skillData = props.chosenSkill.getData();
  const color = DICT_name_to_color[props.chosenSkill.name]

  return (<div>
    This is the {props.chosenSkill.name} guide!<br />
    <div>
      <b>Gain Patience Experience</b> when you prestige a job with at least 1M progress.
    </div>
    <div>
      Patience levels give Patience Currency that can be used to make Patience Items.
    </div>
    {skillData.level.eq(0) && <div>
      Patience level 1? Ouch. Was Patience your first skill?
    </div>}
  </div>)
}

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

  </FlexColumn>)
}

const SpiritualityGuide = (props: { chosenSkill: SingleManagedSkill }) => {
  const skillData = props.chosenSkill.getData();
  const level = skillData.level;
  const color = DICT_name_to_color[props.chosenSkill.name]

  return (<FlexColumn>
    <div>
      This is the {props.chosenSkill.name} guide!
    </div>
    <div>
      Gain Spirituality XP each time you grab a seed.
    </div>
    <div style={{display:'flex',flexDirection:'column'}}>

    <ColorIfGtoE text={'Level 1: Unlock Juice Trades'}
      color={color} base={level} compare={0}
      />
    <ColorIfGtoE text={'Level 10: Unlock Juicer Upgrades'}
      color={color} base={level} compare={9}
      />
    <ColorIfGtoE text={'Level 20: Unlock Juice without Harvesting a special fruit'}
      color={color} base={level} compare={19} hideBefore={9}
    />
    <ColorIfGtoE text={'Level 30: Unlock Juice Items'}
      color={color} base={level} compare={29} hideBefore={19}
      />
    <ColorIfGtoE text={'Level 40: Unlock Juicer Crafting'}
      color={color} base={level} compare={39} hideBefore={29}
      />
      </div>

  </FlexColumn>)
}

const ColorIfGtoE = (props: { text: string, color: string, base: Decimal, compare: DecimalSource, hideBefore?: DecimalSource }) => {
  const { text, color, base, compare, hideBefore } = props;
  if (hideBefore) if (props.base.lessThan(hideBefore)) return null;
  const colored = base.greaterThanOrEqualTo(compare);

  return <span style={colored ? { color: color } : {}}>
    {text}
  </span>
}