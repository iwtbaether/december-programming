import Decimal, { DecimalSource } from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import Patience_Skill, { SpiritualityLevelUnlocks } from "../../../../engine/skills/Patience";
import { SingleManagedSkill } from "../../../../engine/skills/SingleManagedSkill";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import ProgressBar from "../../../comps/ProgressBar";
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
  const patience = props.chosenSkill as Patience_Skill;

  const skillData = props.chosenSkill.getData();
  const data2 = patience.data2
  const color = DICT_name_to_color[props.chosenSkill.name];
  const now = Date.now();

  return (<FlexColumn>
    <div>
      <b>Gain Patience Experience</b> when you prestige a job with at least 1M progress.
    </div>
    <div>
      Patience levels give Patience Currency that can be used to make Patience Items.
    </div>
      <ProgressBar current={now-data2.lastClaim} max={patience.tokenTimer} bg='black' color='wheat' />
    <FlexRow>
      <button disabled={!patience.canClaim()} onClick={patience.claimTokens}>
        Claim PC
      </button>
      <span>
        Current PC: {data2.mtx}
      </span>
    </FlexRow>
    <FlexRow>
      <div style={{border:`1px solid ${color}`}}>
        Mushrooms 
      </div>
      <div style={{border:`1px solid ${color}`}}>
        Forms
      </div>

    </FlexRow>

  </FlexColumn>)
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
      Gain Spirituality XP each time you grab a seed.
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juicerUpgrades + 1}: Unlock Juicer Upgrades`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juicerUpgrades}
        />
      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juiceTrades + 1}: Unlock Juice Trades`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juiceTrades}
      />
      <ColorIfGtoE text={`Level ${SpiritualityLevelUnlocks.juiceEarlyUnlock + 1}: Unlock Juice without Harvesting a special fruit`}
        color={color} base={level} compare={SpiritualityLevelUnlocks.juiceEarlyUnlock} hideBefore={0}
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

const ColorIfGtoE = (props: { text: string, color: string, base: Decimal, compare: DecimalSource, hideBefore?: DecimalSource }) => {
  const { text, color, base, compare, hideBefore } = props;
  if (hideBefore) if (props.base.lessThan(hideBefore)) return null;
  const colored = base.greaterThanOrEqualTo(compare);

  return <span style={colored ? { color: color } : {}}>
    {text}
  </span>
}