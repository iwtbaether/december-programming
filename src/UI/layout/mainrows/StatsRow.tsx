import React from 'react';
import { Datamap } from '../../../engine/Datamap';
import DisplayDecimal from '../../DisplayDecimal';

export const StatsRow = (props: { data: Datamap; }) => {
  const data = props.data;
  return (
    <div>
      Stats<br />
      You are attempt #<DisplayDecimal decimal={data.cell.swimmerNumber} />
    </div>
  );
};
