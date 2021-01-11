import React from 'react';
import { gEngine } from '..';
import { Datamap } from '../engine/Datamap';

export class NavRow extends React.Component<{ data: Datamap; }, {}> {

  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  componentWillUnmount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  _handleKeyDown = (event: KeyboardEvent) => {
    gEngine.handleKey(event.key);


  };

  render() {

    const data = this.props.data;
    const engine = gEngine;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {true && <button onClick={() => engine.setNav(0)}>Energy</button>}
          {data.unlocksStates.two > 0 && <button onClick={() => engine.setNav(1)}>Doom</button>}
          {data.unlocksStates.magic && <button onClick={() => engine.setNav(8)}>Magic</button>}
          {data.unlocksStates.one >= 4 && <button onClick={() => engine.setNav(6)}>Crafting</button>}
          {data.unlocksStates.one >= 5 && <button onClick={() => engine.setNav(3)}>Garden</button>}
          {data.unlocksStates.one >= 6 && <button onClick={() => engine.setNav(5)}>Jobs</button>}
        </div>
        <div>
          {data.cell.swimmerNumber.greaterThan(10) && <button onClick={() => engine.setNav(2)}>Stats</button>}
          <button onClick={() => engine.setNav(4)} style={{ right: 0 }}>Options / Info</button>
        </div>
      </div>
    );
  }
}
