import Decimal from 'break_infinity.js';
import React from 'react';
import { gEngine } from '../../..';
import { Datamap } from '../../../engine/Datamap';
import { ChildTip } from '../../comps/TipFC';

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
    let [navs, current] = getCurrentNavAndNavs(this.props.data);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {navs.length > 2 && <button onClick={gEngine.hotkeyManager.goL}>{'<-'}<ChildTip>Hotkey: Left Arrow</ChildTip></button>}
          {navs.map((navInfo,index)=>{
            const navID = navInfo[0];
            const label = navInfo[1];
            return <button key={label+'nav'} onClick={()=>{engine.setNav(navID)}} className={index===current?'ActiveNavButton':'NavButton'}>
              {label}
            </button>
          })}
          {navs.length > 2 && <button onClick={gEngine.hotkeyManager.goR}>{'->'}<ChildTip>Hotkey: Right Arrow</ChildTip></button>}
        </div>
        <div>
          {data.cell.swimmerNumber.greaterThan(10) && <button onClick={() => engine.setNav(2)}>Stats</button>}
          <button onClick={() => engine.setNav(4)} style={{ right: 0 }}>Options / Info</button>
        </div>
      </div>
    );
  }
}

export function getCurrentNavAndNavs (data:Datamap): [[number,string][],number]  {
  let navs = getNavs(data)
  let current = navs.findIndex(([n,s],i)=>n===data.nav);
  return [navs,current]

}


export function getNavs (data:Datamap) {
  let navs: [number,string][] = [];
  if (true) navs.push([0, 'Energy']);
  if (data.unlocksStates.two > 0) navs.push([1, 'Doom'])
  if (data.unlocksStates.one >= 4) navs.push([6, 'Crafting'])
  if (data.unlocksStates.one >= 5) navs.push([3, 'Garden'])
  if (data.unlocksStates.one >= 6) navs.push([5, 'Jobs'])
  if (data.unlocksStates.magic === true) navs.push([8, 'Magic'])
  if (data.skillManager.manager.unlocked) navs.push([9, 'Skills'])
  return navs;
}

interface NavInfo {
  nav: number,
  label: string;
}