import React from 'react';
import { gEngine } from '../..';
import { canCheat, MINUTE_MS } from '../../engine/externalfns/util';
import CheatDiv from '../comps/CheatDiv';
import FlexRow from '../comps/FlexRow';
import { ChildTip } from '../comps/TipFC';
import FancySaveButton from '../FancySaveButton';

export const FileButtons = (props: { last: number; auto: boolean; }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <FlexRow>
        File:
      <FancySaveButton />
      <button onClick={gEngine.export} >
        Export
          </button>
          <span>
            Last save {Math.floor(gEngine.datamap.autosaveCounter/1000)} seconds ago
          </span>
      <CheatDiv>
        <FlexRow>

        <button onClick={gEngine.autosaveToggle} className={props.auto ? 'AutoOn' : 'AutoOff'}>
          Autosave ({props.auto ? 'On' : 'Off'})
          </button>


        {<button onClick={() => gEngine.processDelta(MINUTE_MS * 10)}>
          10M</button>}
        {<button onClick={() => gEngine.processDelta(MINUTE_MS * 60)}>
          60M</button>}

        </FlexRow>
      </CheatDiv>
      </FlexRow>
      <span className='blue-text'>
        v0.8.<span className='tippedText red-text'>beta2</span> - Difficulty, the Exchange, Growth, Magic (fixes patch 2)
        </span>
    </div>
  );
};
