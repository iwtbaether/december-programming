import Decimal from 'break_infinity.js';
import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';
import { percentOf } from '../engine/externalfns/util';
import { SingleBuildingUI } from './BuildingsUI';
import ConfirmCommandButton, { ConfirmBasicCommandButton } from './comps/ConfirmCommandButton';
import DisplayDecimal from './DisplayDecimal';
import ListedResourceClass from './ListedResourceClass';

export const EnergyRow = (props: { data: Datamap; energy: Decimal; }) => {
  const data = props.data;
  const goal = gEngine.energy.unlockGoal();
  const reached = gEngine.energy.canGiveUp();
  const clickGain = gEngine.energyModule.energyPerClick;
  const activityGain = gEngine.energyModule.energyGainFromActivity;
  const prize = gEngine.doomGain();
  const cn = clickGain.greaterThanOrEqualTo(0) ? '' : 'Anti';

  return (
    <div style={{ position: 'relative' }}>
      <ListedResourceClass resource={gEngine.energyResource} />
      {data.unlocksStates.two > 1 && <ListedResourceClass resource={gEngine.antiEnergyResource} />}
      {data.cell.doom.greaterThan(0) && <ListedResourceClass resource={gEngine.doom} />}
      {data.unlocksStates.two > 2 && <ListedResourceClass resource={gEngine.gloom} />}


      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>

        <div>


          Hover Energy Gain: <DisplayDecimal decimal={activityGain} />, <span className={cn}>Click Energy Gain: <DisplayDecimal decimal={clickGain} /></span>
          {gEngine.energyModule.energyGainFromAutoClickers.notEquals(0) && <span>
            , Autoclickers: <DisplayDecimal decimal={gEngine.energyModule.energyGainFromAutoClickers} /> energy /s
      </span>}
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{ position: 'relative' }}>
            <button onMouseEnter={() => gEngine.setActivity(1)} onMouseLeave={gEngine.clearActivity} style={{ position: 'relative' }}>
              Gather Energy /s
      </button>
          </span>
          <span>

            <button className={cn} onClick={gEngine.energy.gatherEnergy} onSubmit={(ev) => { ev.preventDefault(); }}>
              Gather Energy
              </button>
          </span>

          <SingleBuildingUI building={gEngine.effort} />
          <SingleBuildingUI building={gEngine.drive} />
          <SingleBuildingUI building={gEngine.antiDrive} />
          <SingleBuildingUI building={gEngine.momentum} />
        </div>
        {data.unlocksStates.two > 2 && <div style={{ display: 'flex', gap: '5px' }}>

          <SingleBuildingUI building={gEngine.gloomGen1} />
          <SingleBuildingUI building={gEngine.gloomGen2} />
          <SingleBuildingUI building={gEngine.gloomGen3} />
          <SingleBuildingUI building={gEngine.gloomGen4} />
        </div>}

        <div>

          <span>
            Goal: <DisplayDecimal decimal={goal} /> Energy,  </span>
          <span>Progress: {percentOf(data.cell.a.toNumber(), goal.toNumber())}</span>
          {data.unlocksStates.one >= 3 && <span>
            , Consolation Prize: <DisplayDecimal decimal={prize} /> Doom
      </span>}
        </div>
        <span className='flexRow'>


          <ConfirmCommandButton do={gEngine.energy.giveUp} label='Difficulty Up' disabled={!reached}
            warning={`Resets everything, increases energy goal, and unlocks content\nCurrent Difficulty: ${data.unlocksStates.one}`} />

          <ConfirmBasicCommandButton {...gEngine.gUL3}>
            Resets Energy, Doom, Crafting, Jobs<br />
        Gives +1 Base Gloom
      </ConfirmBasicCommandButton>

          <div>
            <ConfirmBasicCommandButton {...gEngine.gUL2}>
              Resets Energy {data.unlocksStates.two > 2 && 'and Gloom production'}<br />
        Gives Doom
         </ConfirmBasicCommandButton>
          </div>
        </span>
      </div>
    </div>
  );
};
