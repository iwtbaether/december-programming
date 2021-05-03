import { Datamap } from "../../../../engine/Datamap"
import { GuideTypes } from "../../../../engine/garden/Juice"
import FlexColumn from "../../../comps/FlexColumn"
import { coloredClasses, spellBookNames } from "../MagicRow"

const EquipmentRow = (props: {data: Datamap}) => {
    return (
        <FlexColumn>
            {props.data.magic.spellbook !== GuideTypes.none &&
                <div>
                    <span className={coloredClasses[props.data.magic.spellbook]}>
                        Spellbook: {spellBookNames[props.data.magic.spellbook]}
                    </span>
                </div>
            }
        </FlexColumn>
    )
}

export default EquipmentRow