import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import FlexColumn from "./comps/FlexColumn";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";

const EnergyPopup = (props: { data: Datamap }) => {
    const em = gEngine.energyModule;
    return (
        <div style={{display:'flex',flexDirection:'column', color:'white',backgroundColor:"black"}}>
            <h4>Energy Gain Calculations</h4>
            <div style={{display:'flex',flexDirection:'row',minWidth:'500px',justifyContent:'space-between', width:'500px'}}>
                <FlexColumn>
                    <span>Type</span>
                    <span>Generic</span>
                    <span>Passive</span>
                    <span>Hover</span>
                    <span>Clicking</span>
                    <span>Autoclickers</span>
                </FlexColumn>
                <FlexColumn>
                    <span>Base</span>
                <DisplayDecimal decimal={em.energyGainBase} />
                <DisplayDecimal decimal={em.energyGainPerSecondBase()} />
                <DisplayDecimal decimal={em.energyGainFromActivityBase()} />
                <DisplayDecimal decimal={em.energyGainClickBase()} />
                <DisplayNumber  num={em.clickerCount}>

                </DisplayNumber>
                </FlexColumn>
                <FlexColumn>
                    <span>* Increased</span>
                    <DisplayDecimal decimal={em.totalEnergyGainIncreased} />
                </FlexColumn>
                <FlexColumn>
                    <span>* More</span>
                    <DisplayDecimal decimal={em.totalEnergyGainMore} />
                    <DisplayNumber num={em.energyEquipmentMods.passiveMore}>x</DisplayNumber>
                    <DisplayNumber num={em.energyEquipmentMods.hoverMore}>x</DisplayNumber>
                    <DisplayNumber num={em.energyEquipmentMods.clickMore}>x</DisplayNumber>
                </FlexColumn>
                <FlexColumn>
                    <span>= Total</span>
                    <span>&#8628;</span>
                    <DisplayDecimal decimal={em.energyGainPerSecondBase().times(em.energyGainMult).times(em.energyEquipmentMods.passiveMore)}></DisplayDecimal>
                    <DisplayDecimal decimal={em.energyGainFromActivity}></DisplayDecimal>
                    <DisplayDecimal decimal={em.energyPerClick}></DisplayDecimal>
                    <DisplayDecimal decimal={em.energyGainFromAutoClickers}></DisplayDecimal>
                </FlexColumn>
            </div>
            <div>
            <button onClick={gEngine.hotkeyManager.closePopup}>
                Close
            </button>
            </div>

        </div>)
}

export default EnergyPopup;
