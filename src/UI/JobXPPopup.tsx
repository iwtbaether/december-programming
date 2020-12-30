import { gEngine } from "..";
import { Datamap } from "../engine/Datamap";
import Engine from "../engine/Engine";
import { SingleResearch } from "../engine/Research";
import { SingleBuildingUI } from "./BuildingsUI";
import DisplayDecimal from "./DisplayDecimal";
import { NewSingleResearchUI, SingleResearchUI } from "./ResearchUI";

const JobXPPopup = (props: { data: Datamap }) => {
    const data = props.data;
    return (
        <div style={{display:'flex',flexDirection:'column', color:'white',backgroundColor:"black"}}>
            
            <span style={{color:"white"}}>
    Spend <DisplayDecimal decimal={data.jobs.notReset.xp}/> XP
            </span>

            <div style={{display:'flex'}}>
                <div>
                    Job Upgrades
                </div>
                    <SingleBuildingUI building={gEngine.jobs.workRewardBuilding}/>
                    <SingleBuildingUI building={gEngine.jobs.jobSpeedXPBuilding}/>
                <SingleBuildingUI building={gEngine.jobs.resistanceUpgradeBuilding} />
                <NewSingleResearchUI research={gEngine.jobs.res_jobs1_morexp} />
                {/*<NewSingleResearchUI research={gEngine.jobs.res_jobs2_levels} />*/}
            </div>

            <div style={{display:'flex'}}>
                <div>
                    Garden Upgrades
                </div>
                <NewSingleResearchUI research={gEngine.jobs.res_doubleWatering} />
                <NewSingleResearchUI research={gEngine.jobs.res_doubleWateringAgain} />
                <NewSingleResearchUI research={gEngine.jobs.res_g3_plusPlot} />
                <NewSingleResearchUI research={gEngine.jobs.res_g4_plusSlot} />
            </div>

            <div style={{display:'flex'}}>
                <div>
                    Doom Upgrades
                </div>
            <NewSingleResearchUI research={gEngine.jobs.res_doom1_autoclickers} />
            <NewSingleResearchUI research={gEngine.jobs.res_doom2_letsPrestige} />
            </div>

            <div style={{display:'flex'}}>
                <div>
                    Energy Upgrades
                </div>
            <NewSingleResearchUI research={gEngine.jobs.res_energy1_nextReset} />
            </div>
            <span>

            <button onClick={gEngine.clearPopup}>
                close
            </button>
            </span>
            
        </div>)
}

export default JobXPPopup;

const ColoredResearchDisplay = (props: {research: SingleResearch}) => {

    return (
        <div>
            whoops
        </div>
    )
}