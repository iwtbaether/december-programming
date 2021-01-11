import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { SingleBuildingUI } from "./BuildingsUI";
import FlexRow from "./comps/FlexRow";
import ListedResourceClass from "./ListedResourceClass";
import { NewSingleResearchUI } from "./ResearchUI";

const DoomRow = (props: { data: Datamap }) => {
    const data = props.data;
    const engine = gEngine;
  
    return (
      <div>
        <ListedResourceClass resource={engine.doom} />
        {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
        {data.unlocksStates.two > 2 && <ListedResourceClass resource={gEngine.gloom} />}
        
        <FlexRow>
        <SingleBuildingUI building={engine.doomUpgrade1} />
        <SingleBuildingUI building={engine.doomUpgrade2} />
        <SingleBuildingUI building={engine.doomUpgrade3} />
        <SingleBuildingUI building={engine.doomResearch.doomGardenSpeed} />
        <SingleBuildingUI building={engine.doomResearch.doomJobSpeed} />
        </FlexRow>
          <FlexRow>

        <SingleBuildingUI building={engine.doomUpgrade4} />
        <SingleBuildingUI building={engine.doomUpgrade5} />
        <SingleBuildingUI building={gEngine.doomUpgrade6} />
        <SingleBuildingUI building={engine.doomUpgrade7} />
        <SingleBuildingUI building={engine.doomUpgrade8} />
          </FlexRow>
        
        <br/>
        <NewSingleResearchUI research={engine.doomResearch.gloomShard} />
      </div>
    )
  }

  export default DoomRow;