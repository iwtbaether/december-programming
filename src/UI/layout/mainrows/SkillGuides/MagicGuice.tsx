import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import Magic_Skill from "../../../../engine/skills/Magic";
import { MagicEquipmentLADs } from "../../../../engine/skills/MagicEquipment";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import { DICT_name_to_color } from "../SkillsRow";
import { ColorIfGtoE, LadsToLevels } from "./ChosenGuide";

const MagicGuide = (props: { chosenSkill: Magic_Skill }) => {
    const skillData = props.chosenSkill.getData();
    const unlocks = props.chosenSkill.levelOfUnlocks;
    const level = skillData.level;
    const base = level;
    const color = DICT_name_to_color[props.chosenSkill.name]
  
    const manaRegenBonus = Decimal.max(0, level.minus(18)).times(.1).add(1)
  
    return (<FlexColumn>
      
      <div>
        <b>Gain Magic XP</b> from casting spells.
      </div>
      <FlexRow>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
  
        <span style={{textAlign:'center', fontWeight:"bold"}}>
          Spell Unlocks
        </span>
  
        <ColorIfGtoE text={`Level ${unlocks.growSkip+1}: Chulsaeng`}
          color={color} base={level} compare={unlocks.growSkip}
          />
  
  
  <ColorIfGtoE text={`Level ${unlocks.gardenTimeSkip+1}: Won-Ye`}
          color={color} base={level} compare={unlocks.gardenTimeSkip}
          />
  <ColorIfGtoE text={`Level ${unlocks.energyTimeSkip+1}: Eneo Ja Ijeu`}
          color={color} base={level} compare={unlocks.energyTimeSkip}
          />
  
  <ColorIfGtoE text={`Level ${unlocks.seedCreation+1}: Ssi`}
          color={color} base={level} compare={unlocks.seedCreation}
          />
  
  <ColorIfGtoE text={`Level ${unlocks.juiceTicks+1}: Abchag`}
          color={color} base={level} compare={unlocks.juiceTicks}
          />
  
          <span style={{textAlign:'center', fontWeight:"bold"}}>
          Stat Bonuses
          </span>
  
  <ColorIfGtoE text={`Level ${unlocks.maxMana+1}: Max Mana x${level.times(.1).add(1).toString()}`}
          color={color} base={level} compare={unlocks.maxMana}
          />
  
  <ColorIfGtoE text={`Level ${unlocks.manaRegen+1}: Mana Regen x${manaRegenBonus.toString()}`}
          color={color} base={level} compare={unlocks.manaRegen}
          />
  
          <span style={{textAlign:'center', fontWeight: 'bold'}}>Equipment</span>
          <LadsToLevels lads={EquipmentLads} {...{color, base}}/>
  
          <span style={{textAlign:'center', fontWeight: 'bold'}}>Crafting</span>
          <LadsToLevels lads={CraftingLads} {...{color, base}}/>
  
  
        
      </div>
          <FlexColumn>
            <button onClick={()=>{gEngine.setNav(8)}}>
              Use Magic
            </button>
          </FlexColumn>
        </FlexRow>
  
    </FlexColumn>)
  }
  
  export default MagicGuide;


const EquipmentLads = [
    MagicEquipmentLADs.hat,
    MagicEquipmentLADs.robe,
    MagicEquipmentLADs.wand,
    MagicEquipmentLADs.gloves,
    MagicEquipmentLADs.boots,
    MagicEquipmentLADs.orb,
    MagicEquipmentLADs.staff,
  ]
  const CraftingLads = [
      MagicEquipmentLADs.enchantplus1,
    MagicEquipmentLADs.enchantplus2,
    MagicEquipmentLADs.copperCreation,
  ]