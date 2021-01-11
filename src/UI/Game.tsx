import React from 'react';
import { Datamap } from '../engine/Datamap';
import { BasicCommandButton } from './comps/BasicCommand';
import FlexRow from './comps/FlexRow';
import TipFC, { ChildTip, TipFC2 } from './comps/TipFC';
import DoomRow from './DoomRow';
import { EnergyRow } from './EnergyRow';
import ExchangeRow from './ExchangeRow';
import { FileButtons } from './FileButtons';
import GardenRow from './GardenRow';
import CraftingRow from './layout/CraftingRow';
import MagicRow from './MagicRow';
import { NavRow } from './NavRow';
import OptionsRow from './OptionsRow';
import { PopupRow } from './PopupRow';
import { StatsRow } from './StatsRow';
import JobsRow from './WorkRow';


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
        <div style={{flexGrow:1}}>
        {data.nav === 0 && <EnergyRow data={data} energy={data.cell.a} />}
        {data.nav === 1 && <DoomRow data={data} />}
        {data.nav === 3 && <GardenRow data={data} />}
        {data.nav === 5 && <JobsRow data={data} />}
        {data.nav === 6 && <CraftingRow data={data} />}
        {data.nav === 2 && <StatsRow data={data} />}
        {data.nav === 4 && <OptionsRow data={data} />}
        {data.nav === 7 && <ExchangeRow data={data}/>}
        {data.nav === 8 && <MagicRow data={data}/>}
        </div>
        <hr style={{width:'100%'}} />
        <FileButtons auto={data.autosave} last={data.last} />
        <PopupRow data={data} />
      </div>
    );
  }
}


