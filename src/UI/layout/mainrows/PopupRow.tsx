import React from 'react';
import { Datamap } from '../../../engine/Datamap';
import EnergyPopup from '../../EnergyPopup';
import JobXPPopup from '../../JobXPPopup';
import WorkRecordsPopup from '../WorkRecordsPopup';
import DidDrink from './Popups/DidDrink';
import ToCrushPopup from './Popups/ToCrushPopup';
import ToDrinkPopup from './Popups/ToDrinkPopup';

export const PopupRow = (props: { data: Datamap; }) => {
  if (props.data.popupUI === 0)
    return null;

  return (<div className='WarningOverlay'>
    <div className='WarningPopup'>
      {props.data.popupUI === 1 && <JobXPPopup data={props.data} />}
      {props.data.popupUI === 2 && <EnergyPopup data={props.data} />}
      {props.data.popupUI === 3 && <WorkRecordsPopup data={props.data} />}
      {props.data.popupUI === 4 && <ToCrushPopup data={props.data} />}
      {props.data.popupUI === 5 && <ToDrinkPopup data={props.data} />}
      {props.data.popupUI === 6 && <DidDrink data={props.data} />}
    </div>
  </div>);
};
