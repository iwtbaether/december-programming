import Decimal from 'break_infinity.js';
import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';
import { canCheat, MINUTE_MS, percentOf } from '../engine/externalfns/util';
import { SingleBuildingUI } from './BuildingsUI';
import { BasicCommandButton } from './comps/BasicCommand';
import DisplayDecimal from './DisplayDecimal';
import GardenRow from './GardenRow';
import ListedResourceClass from './ListedResourceClass';
import OptionsRow from './OptionsRow';
import ResearchUI from './ResearchUI';

export default class Game extends React.Component<{ data: Datamap }, {}> {


  render() {
    const data = this.props.data

    return (
      <div>
        //TODO: name game
        <hr />
        {data.unlocksStates.two > 0 && <React.Fragment>
          <NavRow data={data} />
          <hr />
        </React.Fragment>}
        {data.nav === 0 && <EnergyRow data={data} energy={data.cell.a} />}
        {data.nav === 1 && <DoomRow data={data} />}
        {data.nav === 3 && <GardenRow data={data} />}
        {data.nav === 2 && <StatsRow data={data} />}
        {data.nav === 4 && <OptionsRow data={data} />}
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
      {canCheat && <button onClick={() => gEngine.processDelta(MINUTE_MS * 10)}>
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
  const prize = gEngine.doomGain();


  return (
    <div style={{ position: 'relative' }}>
      <ListedResourceClass resource={gEngine.energyResource} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      {data.cell.doom.greaterThan(0) && <ListedResourceClass resource={gEngine.doom} />}
      Click Energy Gain: <DisplayDecimal decimal={clickGain} />, Hover Energy Gain: <DisplayDecimal decimal={activityGain} />
      <br />
      <button onClick={gEngine.energy.gatherEnergy} onSubmit={(ev) => { ev.preventDefault() }}>
        Gather Energy
      </button>
      <button onMouseEnter={() => gEngine.setActivity(1)} onMouseLeave={gEngine.clearActivity}>
        Gather Energy /s
      </button>
      <SingleBuildingUI building={gEngine.effort} />
      <SingleBuildingUI building={gEngine.drive} />
      <SingleBuildingUI building={gEngine.antiDrive} />
      <SingleBuildingUI building={gEngine.determination} />
      <br />
      <span>
        Goal: <DisplayDecimal decimal={goal} /> Energy,  </span>
      <span>Progress: {percentOf(data.cell.a.toNumber(), goal.toNumber())} | {data.unlocksStates.one}, </span>
      {data.unlocksStates.one >= 3 && <span>
        Consolation Prize: <DisplayDecimal decimal={prize} /> Doom
      </span>}
      <br />
      <button disabled={!reached} onClick={gEngine.energy.giveUp}>
        Give Up
      </button>
      <BasicCommandButton cmd={gEngine.gUL2} />
    </div>
  )
}

const DoomRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;


  return (
    <div>
      Doom Stuff<br />
      <ListedResourceClass resource={engine.doom} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      <SingleBuildingUI building={engine.doomUpgrade1} />
      <SingleBuildingUI building={engine.doomUpgrade2} />
      <SingleBuildingUI building={engine.doomUpgrade3} />
      <ResearchUI research={engine.research} />
    </div>
  )
}

const NavRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        {true && <button onClick={() => engine.setNav(0)}>Energy</button>}
        {data.unlocksStates.two > 0 && <button onClick={() => engine.setNav(1)}>Doom</button>}
        {data.unlocksStates.one >= 5 && <button onClick={() => engine.setNav(3)}>Garden</button>}
      </div>
      <div>
        {data.cell.swimmerNumber.greaterThan(10) && <button onClick={() => engine.setNav(2)}>Stats</button>}
        <button onClick={() => engine.setNav(4)} style={{ right: 0 }}>Options / Info</button>
      </div>
    </div>
  )
}


const StatsRow = (props: { data: Datamap }) => {
  const data = props.data;
  return (
    <div>
      Stats<br />
      You are attempt #<DisplayDecimal decimal={data.cell.swimmerNumber} />
    </div>
  )
}

