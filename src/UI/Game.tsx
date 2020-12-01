import Decimal from 'break_infinity.js';
import { last } from 'lodash';
import { relative } from 'path';
import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';
import Engine from '../engine/Engine';
import { SingleBuilding } from '../engine/externalfns/decimalInterfaces/SingleBuilding';
import { canCheat, HOUR_MS, MINUTE_MS } from '../engine/externalfns/util';
import { SingleBuildingUI } from './BuildingsUI';
import { BasicCommandButton } from './comps/BasicCommand';
import DisplayDecimal from './DisplayDecimal';
import DisplayNumber from './DisplayNumber';
import ListedResourceClass from './ListedResourceClass';

export default class Game extends React.Component<{ data: Datamap }, {}> {


  render() {
    const data = this.props.data

    return (
      <div>
        //TODO: name game
        <hr />
        {data.unlocksStates.two > 0 && <React.Fragment>
          <NavRow data={data}/>
          <hr/>
        </React.Fragment>}
        {data.nav === 0 && <EnergyRow data={data} energy={data.cell.a}/>}
        {data.nav === 1 && <DoomRow data={data} />}
        <hr />
        <FileButtons auto={data.autosave} last={data.last} />
      </div>
    );
  }
}

const FileButtons = (props: { last: number, auto: boolean }) => {
  return (
    <div>
      File:
      <button onClick={gEngine.save}>
        Save
          </button>
      <button onClick={gEngine.autosaveToggle}>
        Auto ({props.auto.toString()})
          </button>
      <button onClick={gEngine.load}>
        Load
          </button>
          <button onClick={gEngine.reset}>
            Reset
          </button>
          {canCheat && <button onClick={()=>gEngine.processDelta(MINUTE_MS)}>
            cheat</button>}
    </div>
  )
}

const EnergyRow = (props: { data: Datamap, energy: Decimal }) => {
  const data = props.data;
  const goal = gEngine.energy.unlockGoal();
  const reached = gEngine.energy.canGiveUp();
  const clickGain = gEngine.energyModule.energyPerClick();
  const activityGain = gEngine.energyModule.energyGainFromActivity();  


  return (
    <div style={{position:'relative'}}>
      <ListedResourceClass resource={gEngine.energyResource} />
      <ListedResourceClass resource={gEngine.doom} />
      <button onClick={gEngine.energy.gatherEnergy} onSubmit={(ev)=>{ev.preventDefault()}}>
        Gather (<DisplayDecimal decimal={clickGain}/>) Energy
      </button>
      <button onMouseEnter={()=>gEngine.setActivity(1)} onMouseLeave={gEngine.clearActivity}>
        Gather (<DisplayDecimal decimal={activityGain}/>) Energy /s
      </button>
      <SingleBuildingUI building={gEngine.effort} />
      <SingleBuildingUI building={gEngine.drive} />
      <br/>
      Goal: <DisplayNumber  num={goal}/>
      <button hidden={!reached} onClick={gEngine.energy.giveUp}>
        Give Up
      </button>
      <BasicCommandButton cmd={gEngine.gUL2}/>
    </div>
  )
}

const DoomRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;


  return (
    <div>
      Doom Stuff<br/>
      <ListedResourceClass resource={engine.doom}/>
      <SingleBuildingUI building={engine.doomUpgrade1}/>
    </div>
  )
}

const NavRow = (props: {data: Datamap}) => {
  const data = props.data;
  const engine = gEngine;
  return (
    <div>
      {true &&<button onClick={()=>engine.setNav(0)}>Energy</button>}
      {data.unlocksStates.two > 0 &&<button onClick={()=>engine.setNav(1)}>Doom</button>}
    </div>
  )
}