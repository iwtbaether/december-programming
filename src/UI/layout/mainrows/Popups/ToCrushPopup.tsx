import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SeedType } from "../../../../engine/garden/Garden";
import { FULL_JOBS_LIST } from "../../../../engine/Jobs";
import FlexColumn from "../../../comps/FlexColumn";



const ToCrushPopup = (props: { data: Datamap }) => {
    const FJL = FULL_JOBS_LIST;
    const jobs = gEngine.jobs;

    return (
        <FlexColumn>
            <form onSubmit={submitFruitToCrush}>
                <select name="Fruit To Crush">
                    <option value={SeedType.hope}>Hope</option>
                    <option value={SeedType.circle}>Circular</option>
                    <option value={SeedType.square}>Square</option>
                    <option value={SeedType.bunch}>Bunched</option>
                    <option value={SeedType.triangle}>Triangular</option>
                    <option value={SeedType.doom}>Doom</option>
                    <option value={SeedType.egg}>Egg</option>
                    <option value={SeedType.plain}>Plain</option>
                    <option value={SeedType.knowledge}>Knowledge</option>
                </select>
                <button>Set</button>
            </form>
            <span>
                <button onClick={()=>{
                    gEngine.garden.juice.clearCrushedFruit();
                    gEngine.clearPopup();
                }}>
                    Clear
                </button>
            </span>
            <span>
                <button onClick={gEngine.clearPopup}>Close</button>
            </span>
        </FlexColumn>
    )
}

function submitFruitToCrush (ev:React.FormEvent<HTMLFormElement>) {
    let selectedType = (ev.currentTarget.childNodes[0] as HTMLSelectElement).value;
    let numType = parseInt(selectedType);
    //console.log(SeedType[numType]);
    gEngine.garden.juice.setCrushedFruit(numType);
    gEngine.clearPopup();
    
    ev.preventDefault();
}

export default ToCrushPopup;
