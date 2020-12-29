import Decimal from 'break_infinity.js';
import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';
import { canCheat, MINUTE_MS, percentOf } from '../engine/externalfns/util';
import { SingleBuildingUI } from './BuildingsUI';
import { BasicCommandButton } from './comps/BasicCommand';
import ConfirmCommandButton from './comps/ConfirmCommandButton';
import TipFC from './comps/TipFC';
import DisplayDecimal from './DisplayDecimal';
import FancySaveButton from './FancySaveButton';
import GardenRow from './GardenRow';
import JobXPPopup from './JobXPPopup';
import CraftingRow from './layout/CraftingRow';
import ListedResourceClass from './ListedResourceClass';
import OptionsRow from './OptionsRow';
import ResearchUI from './ResearchUI';
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
        </div>
        <hr style={{width:'100%'}} />
        <FileButtons auto={data.autosave} last={data.last} />
        <PopupRow data={data} />
      </div>
    );
  }
}

const PopupRow = (props: { data: Datamap }) => {
  if (props.data.popupUI === 0) return null;

  return (<div style={{ position: 'absolute', backgroundColor: 'black', left: 0, top: 0, width: "100%", height: '100%' }}>
    {props.data.popupUI === 1 && <JobXPPopup data={props.data} />}
  </div>)
}

const FileButtons = (props: { last: number, auto: boolean }) => {
  return (
    <div>
      File:
      <FancySaveButton/>
      <button onClick={gEngine.autosaveToggle} className={props.auto?'AutoOn':'AutoOff'}>
        Autosave
        <TipFC tip={props.auto?'On':'Off'}/>
          </button>
          <ConfirmCommandButton do={gEngine.load} label={'Load'} warning={'Are you sure you want to load?'} />
      <button onClick={gEngine.export} >
        Export
          </button>
      <button onClick={() => { (document.getElementById('file-input') as HTMLInputElement).click() }} >
        Import
                                </button>
      <input id="file-input" type="file" name="name" style={{ display: "none" }}
        onChange={(e) => {
          let list = e.target.files;
          if (list) {
            let file = list[0];
            var reader = new FileReader();

            //reader.readAsArrayBuffer(file)
            reader.readAsText(file, 'UTF-8');

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
              let target = readerEvent.target;
              if (target) {
                let content = target.result;
                if (content) {
                  console.log(content);
                  gEngine.import(content.toString())

                }
              }
            }

          }

        }} />
          <ConfirmCommandButton do={gEngine.reset} label={'Reset All Data'} warning={'This does nothing good. It is just a data wipe.'} />
      
      {canCheat && <button onClick={() => gEngine.processDelta(MINUTE_MS * 10)}>
        cheat</button>}
      <br />
        v.6.4
    </div>
  )
}

const EnergyRow = (props: { data: Datamap, energy: Decimal }) => {
  const data = props.data;
  const goal = gEngine.energy.unlockGoal();
  const reached = gEngine.energy.canGiveUp();
  const clickGain = gEngine.energyModule.energyPerClick;
  const activityGain = gEngine.energyModule.energyGainFromActivity;
  const prize = gEngine.doomGain();
  const color = clickGain.greaterThanOrEqualTo(0)? 'inherit':'purple'
  const cn = clickGain.greaterThanOrEqualTo(0)? '':'Anti'

  return (
    <div style={{ position: 'relative' }}>
      <ListedResourceClass resource={gEngine.energyResource} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      {data.cell.doom.greaterThan(0) && <ListedResourceClass resource={gEngine.doom} />}
      Hover Energy Gain: <DisplayDecimal decimal={activityGain} />, <span className={cn}>Click Energy Gain: <DisplayDecimal decimal={clickGain} /></span>
      <br />
      <div style={{display:'flex',gap:'5px'}}>

      <button onMouseEnter={() => gEngine.setActivity(1)} onMouseLeave={gEngine.clearActivity}>
        Gather Energy /s
      </button>
      <button className={cn} onClick={gEngine.energy.gatherEnergy} onSubmit={(ev) => { ev.preventDefault() }}>
        Gather Energy
      </button>
      <SingleBuildingUI building={gEngine.effort} />
      <SingleBuildingUI building={gEngine.drive} />
      <SingleBuildingUI building={gEngine.antiDrive} />
      <SingleBuildingUI building={gEngine.momentum} />
      <SingleBuildingUI building={gEngine.determination} />
      </div>
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
      <BasicCommandButton cmd={gEngine.gUL3} />
      <BasicCommandButton cmd={gEngine.gUL2} />
    </div>
  )
}

const DoomRow = (props: { data: Datamap }) => {
  const data = props.data;
  const engine = gEngine;

  return (
    <div>
      <ListedResourceClass resource={engine.doom} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      {data.unlocksStates.two > 2 && <ListedResourceClass resource={gEngine.gloom} />}
      
      <SingleBuildingUI building={engine.doomUpgrade1} />
      <SingleBuildingUI building={engine.doomUpgrade2} />
      <SingleBuildingUI building={engine.doomUpgrade3} />
      <br/>
      <SingleBuildingUI building={engine.doomUpgrade4} />
      <SingleBuildingUI building={engine.doomUpgrade5} />
      <SingleBuildingUI building={engine.doomUpgrade7} />
      <SingleBuildingUI building={engine.doomUpgrade8} />
      {data.unlocksStates.two > 2 && <React.Fragment>
        
      <SingleBuildingUI building={engine.doomUpgrade6} />
      <SingleBuildingUI building={engine.gloomGen1} />
      <SingleBuildingUI building={engine.gloomGen2} />
      <SingleBuildingUI building={engine.gloomGen3} />
      <SingleBuildingUI building={engine.gloomGen4} />

        </React.Fragment>
        }
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
        {data.unlocksStates.one >= 4 && <button onClick={() => engine.setNav(6)}>Crafting</button>}
        {data.unlocksStates.one >= 5 && <button onClick={() => engine.setNav(3)}>Garden</button>}
        {data.unlocksStates.one >= 6 && <button onClick={() => engine.setNav(5)}>Jobs</button>}
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

