import Decimal from "break_infinity.js";
import React, { useState } from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import { GuideTypes } from "../../../engine/garden/Juice";
import CheatDiv from "../../comps/CheatDiv";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import ProgressBar from "../../comps/ProgressBar";
import DisplayDecimal from "../../DisplayDecimal";
import EquipmentRow from "./MagicRows/EquipmentRow";
import SpellsRow from "./MagicRows/SpellsRow";
import TodoRow from "./MagicRows/TodoRow";
import { DICT_name_to_color, SimpleSkillDiv } from "./SkillsRow";

export const spellBookNames = [
    'Not Influence',
    'Sara',
    'Trixie',
    'Rakozam'
]

export const coloredClasses = [
    '',
    'blue-text blue-border',
    'green-text green-border',
    'red-text red-border'
]

const MagicColor = DICT_name_to_color['Magic'];
const TabNames = ['Choose a Tab','Spells','Equipment','Todo']


const MagicRow = (props: { data: Datamap }) => {
    const mClass = gEngine.skillManager.skills.magic;
    const currentMana = props.data.magic.currentMana;
    const [tab, setTab] = useState(0)
    const [spells, setSpells] = useState(mClass.spellBook);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', gap: '10px' }}>
            <span style={{ fontWeight: 'bold', fontSize:'2em', color:MagicColor }}>
                Magic
            </span>
            <FlexRow>

            <SimpleSkillDiv skill={mClass} />
            <CheatDiv>

                <FlexRow>
                    <button onClick={() => { props.data.magic.spellbook = GuideTypes.none }}>clear book</button>
                    <button onClick={() => { props.data.magic.spellbook = GuideTypes.Sara }}>s book</button>
                    <button onClick={() => { props.data.magic.spellbook = GuideTypes.Guth }}>g book</button>
                    <button onClick={() => { props.data.magic.spellbook = GuideTypes.Zammy }}>z book</button>
                </FlexRow>
            </CheatDiv>
            <FlexColumn>

            <span>
                Mana: <DisplayDecimal decimal={currentMana} />/<DisplayDecimal decimal={mClass.maxMana.current} />
            </span>
            <CheatDiv>
                <FlexRow>
                    <button onClick={()=>{props.data.magic.currentMana = new Decimal(0)}}>
                        clear mana
                    </button>
                </FlexRow>
            </CheatDiv>
            <div style={{ width: '100px' }}>
                <ProgressBar color={DICT_name_to_color[mClass.name]} max={mClass.maxMana.current} current={currentMana} bg={'black'} />
            </div>
            <span>
                Mana Regen: +<DisplayDecimal decimal={mClass.manaRegen.current}/> /s
            </span>
            </FlexColumn>
            </FlexRow>

            <CheatDiv>
                <button onClick={() => {
                    gEngine.datamap.skillManager.magic.unlocked = false;
                    gEngine.notify();
                }}>
                    Lock magic
                </button>
            </CheatDiv>
            <FlexRow>
                <button onClick={()=>{
                    mClass.setSpellbook();
                    setSpells(mClass.spellBook)
                    setTab(1)
                }}>
                    Spells
                </button>
                <button onClick={()=>{setTab(2)}}>
                    Equipment
                </button>
                <CheatDiv>

                <button onClick={()=>{setTab(3)}}>
                    Todo
                </button>
                </CheatDiv>
            </FlexRow>
            <span style={{ fontWeight: 'bold', fontSize:'1.5em', color:MagicColor }}>
                {TabNames[tab]}
            </span>
            {tab===1 && <SpellsRow data={props.data} spells={spells}/>}
            {tab===2 && <EquipmentRow data={props.data}/>}
            {tab === 3 &&
                    <TodoRow data={props.data}/>
                      }
        </div>
    )
}

export default MagicRow;




