import React from 'react';
import { Datamap } from '../../../engine/Datamap';
import EnergyPopup from '../../EnergyPopup';
import JobXPPopup from '../../JobXPPopup';

export const PopupRow = (props: { data: Datamap; }) => {
  if (props.data.popupUI === 0)
    return null;

  return (<div className='WarningOverlay'>
    <div className='WarningPopup'>
      {props.data.popupUI === 1 && <JobXPPopup data={props.data} />}
      {props.data.popupUI === 2 && <EnergyPopup data={props.data} />}
    </div>
  </div>);
};
