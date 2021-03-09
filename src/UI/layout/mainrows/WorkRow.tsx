import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import { FULL_JOBS_LIST } from "../../../engine/Jobs";
import { SingleBuildingUI } from "../../BuildingsUI";
import CalETA from "../../comps/CalETA";
import ConfirmCommandButton from "../../comps/ConfirmCommandButton";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import ProgressBar from "../../comps/ProgressBar";
import TipFC, { TipFC2 } from "../../comps/TipFC";
import DisplayDecimal from "../../DisplayDecimal";
import DisplayNumber from "../../DisplayNumber";
import ListedResourceClass, { ListedDecimal } from "../../ListedResourceClass";

const JobsRow = (props: { data: Datamap }) => {
  
  //O(1)
  const data = props.data;
  const jobs = gEngine.jobs;
  const selectedJob = FULL_JOBS_LIST[jobs.data.notReset.jobID];

  //O(n)
  const postResistance = jobs.calced.finalJobSpeed.div(jobs.data.jobProgress.add(1).times(jobs.calced.finalResitanceDiv));
  const chargeSpeed = jobs.getChargeSpeed();
  const goal = jobs.currentGoal();
  const met = jobs.data.jobProgress.greaterThan(goal);
  const cap = jobs.getCap();

  const speedWCharge = postResistance.add(chargeSpeed);

  const capped = speedWCharge.greaterThanOrEqualTo(cap);

  const finalSpeed = Decimal.min(cap,speedWCharge);

  const ETA = goal.sub(jobs.data.jobProgress).div(finalSpeed)


  return (<FlexColumn>
    <span>
      Current Job: {selectedJob.name}
    </span>
    <div>
      <ListedResourceClass resource={jobs.workResource} />
      <div className={capped?'orange-text':''}>
        <div>{/** for css (n)th */}</div>
      <ListedDecimal resource={jobs.data.jobProgress} name={selectedJob.progressLabel} ps={finalSpeed } />
      </div>
      {jobs.data.notReset.chargeStorage.greaterThan(0) && <ListedResourceClass resource={jobs.chargeCurrent} />}
      {jobs.data.notReset.mechancProgession > 0 && <ListedResourceClass resource={jobs.xpResource} />}
    </div>
    <FlexRow>
      {canCheat && <div>
        <button onClick={()=>{jobs.changeJob(0)}}>job 0</button>  
      </div>}
      {jobs.jobSpeed.count.lessThan(1) && jobs.workResource.count.lessThan(1) && <button onClick={jobs.convertToWork} disabled={jobs.data.converted}>
        Get Work
    </button>}
    {<div>
        <TipFC2>
        Last {selectedJob.progressLabel}: <DisplayDecimal decimal={jobs.data.last} />
        </TipFC2>
      <ConfirmCommandButton
        do={jobs.prestige}
        label={met?'Prestige, Goal reached':'Prestige'}
        warning={<span>This will reset your job progress</span>}
        disabled={jobs.data.jobProgress.lessThan(10)}
        />
        </div>}
      {data.jobs.notReset.mechancProgession > 0 && <button onClick={jobs.spendXP}> Spend XP </button>}
    <button onClick={()=>{gEngine.setPopup(3)}}>
      Records
    </button>
    </FlexRow>

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
    {<FlexRow>
      

      
        <SingleBuildingUI building={jobs.chargeStorage} />
        {jobs.chargeStorage.info.hidden() === false && <span style={{position:'relative'}}>
          <button onClick={jobs.fillCharge}>Fill Charge</button>
          <TipFC tip={'Charge is drained to boost your job progress at equal rates\nCharge progress ignores resistance'}/>
          </span>
          }
        <SingleBuildingUI building={jobs.chargePower} />

    </FlexRow>}
    <span>
      Current Speed: <DisplayDecimal decimal={postResistance}  /> {selectedJob.unitsLabel}/s
      {chargeSpeed.greaterThan(0.01) && <span>
      + <DisplayDecimal decimal={chargeSpeed} /> {selectedJob.unitsLabel}/s from Charge
      </span>}
      {capped && <span className='orange-text'> | Capped at {cap}  {selectedJob.unitsLabel}/s </span>}
    {jobs.chargeStorage.count.greaterThan(0) && <span style={{marginLeft:'5px'}}>
    </span>}
    </span>
    <span>
      {selectedJob.slowReason} slowing progress by: x1/<DisplayDecimal decimal={jobs.calced.finalResitanceDiv.times(data.jobs.jobProgress)} />
    </span>

          <div>

    <span style={{display:'flex',gap:'5px'}}>
      <span style={{width:'400px'}}>
      <ProgressBar current={data.jobs.jobProgress} max={goal} bg='black' color='orange'>
        Goal: <DisplayDecimal decimal={goal} /> {selectedJob.unitsLabel}, Progress:
      </ProgressBar>
      </span>
      <span>
      ETA: <CalETA ETAs={ETA}/> 
      </span>
    </span>
          </div>
    


  </FlexColumn>)
}



export default JobsRow;

