import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { FULL_JOBS_LIST } from "../engine/Jobs";
import { SingleBuildingUI } from "./BuildingsUI";
import ConfirmCommandButton from "./comps/ConfirmCommandButton";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";
import ListedResourceClass from "./ListedResourceClass";

const JobsRow = (props: { data: Datamap }) => {
  const data = props.data;
  const jobs = gEngine.jobs;
  const selectedJob = FULL_JOBS_LIST[jobs.data.jobID];
  const postResistance = jobs.calced.finalJobSpeed.div(jobs.calced.finalResitanceDiv)
  return (<div style={{ display: 'flex', flexDirection: 'column' }}>
    <span>
      Current Job: Swimmer
    </span>
    <div>
      <ListedResourceClass resource={jobs.workResource} />
      {jobs.data.notReset.chargeStorage.greaterThan(0) && <ListedResourceClass resource={jobs.chargeCurrent} />}
      {jobs.data.notReset.mechancProgession > 0 && <ListedResourceClass resource={jobs.xpResource} />}
    </div>
    <div>

      <button onClick={jobs.convertToWork} disabled={jobs.data.converted || jobs.data.work.greaterThan(0)}>
        Start
    </button>
      <ConfirmCommandButton
        do={jobs.prestige}
        label={'Prestige'}
        warning={'This will reset your job progress'}
        disabled={jobs.data.jobProgress.lessThan(10)}
      />
      {data.jobs.notReset.mechancProgession > 0 && <button onClick={jobs.spendXP}> Spend XP </button>}
    </div>

    <div>

      <SingleBuildingUI building={jobs.jobSpeed} />
      <SingleBuildingUI building={jobs.jobSpeedMult} />
      <SingleBuildingUI building={jobs.jobResistance} />
      {data.jobs.notReset.mechancProgession >= 1 && <button className={data.jobs.notReset.rebuy ? "AutoOn" : 'AutoOff'} onClick={jobs.toggleRebuy}>
        Rebuy After Prestige
    </button>}

      <div style={{ display: 'flex' }}>
        <SingleBuildingUI building={jobs.chargeStorage} />
        {jobs.chargeStorage.count.greaterThan(0) && <button onClick={jobs.fillCharge}>Fill Charge</button>}
        <SingleBuildingUI building={jobs.chargePower} />
        <SingleBuildingUI building={jobs.jobResistanceMult} />
      </div>

    </div>
    <span>
      Current {selectedJob.progressLabel}: <DisplayDecimal decimal={postResistance} /> /s
      {postResistance.greaterThan(1000) && <span> Capped at 1000/s </span>}
    </span>
    {jobs.chargeStorage.count.greaterThan(0) && <span>
      Charging at <DisplayDecimal decimal={jobs.getChargeSpeed()} /> /s
    </span>}
    <span>
      {selectedJob.slowReason} slows progress by: x1/<DisplayDecimal decimal={jobs.calced.finalResitanceDiv} />
    </span>
    {jobs.seedGainSpeedMult > 1 && <span style={{ display: 'flex' }}>
      Seed Gain Speed Multi: x<DisplayNumber num={jobs.seedGainSpeedMult} />
    </span>}
    <span>
      Current {selectedJob.unitsLabel}: <DisplayDecimal decimal={jobs.data.jobProgress} />
    </span>
    <span>
      Last {selectedJob.unitsLabel}: <DisplayDecimal decimal={jobs.data.last} />
    </span>
    <span>
      Best {selectedJob.unitsLabel}: <DisplayDecimal decimal={jobs.data.farthesthProgress} />
    </span>
    <span>
      Goal {selectedJob.unitsLabel}: 10k
    </span>
  </div>)
}

export default JobsRow;

