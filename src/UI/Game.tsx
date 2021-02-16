import React from "react";
import { Datamap } from "../engine/Datamap";
import { FileButtons } from "./layout/FileButtons";
import CraftingRow from "./layout/mainrows/CraftingRow";
import DoomRow from "./layout/mainrows/DoomRow";
import { EnergyRow } from "./layout/mainrows/EnergyRow";
import ExchangeRow from "./layout/mainrows/ExchangeRow";
import GardenRow from "./layout/mainrows/GardenRow";
import MagicRow from "./layout/mainrows/MagicRow";
import { NavRow } from "./layout/mainrows/NavRow";
import OptionsRow from "./layout/mainrows/OptionsRow";
import { PopupRow } from "./layout/mainrows/PopupRow";
import SkillsRow from "./layout/mainrows/SkillsRow";
import { StatsRow } from "./layout/mainrows/StatsRow";
import JobsRow from "./layout/mainrows/WorkRow";



export default class Game extends React.Component<{ data: Datamap }, {}> {


  render() {
    const data = this.props.data

    return (
      <div className='Game'>
        //TODO: name game
        <hr style={{width:'100%'}} />
        {data.unlocksStates.two > 0 && <React.Fragment>
          <NavRow data={data} />
        <hr style={{width:'100%'}} />
        </React.Fragment>}
        <div style={{flexGrow:1, paddingLeft:'5px',overflow:'hidden',overflowY:'auto'}}>
        {data.nav === 0 && <EnergyRow data={data} energy={data.cell.a} />}
        {data.nav === 1 && <DoomRow data={data} />}
        {data.nav === 3 && <GardenRow data={data} />}
        {data.nav === 5 && <JobsRow data={data} />}
        {data.nav === 6 && <CraftingRow data={data} />}
        {data.nav === 2 && <StatsRow data={data} />}
        {data.nav === 4 && <OptionsRow data={data} />}
        {data.nav === 7 && <ExchangeRow data={data}/>}
        {data.nav === 8 && <MagicRow data={data}/>}
        {data.nav === 9 && <SkillsRow data={data}/>}
        </div>
        <hr style={{width:'100%'}} />
        <FileButtons auto={data.autosave} last={data.last} />
        <PopupRow data={data} />
      </div>
    );
  }
}


