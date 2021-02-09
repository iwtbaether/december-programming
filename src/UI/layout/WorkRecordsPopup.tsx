import Decimal from "break_infinity.js";
import React from "react";
import { gEngine } from "../..";
import { Datamap } from "../../engine/Datamap";
import { FULL_JOBS_LIST } from "../../engine/Jobs";
import FlexColumn from "../comps/FlexColumn";
import DisplayDecimal from "../DisplayDecimal";
import DisplayNumber from "../DisplayNumber";


const WorkRecordsPopup = (props: { data: Datamap }) => {
    const FJL = FULL_JOBS_LIST;
    const jobs = gEngine.jobs;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', color: 'white', backgroundColor: "black" }}>
            <FlexColumn>
                <span style={{ textAlign: 'center' }}>
                    Job Records
                </span>
                <RecordRow jobID={0} progress={jobs.data.notReset.records.zero} grant='seed gain speed multi' grantDec={new Decimal(jobs.seedGainSpeedMult)} />
                <RecordRow jobID={1} progress={jobs.data.notReset.records.grower} grant='seed gain count multi' grantDec={new Decimal(jobs.seedGainCountMult)} />
            <span> <button onClick={gEngine.clearPopup}>
                Close
            </button> </span>
            </FlexColumn>
        </div>)
}

const RecordRow = (props: { progress: Decimal, jobID: number, grant: String, grantDec: Decimal }) => {
    if (props.progress.eq(0)) return null;
    const job = FULL_JOBS_LIST[props.jobID]

    return (
        <div>
            {job.name}
            <br />
            Best {job.progressLabel}: <DisplayDecimal decimal={props.progress} /> {job.unitsLabel}
            <br />
            Granting {props.grant}: <DisplayDecimal decimal={props.grantDec} />
        </div>
    )
}

export default WorkRecordsPopup;
