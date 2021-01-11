import React from 'react';
import { gEngine } from '..';
import { canCheat, MINUTE_MS } from '../engine/externalfns/util';
import FancySaveButton from './FancySaveButton';

export const FileButtons = (props: { last: number; auto: boolean; }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>
        File:
      <FancySaveButton />
        <button onClick={gEngine.autosaveToggle} className={props.auto ? 'AutoOn' : 'AutoOff'}>
          Autosave ({props.auto ? 'On' : 'Off'})
          </button>


        {canCheat && <button onClick={() => gEngine.processDelta(MINUTE_MS * 10)}>
          10M</button>}
        {canCheat && <button onClick={() => gEngine.processDelta(MINUTE_MS * 60)}>
          60M</button>}

      </span>
      <span className='yellow-text'>
        v.7.3.3 - more bug fixes
        </span>
    </div>
  );
};
