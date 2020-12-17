import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import Engine from "../engine/Engine";
import { FULL_JOBS_LIST } from "../engine/Jobs";
import { SingleBuildingUI } from "./BuildingsUI";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";
import ListedResourceClass from "./ListedResourceClass";

const JobsRow = (props: { data: Datamap }) => {
  const data = props.data;
  const jobs = gEngine.jobs;
  const selectedJob = FULL_JOBS_LIST[jobs.data.jobID];
  const postResistance = jobs.calced.finalJobSpeed.div(jobs.calced.finalResitanceDiv)
  return (<div style={{display:'flex',flexDirection:'column'}}>
    <span>
      Current Job: Swimmer
    </span>
    <ListedResourceClass resource={jobs.workResource}/>
    {jobs.data.notReset.mechancProgession > 0 && <ListedResourceClass resource={jobs.xpResource}/>}
    <div>

    {data.jobs.work.eq(0) && <button onClick={jobs.convertToWork} disabled={jobs.data.converted}>
      Start
    </button>}
    {data.jobs.work.notEquals(0) && <button onClick={jobs.prestige} disabled={jobs.data.jobProgress.lessThan(10)}>
      Prestige
    </button>}
    {data.jobs.notReset.mechancProgession > 0 && <button onClick={jobs.spendXP}> Spend XP </button>}
    </div>

    <div>
      
    <SingleBuildingUI building={jobs.jobSpeed} />
    <SingleBuildingUI building={jobs.jobSpeedMult} />
    <SingleBuildingUI building={jobs.jobResistance} />
    </div>
    <span>
      Current {selectedJob.progressLabel}: <DisplayDecimal decimal={postResistance} /> /s
      {postResistance.greaterThan(100) && <span> Capped at 100/s </span>}
    </span>

    <span>
      {selectedJob.slowReason} slows progress by: x<DisplayDecimal decimal={Decimal.div(1,jobs.calced.finalResitanceDiv)}/>
    </span>
    {jobs.seedGainSpeedMult > 1 && <span style={{display:'flex'}}>
      Seed Gain Speed Multi: x<DisplayNumber num={jobs.seedGainSpeedMult} />
    </span>}
    <span>
    Current {selectedJob.unitsLabel}: <DisplayDecimal decimal={jobs.data.jobProgress}/>
    </span>
    <span>
    Best {selectedJob.unitsLabel}: <DisplayDecimal decimal={jobs.data.farthesthProgress}/>
    </span>
    <span>
    Goal {selectedJob.unitsLabel}: units //todo
    </span>
  </div>)
}

export default JobsRow;

