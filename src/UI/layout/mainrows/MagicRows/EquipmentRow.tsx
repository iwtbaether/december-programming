import React from "react"
import { gEngine } from "../../../.."
import { Datamap } from "../../../../engine/Datamap"
import { GuideTypes } from "../../../../engine/garden/Juice"
import { ItemTypes } from "../../../../engine/m_st/Crafting"
import { MagicEquipmentLADs } from "../../../../engine/skills/MagicEquipment"
import { Wizard_Item_Mods } from "../../../../engine/skills/MagicEquipmentItemTypes"
import { IDV2, MDV2 } from "../../../../engine/skills/PatienceItemTypes"
import ConfirmCommandButton from "../../../comps/ConfirmCommandButton"
import FlexColumn from "../../../comps/FlexColumn"
import FlexRow from "../../../comps/FlexRow"
import { ListedNumber } from "../../../ListedResourceClass"
import { CraftingResourceColumn } from "../CraftingRow"
import { coloredClasses, spellBookNames } from "../MagicRow"
import { ItemWrapper } from "../SkillGuides/PatienceGuide"

const EquipmentRow = (props: { data: Datamap }) => {
    const eqClass = gEngine.skillManager.skills.magic.equipment;

    return (
        <FlexColumn>
            <FlexRow>
                <FlexColumn>
                    {props.data.skillManager.magic.level.greaterThan(4) && <div>
                        <CraftingResourceColumn data={props.data} />
                        <ListedNumber name={'Magical Scrap'} resource={props.data.magicEquipment.scrap} min={0} />
                    </div>}
                    {props.data.magic.spellbook !== GuideTypes.none &&
                        <div>
                            <span className={coloredClasses[props.data.magic.spellbook]}>
                                Spellbook: {spellBookNames[props.data.magic.spellbook]}
                            </span>
                        </div>
                    }
                    <span className='TitleText'>
                        Equipment Stats
                    </span>
                    <div>
                    <ListedNumber name='Max Mana' resource={eqClass.stats.flatMaxMana} min={0} />
                    <ListedNumber name='Increased Max Mana' resource={eqClass.stats.increasedMaxMana} min={0} />
                    <ListedNumber name='Mana Regen' resource={eqClass.stats.flatManaRegen} min={0} />
                    <ListedNumber name='Increased Mana Regen' resource={eqClass.stats.increasedManaRegen} min={0} />
                    </div>
                </FlexColumn>
                <FlexColumn>
                    <FlexRow>
                        <FlexColumn>
                            <button onClick={eqClass.makeRandomItem}>
                                Create Magic Item
                </button>
                            <span style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                Available
                </span>
                            {props.data.skillManager.magic.level.greaterThanOrEqualTo(MagicEquipmentLADs.hat.level) && <div>
                                Hat
                    </div>}
                            {props.data.skillManager.magic.level.greaterThanOrEqualTo(MagicEquipmentLADs.robe.level) && <div>
                                Robe
                    </div>}
                        </FlexColumn>
                        {props.data.magicEquipment.currentCraft && <React.Fragment>
                            <FlexColumn>
                                <button onClick={eqClass.enchantCurrentCraft}>
                                    Enchant Current Craft
                </button>
                            <button>
                                Reroll Implicit Value
                            </button>

                            </FlexColumn>
                            <FlexColumn>
                                <span style={{ textAlign: 'center' }}>
                                    Current Craft
                            </span>
                                <ItemWrapper className='Wizard-ItemWrapper'
                                    title={MagicItemTypeToTitle(props.data.magicEquipment.currentCraft.itemType)}
                                    modsStrings={props.data.magicEquipment.currentCraft.mods?.map(MagicModToString)} />
                            </FlexColumn>
                            <FlexColumn>
                                <button onClick={eqClass.equipCurrentCraft}>
                                    Equip Current Craft
                    </button>
                                <ConfirmCommandButton
                                    label={'Sell Current Craft'}
                                    warning={'This destroys your item and gives you currency\nShift+Click to bypass these warnings'}
                                    do={eqClass.clearCraft}
                                />

                            </FlexColumn>
                        </React.Fragment>}

                    </FlexRow>
                    <FlexRow>
                        {props.data.magicEquipment.hat && WrapMagicItem(props.data.magicEquipment.hat)}
                        {props.data.magicEquipment.robe && WrapMagicItem(props.data.magicEquipment.robe)}
                    </FlexRow>
                </FlexColumn>
            </FlexRow>

        </FlexColumn>
    )
}

function WrapMagicItem (item:IDV2) {
    return (
        <ItemWrapper className='Wizard-ItemWrapper'
        title={MagicItemTypeToTitle(item.itemType)}
        modsStrings={item.mods?.map(MagicModToString)} />
    )
}

export default EquipmentRow

export function MagicItemTypeToTitle(type: ItemTypes): string {
    if (type === ItemTypes.Wizard_Hat) return 'Wizard Hat'
    if (type === ItemTypes.Wizard_Robe) return 'Wizard Robe'
    return `Error, not a magic Item`
}

export function MagicModToString(mod: MDV2): string {
    if (mod.mod === Wizard_Item_Mods.flatmaxmana) return `+${mod.value} max Mana`
    if (mod.mod === Wizard_Item_Mods.increasedmaxmana) return `+${mod.value}% increased max Mana`
    if (mod.mod === Wizard_Item_Mods.flatmanaregen) return `+${mod.value * .1} Mana Regen`
    if (mod.mod === Wizard_Item_Mods.increasedmanaregen) return `+${mod.value}% increased Mana Regen`
    return 'error'
}