import Decimal from "break_infinity.js"
import React from "react"
import { ReactNode, useState } from "react"
import { gEngine } from "../../../.."
import { Datamap } from "../../../../engine/Datamap"
import { GuideTypes } from "../../../../engine/garden/Juice"
import { SpellClassInfo } from "../../../../engine/skills/Magic"
import FlexColumn from "../../../comps/FlexColumn"
import FlexRow from "../../../comps/FlexRow"
import { ShowGardenPlots } from "../GardenRow"
import { coloredClasses, spellBookNames } from "../MagicRow"
import { MakesJobsProgressBar } from "../WorkRow"

const SpellsRow = (props: {data: Datamap, spells: number[]}) => {
    const mClass = gEngine.skillManager.skills.magic;
    const [chosenSpell, setChosenSpell] = useState(0)
    const chosenSpellInfo = mClass.spellInfos[chosenSpell];
    const mana = props.data.magic.currentMana;
    return (
        <div>
            <FlexRow>

            <FlexColumn>
                <span className='skyblue-text'>Available Spells</span>
                {props.spells.map(spellID=>{
                    const infos = mClass.spellInfos[spellID];
                    const key = spellID+'ssi'
                    return <ShowSpellInfo {...{infos, setChosenSpell, chosenSpell, key, mana}}/>
                    //return <ShowSpellInfo infos={infos} setChosenSpell={setChosenSpell} chosenSpell={chosenSpell} key={key}/>
                })}
            </FlexColumn>
            <FlexColumn>
                <div className='skyblue-text'>
                Chosen Spell
                </div>
                <SpellExpando info={chosenSpellInfo} mana={mana}>
                {chosenSpell === 0 && <MakesJobsProgressBar data={props.data}/>}
                {chosenSpell === 6 && <ShowGardenPlots data={props.data} />}
                </SpellExpando>
            </FlexColumn>
                </FlexRow>
        </div>
    )
}

const ShowSpellInfo = (props: {infos: SpellClassInfo, setChosenSpell: any, chosenSpell: number}) => {

    return (
        <div className='ShowSpellInfo'>
            <span>
            {props.infos.name}
            </span>
            <button onClick={()=>{props.setChosenSpell(props.infos.id)}} className={props.chosenSpell===props.infos.id?'skyblue-text blue-border':''} >
                {`->`}
            </button>
        </div>
    )
}

const SpellExpando = (props: {info: SpellClassInfo, mana: Decimal, children?: ReactNode}) => {
    return (<div className='SpellExpando'>
        <span>
            <button onClick={props.info.action} className='skyblue-text' disabled={props.mana.lessThan(props.info.cost)}>
                CAST {props.info.name}
            </button>
        </span>
        <span>
            {Spell_Descriptions[props.info.id]}
        </span>
        <div className='SpellExpandoStats skyblue-text'>
            <span>Cost:</span>
            <span>XP Gain</span>
        </div>
        {props.children && <React.Fragment>
            <span>Effect Window</span>
            <div className='EffectWindow'>
                {props.children}
            </div>
        </React.Fragment>}
    </div>)
}

const Spell_Descriptions: string[] = [
    'Spend all of your mana to accelerate Growth',
    'Instantly recieve 1 hour of energy progress',
    'Instantly recieve 1 hour of garden progress',
    'Create 100 garden seeds',
    'Get 1000 instant Juicer ticks',

    'Sara Strikes your Juicer, filling it with power',
    'The Claws of Trixie harvest all of your plants, producing double fruit',
    'The Flames of Rakozam burn down all of your plants "for the xp"',
]


const SelectSpells = (props: {selectFn: VoidFunction}) => {
    return (<div>
        Spell
    </div>)
}

export default SpellsRow