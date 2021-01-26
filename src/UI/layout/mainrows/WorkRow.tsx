import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import { FULL_JOBS_LIST } from "../../../engine/Jobs";
import { SingleBuildingUI } from "../../BuildingsUI";
import ConfirmCommandButton from "../../comps/ConfirmCommandButton";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import TipFC from "../../comps/TipFC";
import DisplayDecimal from "../../DisplayDecimal";
import DisplayNumber from "../../DisplayNumber";
import ListedResourceClass, { ListedDecimal } from "../../ListedResourceClass";

const JobsRow = (props: { data: Datamap }) => {
  const data = props.data;
  const jobs = gEngine.jobs;
  const selectedJob = FULL_JOBS_LIST[jobs.data.notReset.jobID];
  const postResistance = jobs.calced.finalJobSpeed.div(jobs.calced.finalResitanceDiv)
  const chargeSpeed = jobs.getChargeSpeed();
  const goal = jobs.currentGoal();
  const met = jobs.data.jobProgress.greaterThan(goal);
  return (<FlexColumn>
    <span>
      Current Job: {selectedJob.name}
    </span>
    <div>
      <ListedResourceClass resource={jobs.workResource} />
      <ListedDecimal resource={jobs.data.jobProgress} name={selectedJob.progressLabel} ps={postResistance.add(chargeSpeed)} />
      {jobs.data.notReset.chargeStorage.greaterThan(0) && <ListedResourceClass resource={jobs.chargeCurrent} />}
      {jobs.data.notReset.mechancProgession > 0 && <ListedResourceClass resource={jobs.xpResource} />}
    </div>
    <div>
      {canCheat && <div>
        <button onClick={()=>{jobs.changeJob(0)}}>job 0</button>  
      </div>}
      <button onClick={jobs.convertToWork} disabled={jobs.data.converted}>
        Get Work
    </button>
      <ConfirmCommandButton
        do={jobs.prestige}
        label={met?'Prestige, Goal reached':'Prestige'}
        warning={<span>This will reset your job progress</span>}
        disabled={jobs.data.jobProgress.lessThan(10)}
      />
      {data.jobs.notReset.mechancProgession > 0 && <button onClick={jobs.spendXP}> Spend XP </button>}
    </div>

    <FlexRow>

      <SingleBuildingUI building={jobs.jobSpeed} />
      <SingleBuildingUI building={jobs.jobSpeedMult} />
      <SingleBuildingUI building={jobs.jobResistance} />
      {data.jobs.notReset.mechancProgession >= 1 && <button className={data.jobs.notReset.rebuy ? "AutoOn" : 'AutoOff'} onClick={jobs.toggleRebuy}>
        Rebuy After Prestige
    </button>}
    </FlexRow>
    <FlexRow>
          <SingleBuildingUI building={jobs.jobResistanceMult} />
    </FlexRow>
    <FlexRow>
      

      
        <SingleBuildingUI building={jobs.chargeStorage} />
        {jobs.chargeStorage.info.hidden() === false && <span style={{position:'relative'}}>
          <button onClick={jobs.fillCharge}>Fill Charge</button>
          <TipFC tip={'Charge is drained to boost your job progress at equal rates\nCharge progress ignores resistance'}/>
          </span>
          }
        <SingleBuildingUI building={jobs.chargePower} />

    </FlexRow>
    <span>
      Current Speed: <DisplayDecimal decimal={postResistance}  /> {selectedJob.unitsLabel}/s
      {postResistance.greaterThan(1000) && <span> Capped at 1000 {selectedJob.unitsLabel}/s </span>}
    {jobs.chargeStorage.count.greaterThan(0) && <span style={{marginLeft:'5px'}}>
      (+<DisplayDecimal decimal={chargeSpeed} /> {selectedJob.unitsLabel}/s from Charge)
    </span>}
    </span>
    <span>
      {selectedJob.slowReason} slows progress by: x1/<DisplayDecimal decimal={jobs.calced.finalResitanceDiv} />
    </span>
    <span>
      Current {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.jobProgress} />{selectedJob.unitsLabel} | Goal
      : <DisplayDecimal decimal={goal} /> {selectedJob.unitsLabel}
    </span>
    {!met && <span>
      ETA: {}
    </span>}
    <span>
      Last {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.last} />
    </span>
    <span>
      Best {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.notReset.records.zero} />
      (Giving Seed Gain Speed Multi: x<DisplayNumber num={jobs.seedGainSpeedMult} />)
    </span>
    <span>
    </span>
  </FlexColumn>)
}

export default JobsRow;

