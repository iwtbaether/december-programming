import React, { useState } from "react";
import { gEngine } from "../../../..";
import { ItemTypes } from "../../../../engine/m_st/Crafting";
import Patience_Skill, { SingleFormPower } from "../../../../engine/skills/Patience";
import { MDV2, PForm, PForm_Mods, PShroom, PShroom_Mods, ShroomTypes } from "../../../../engine/skills/PatienceItemTypes";
import { SingleManagedSkill } from "../../../../engine/skills/SingleManagedSkill";
import ConfirmCommandButton, { ConfirmBasicCommandButton } from "../../../comps/ConfirmCommandButton";
import FlexColumn from "../../../comps/FlexColumn";
import FlexRow from "../../../comps/FlexRow";
import ProgressBar from "../../../comps/ProgressBar";
import { ChildTip } from "../../../comps/TipFC";
import DisplayDecimal from "../../../DisplayDecimal";
import DisplayNumber from "../../../DisplayNumber";
import { ListedNumber } from "../../../ListedResourceClass";
import { OpenPopup } from "../Popups/ClosePopup";
import { DICT_name_to_color } from "../SkillsRow";
import { ColorIfGtoE } from "./ChosenGuide";


const PatienceGuide = (props: { chosenSkill: SingleManagedSkill }) => {
    const patience = props.chosenSkill as Patience_Skill;

    const skillData = props.chosenSkill.getData();
    const data2 = patience.data2
    const color = DICT_name_to_color[props.chosenSkill.name];
    const now = Date.now();
    const canFertalize = patience.canFertalize();
    const growTime = patience.getGrowTime();

    const cost = patience.getLootBoxCost();

    const [tab, chooseTab] = useState(0)
    const setTab0 = ()=>{chooseTab(0)}
    const setTab1 = ()=>{chooseTab(1)}

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' }}>

            <FlexColumn>
                <div>
                    <b>Gain Patience Experience</b> when you prestige a job with at least 1M progress.
              </div>
                <div>
                    Patience levels generate Patience Currency that can be used to make Patience Items.
                </div>
                {tab === 0 && <React.Fragment>
                <ProgressBar current={now - data2.lastClaim} max={patience.tokenTimer} bg='black' color='wheat' />
                <FlexRow>
                    <FlexColumn>
                        <button disabled={!patience.canClaim()} onClick={patience.claimTokens}>
                            Claim PC
        </button>
                        <button onClick={patience.useTokenGetLoot} disabled={data2.mtx < cost}>
                            Get PC Box Cost: {cost}
                        </button>
                        <button onClick={setTab1}>
                            Patience Levels
                        </button>
                    </FlexColumn>
                    <FlexColumn>
                        <span>
                            PC: <DisplayNumber num={data2.mtx} />
                        </span>
                        <DisplayDecimal decimal={data2.peace}>Peace: </DisplayDecimal>
                    </FlexColumn>
                    {data2.tempItems && <div style={{ border: '1px solid red' }}>
                        <span style={{ color: 'red' }}>
                            Choose [1] item to keep!
            </span>
                        <FlexRow>
                            {data2.tempItems.map((item, index) => {
                                return (<FlexColumn key={`PatienceTempItem${index}`}>
                                    <PItemDisplay item={item} />
                                    <button onClick={() => { patience.chooseItem(index) }}>
                                        Choose
                    </button>
                                </FlexColumn>
                                )
                            })}

                        </FlexRow>
                    </div>}
                </FlexRow>
                <span>
                    Inventory <span className='tippedText'><ChildTip>When your inventory is full, the oldest item is deleted to make room</ChildTip>({data2.storedItems.length}/5)</span>
                </span>
                <FlexRow>

                    {data2.storedItems.map((item, index) => {

                        return (<FlexColumn key={`storeditem${index}`}>
                            {item.itemType !== ItemTypes.PatienceMushroom && (
                                <ConfirmCommandButton 
                                    do={()=>{patience.equipFormByIndex(index)}}
                                    label='Equip'
                                    warning='WARNING: This will destroy your currently equiped form of this type'
                                />
                            )}
                            <PItemDisplay item={item} key={`PatienceStoredItem${index}`} />
                            {data2.equipedShroom === undefined && item.itemType === ItemTypes.PatienceMushroom && <button onClick={() => { patience.plantShroom(index) }}>
                                Plant Shroom
                    </button>}
                            {data2.equipedShroom !== undefined && item.itemType === ItemTypes.PatienceMushroom && <ConfirmBasicCommandButton
                                command={() => { patience.plantShroom(index) }} label='Plant Shroom'
                                children={'WARNING: This will destory your currently planted Mushroom, Fertalizer, and Flowers'}
                            />}
                            {data2.equipedShroom === undefined && item.itemType === ItemTypes.PatienceMushroom && <button onClick={() => { patience.plantShroom(index) }}>
                                Plant Shroom
                    </button>}
                            {item.itemType !== ItemTypes.PatienceMushroom && <button onClick={() => { patience.fertalize(index) }} disabled={!canFertalize}>
                                Fertalize
                    </button>}
                        </FlexColumn>)
                    })}
                </FlexRow>
                {data2.equipedShroom && <div style={{ backgroundColor: 'burlywood' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <FlexColumn>
                            {eqShroomTitle}
                            <PShroomDisplay item={data2.equipedShroom} />
                        </FlexColumn>
                        <FlexColumn>
                            <span style={{ color: 'black', textAlign: 'center' }}>Fertalizer {fertTip}</span>
                            {data2.fertalizer.map((fert, index) => {
                                return (<div key={`fert${index}`} style={{ display: 'flex', flexDirection: 'column', border: '2px solid black', backgroundColor: 'lightgreen', padding: '3px', margin: '3px' }}>
                                    <PFormDisplay item={fert[0]} />

                                    <button onClick={() => { patience.flower(index) }} disabled={data2.floweredForms !== undefined || (now - fert[1] < growTime)}>
                                        <ProgressBar current={now - fert[1]} max={growTime} color='wheat' bg='black' />
                                    </button>
                                </div>)
                            })}
                        </FlexColumn>
                        <FlexColumn>
                            <span style={{ color: 'black', textAlign: 'right' }}>Flowered Forms {flowerTip}</span>
                            {data2.floweredForms?.map((form, index) => {
                                return (

                                    <div key={`flower${index}`} style={{ backgroundColor: 'lightgreen', border: '2px solid black', padding: '3px', margin: '3px' }}>
                                        <PFormDisplay item={form} />
                                        <button onClick={() => { patience.chooseFlower(index) }}>
                                            Choose
                                </button>
                                    </div>
                                )
                            })}
                        </FlexColumn>
                    </div>
                </div>}

                </React.Fragment>}
                {tab === 1 && <FlexColumn>
                    <div>
                        <button onClick={setTab0}>
                            Go To Shrooms
                        </button>
                    </div>
                    <ColorIfGtoE
      text={`Level 1: Get ${skillData.level.add(1).toString()} (1 per level) PC per claim`}
      color={color}
      base={skillData.level}
      compare={0}
      />
                </FlexColumn>}


            </FlexColumn>

            <FlexColumn>
                <OpenPopup label='View Form Stats' open={8} />
                <OpenPopup label='Spend Peace' open={9} />

                <span style={{ textAlign: 'center' }}>
                    Equiped Forms <span className='tippedText'>
                        <ChildTip goLeft={true} >
                            Heavier forms cause the Plant of the matching type to grow slower and produce more fruit<br />
                            Forms modify what the matching fruit does. Forms don't affect anything except fruit effects.<br />
                            "Maximum Mana Lv 2" on a Triangular Form causes Triangular fruit to improve maximum mana.<br />
                            <span className='red-text'>Equipped Forms cannot be removed, only replaced</span>
                        </ChildTip>(?)
                    </span>
                </span>
                {data2.equipedForms.bunch && <PFormDisplay item={data2.equipedForms.bunch} />}
                {data2.equipedForms.circle && <PFormDisplay item={data2.equipedForms.circle} />}
                {data2.equipedForms.egg && <PFormDisplay item={data2.equipedForms.egg} />}
                {data2.equipedForms.square && <PFormDisplay item={data2.equipedForms.square} />}
                {data2.equipedForms.triangle && <PFormDisplay item={data2.equipedForms.triangle} />}

            </FlexColumn>


        </div>


    )
}

export default PatienceGuide;

const PItemDisplay = (props: { item: PShroom | PForm }) => {
    if (props.item.itemType === ItemTypes.PatienceMushroom) return (<PShroomDisplay item={props.item} />)
    else return (<PFormDisplay item={props.item} />)
}

const PShroomDisplay = (props: { item: PShroom }) => {
    const title = `${ShroomTypes[props.item.shroomType]} Shroom`.toLocaleUpperCase();
    const modList = props.item.mods ? props.item.mods.map(DisplayPShroomMod) : [];
    return <PItemWrapper title={title} modStrings={modList} />
}

const PItemWrapper = (props: { title: string, modStrings: string[] }) => {
    return (<div className='PItemWrapper'>
        <div>
            {props.title}
        </div>
        {props.modStrings.map((modstring, index) => <span key={`modstring${index}`}>
            {modstring}
        </span>)}
    </div>)
}


export const ItemWrapper = (props: { title: string, modsStrings?: string[], className: string }) => {
    return (<div className={props.className}>
        <div>
            {props.title}
        </div>
        {props.modsStrings && props.modsStrings.map((mod, index) => <span key={`modstring${index}`}>
            {mod}
        </span>)}
    </div>)
}

const PFormDisplay = (props: { item: PForm }) => {
    const title = `${ItemTypes[props.item.itemType]}`.toLocaleUpperCase();
    const modList = props.item.mods ? props.item.mods.map(DisplayPFormMod) : [];
    return <PItemWrapper title={title} modStrings={modList} />
}

function DisplayPShroomMod(mod: MDV2): string {
    if (mod.mod === PShroom_Mods.size) return `Size: ${mod.value}`;
    else if (mod.mod === PShroom_Mods.additionalSlots) return `${mod.mod}:${mod.value}`;
    else if (mod.mod === PShroom_Mods.moreGrowthSpeed) return `${mod.mod}:${mod.value}`;
    else if (mod.mod === PShroom_Mods.shroomPowerChance) return `${mod.mod}:${mod.value}`;
    else return ('unknown shroom mod')
}

export const DisplayFormPowers = (props: { fPowers: SingleFormPower, title: string }) => {
    const { fPowers, title } = { ...props };
    return (<React.Fragment>
        <span style={{ textAlign: 'center' }}>
            {title}
        </span>
        <ListedNumber name={'Weight'} resource={fPowers.weightGain} min={0} />
        <ListedNumber name={'Stronger Normal Power'} resource={fPowers.strongerRegularPower} min={0} />
        <ListedNumber name={'Stronger Extra Powers'} resource={fPowers.strongerExtraPowers} min={0} />
        <ListedNumber name={'Starting Count'} resource={fPowers.startCount} min={0} />
        <ListedNumber name={'More Matchning Fruit Gain'} resource={fPowers.moreOfType} min={0} />
        <ListedNumber name={'Fruit -> Doom Gain'} resource={fPowers.extraPowers.doom} min={0} />
        <ListedNumber name={'Fruit -> Energy Gain'} resource={fPowers.extraPowers.energy} min={0} />
        <ListedNumber name={'Fruit -> Fruit Gain'} resource={fPowers.extraPowers.fruit} min={0} />
        <ListedNumber name={'Fruit -> Gloom Gain'} resource={fPowers.extraPowers.gloom} min={0} />
        <ListedNumber name={'Fruit -> Juice Gain'} resource={fPowers.extraPowers.juice} min={0} />
        <ListedNumber name={'Fruit -> Max Mana'} resource={fPowers.extraPowers.mana} min={0} />
        <ListedNumber name={'Fruit -> Power Gain'} resource={fPowers.extraPowers.power} min={0} />
        <ListedNumber name={'Fruit -> Work Gain'} resource={fPowers.extraPowers.work} min={0} />
    </React.Fragment>)
}

function DisplayPFormMod(mod: MDV2): string {
    if (mod.mod === PForm_Mods.size) return `+${mod.value} Weight`;

    if (mod.mod === PForm_Mods.rebirthGain) return `+${mod.value} starting Fruit `;
    if (mod.mod === PForm_Mods.moreOfFormType) return `${mod.value}0% matching Fruit gain`;
    if (mod.mod === PForm_Mods.strongerRegularPower) return `${mod.value}% more Fruit effect`;
    if (mod.mod === PForm_Mods.strongerShroomPowers) return `${mod.value}% more Shroom effects`;

    if (mod.mod === PForm_Mods.fruitFromBase) return `Fruit Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.doomFromBase) return `Doom Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.workFromBase) return `Work Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.gloomFromBase) return `Gloom Gain Lv ${mod.value}`;
    if (mod.mod === PForm_Mods.juiceFromBase) return `Juice Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.powerFromBase) return `Power Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.energyFromBase) return `Energy Gain Lv.${mod.value}`;

    if (mod.mod === PForm_Mods.spores) return `${mod.value} Spore${(mod.value>1)?'s':''}`;

    else return (`ERROR ${PForm_Mods[mod.mod]}: ${mod.value}`)
}

const eqShroomTitle = <span style={{ textAlign: 'center', color: 'black' }}>

    Planted Mushroom <span className='tippedText'>
        <ChildTip>
            <span style={{ color: 'red' }}>
                Planting a new mushroom will destroy this mushroom, all fertalizer, and flowered forms
                </span>
            <br />
                Mushrooms use fertalizer to create new forms.<br />
                Smaller mushrooms are faster, but larger mushrooms can process more fertalizer at a time.
            </ChildTip>
        <span>(?)</span>
    </span>
</span>

const fertTip = <span className='tippedText'>
    <ChildTip>
        Eventually, each form used to fertalize the mushroom is regrown and augmented.<br />
        The new form won't finsh growing until you are ready to watch it.
    </ChildTip>
    (?)
</span>

const flowerTip = <span className='tippedText'>
    <ChildTip>
        <span style={{ color: 'red' }}>You can only choose one Flowered Form to keep!</span><br />
        Choose one newly augmented form to add to your inventory, the others wilt.<br />
    </ChildTip>
    (?)
</span>