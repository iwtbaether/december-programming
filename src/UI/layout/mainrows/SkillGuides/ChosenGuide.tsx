import React from "react";
import { gEngine } from "../../../..";
import { Datamap } from "../../../../engine/Datamap";
import { SingleManagedSkill } from "../../../../engine/skills/SingleManagedSkill";

const ChosenGuide = (props: { data: Datamap }) => {
  const m = gEngine.skillManager
  if (m.openGuide === undefined) return null;

  let innerDiv = <span>Uh oh, this isn't working</span>
  switch (m.openGuide) {
    case m.skills.patience:
        innerDiv = <PatienceGuide patience={m.skills.patience} />
        break;
  
    default:
      innerDiv = <span>{m.openGuide.name} not implemented yet. orz</span>;
      break;
  }

  return <div>
    {innerDiv}
  </div>
};

export default ChosenGuide;

const PatienceGuide = (props: {patience: SingleManagedSkill}) => {
  return (<div>
    This is the {props.patience.name} guide!<br/>
    Gain Patience experience when you prestige a job with at least 1M progress.
  </div>)
}