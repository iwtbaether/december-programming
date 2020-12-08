import Decimal from 'break_infinity.js';
import { last } from 'lodash';
import { relative } from 'path';
import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';
import Engine from '../engine/Engine';
import { SingleBuilding } from '../engine/externalfns/decimalInterfaces/SingleBuilding';
import { canCheat, HOUR_MS, MINUTE_MS, percentOf } from '../engine/externalfns/util';
import { GardenPlant, SeedGrowthTimeRequired, SeedType, TimeRequiredForSeed } from '../engine/garden/Garden';
import { SingleResearch } from '../engine/Research';
import { SingleBuildingUI } from './BuildingsUI';
import { BasicCommandButton } from './comps/BasicCommand';
import DisplayDecimal from './DisplayDecimal';
import DisplayNumber from './DisplayNumber';
import ListedResourceClass from './ListedResourceClass';
import ResearchUI, { SingleResearchUI } from './ResearchUI';

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
  const prizeOK = prize.greaterThan(0)


  return (
    <div style={{ position: 'relative' }}>
      <ListedResourceClass resource={gEngine.energyResource} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      {data.unlocksStates.one > 0 && <ListedResourceClass resource={gEngine.doom} />}
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
      <br />
      <span>
        Goal: <DisplayNumber num={goal} /> Energy,  </span>
      <span>Progress: {percentOf(data.cell.a.toNumber(), goal)} | {data.unlocksStates.one}, </span>
      {data.unlocksStates.one >= 3 && <span>
        Consolation Prize: <DisplayDecimal decimal={prize} />
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
    <div>
      {true && <button onClick={() => engine.setNav(0)}>Energy</button>}
      {data.unlocksStates.two > 0 && <button onClick={() => engine.setNav(1)}>Doom</button>}
      {data.unlocksStates.one >= 5 && <button onClick={() => engine.setNav(3)}>Garden</button>}
      {data.cell.swimmerNumber.greaterThan(10) && <button onClick={() => engine.setNav(2)}>Stats</button>}
    </div>
  )
}


const StatsRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;
  return (
    <div>
      Stats<br />
      You are attempt #<DisplayDecimal decimal={data.cell.swimmerNumber} />
    </div>
  )
}

const GardenRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;
  return (
    <div>
      Spiritual Garden<br />
      {canCheat && <div>
        <button onClick={engine.garden.resetGarden}>
          Reset Garden
        </button>
      </div>}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>

          Seed Generation: {data.garden.seedTimer}/{TimeRequiredForSeed} - {percentOf(data.garden.seedTimer, TimeRequiredForSeed)}<br />
          {data.garden.researches.progression > 0 && <div>

            Seeds: <DisplayDecimal decimal={data.garden.seeds} /><br />
            <button disabled={!engine.garden.canGetSeed()} onClick={engine.garden.getSeed} >
              Get Seed
      </button><br />
            {data.garden.researches.progression > 1 && <div>
            Bag: {engine.garden.data.bag.length}/{engine.garden.maxBagSlots} seeds<br />
            <form onSubmit={(ev: any) => {
              ev.preventDefault();
              const index = ev.target[0].selectedIndex;
              if (index < 0) return;
              //console.log(ev.target[0].selectedIndex);
              engine.garden.plantSeed(index)
              //engine.garden.plantSeed()
            }}>
              <label htmlFor="seeds">Choose a Seed:</label>
              <select id="seed" name="seed">
                {data.garden.bag.map((seed, index) => {
                  const vk = seed.type + index;
                  return <option value={vk} key={vk} >
                    {SeedType[seed.type]} {index}
                  </option>
                })}
              </select>
              <input type="submit" value='Plant' disabled={!engine.garden.canPlantSeed()} />
            </form>
            </div>}

          </div>}
          {data.garden.researches.progression > 1 && <div>

          Garden: {engine.garden.data.plots.length}/{engine.garden.maxgGardenPlots} plots<br />
            {data.garden.plots.map((plant, index) => {
              return <PlotDisplay plant={plant} index={index} key={'plot' + index} />
            })}
          </div>}
        </div>
        <div>
          {data.garden.researches.progression > 2 && <div>
          <span>
            Horticulture:<br />
          </span>
          <SingleResearchUI research={engine.garden.res_watering} active={0} />
          <SingleResearchUI research={engine.garden.res_expansion_one} active={0} />
          <SingleResearchUI research={engine.garden.res_seedtype_circle} active={0} />
          <SingleResearchUI research={engine.garden.res_seedtype_squre} active={0} />
          <SingleResearchUI research={engine.garden.res_seedtype_bunch} active={0} />
          <SingleResearchUI research={engine.garden.res_seedtype_triangle} active={0} />
          </div>}
        </div>
        <div>
          {data.garden.researches.progression > 2 && <div>

          <span>
            Fruits:
        </span>
          {<ListedResourceClass resource={engine.garden.hopeFruit} />}
          </div>}
        </div>
      </div>
    </div>
  )
}

const PlotDisplay = (props: { plant: GardenPlant, index: number }) => {
  const req = SeedGrowthTimeRequired(props.plant.seed);
  const engine = gEngine;
  return (
    <div>
      Planto de {SeedType[props.plant.seed.type]} -
      {props.plant.plantTimer}/{req} {percentOf(props.plant.plantTimer, req)}
      {engine.datamap.garden.researches.watering && <button onClick={() => {
        engine.garden.waterPlant(props.index);
      }}>
        Water {percentOf(props.plant.water, MINUTE_MS)}
      </button>}
      {req < props.plant.plantTimer && <button onClick={() => {
        engine.garden.harvest(props.index);
      }}>
        Harvest
          </button>}
    </div>
  )
}

