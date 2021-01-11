import React from "react";
import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import { FULL_JOBS_LIST } from "../engine/Jobs";
import { SingleBuildingUI } from "./BuildingsUI";
import ConfirmCommandButton from "./comps/ConfirmCommandButton";
import TipFC from "./comps/TipFC";
import DisplayDecimal from "./DisplayDecimal";
import DisplayNumber from "./DisplayNumber";
import ListedResourceClass, { ListedDecimal } from "./ListedResourceClass";

const JobsRow = (props: { data: Datamap }) => {
  const data = props.data;
  const jobs = gEngine.jobs;
  const selectedJob = FULL_JOBS_LIST[jobs.data.jobID];
  const postResistance = jobs.calced.finalJobSpeed.div(jobs.calced.finalResitanceDiv)
  const chargeSpeed = jobs.getChargeSpeed();
  return (<div style={{ display: 'flex', flexDirection: 'column' }}>
    <span>
      Current Job: Swimmer
    </span>
    <div>
      <ListedResourceClass resource={jobs.workResource} />
      <ListedDecimal resource={jobs.data.jobProgress} name={selectedJob.progressLabel} ps={postResistance.add(chargeSpeed)} />
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
        warning={<span>This will reset your job progress</span>}
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

      <div>
        <SingleBuildingUI building={jobs.chargeStorage} />
        {jobs.chargeStorage.info.hidden() === false && <span style={{position:'relative'}}>
          <button onClick={jobs.fillCharge}>Fill Charge</button>
          <TipFC tip={'Charge is drained to boost your job progress at equal rates\nCharge progress ignores resistance'}/>
          </span>
          }
        <SingleBuildingUI building={jobs.chargePower} />
        <SingleBuildingUI building={jobs.jobResistanceMult} />
      </div>

    </div>
    <span>
      Current Speed: <DisplayDecimal decimal={postResistance}  /> {selectedJob.unitsLabel}/s
      {postResistance.greaterThan(1000) && <span> Capped at 1000 {selectedJob.unitsLabel}/s </span>}
    {jobs.chargeStorage.count.greaterThan(0) && <span style={{marginLeft:'5px'}}>
      (+<DisplayDecimal decimal={jobs.getChargeSpeed()} /> {selectedJob.unitsLabel}/s from Charge)
    </span>}
    </span>
    <span>
      {selectedJob.slowReason} slows progress by: x1/<DisplayDecimal decimal={jobs.calced.finalResitanceDiv} />
    </span>
    {jobs.seedGainSpeedMult > 1 && <span style={{ display: 'flex' }}>
    </span>}
    <span>
      Current {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.jobProgress} />{selectedJob.unitsLabel} | Goal: <DisplayDecimal decimal={jobs.currentGoal()} /> {selectedJob.unitsLabel}
    </span>
    <span>
      Last {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.last} />
    </span>
    <span>
      Best {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.farthesthProgress} />
      (Giving Seed Gain Speed Multi: x<DisplayNumber num={jobs.seedGainSpeedMult} />)
    </span>
    <span>
    </span>
  </div>)
}

export default JobsRow;

