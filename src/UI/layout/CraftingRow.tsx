import React from "react";
import { gEngine } from "../..";
import { Datamap } from "../../engine/Datamap";
import { canCheat } from "../../engine/externalfns/util";
import { EnergyItem, EnergyItemMod, EnergyItemMods, ItemData, ItemTypes } from "../../engine/m_st/Crafting";
import DisplayDecimal from "../DisplayDecimal";
import DisplayNumber from "../DisplayNumber";

const CraftingRow = (props: { data: Datamap }) => {
  const data = props.data;
  const crafting = gEngine.crafting;
  return (<div>
    <span style={{color:'red'}}>
      BETA FEATURE: Just added this to speedup progress after Progression Reset #4, might move it to 3 or 2 instead.
    </span><br/>
    <div style={{display:'flex',flexDirection:'row'}}>
      <div style={{display:'flex',flexDirection:'column', flexShrink:0, flexBasis:'240px'}}>
        Currency:
        <DisplayNumber num={crafting.data.currency.transmutes} name={'Creation'}/>
        <DisplayNumber num={crafting.data.currency.augmentations} name={'Enchantment'}/>
      </div>
    {!data.crafting.currentCraft && <div style={{display:'flex',flexDirection:'column'}}>
      <button onClick={crafting.makeNewCatalyst}>
      Create Catalyst (Energy)
    </button>
    {canCheat && <button onClick={crafting.getCurrency}>
      Cheat
    </button>}
    </div>}
    {data.crafting.currentCraft && <div style={{display:'flex',flexDirection:'row'}}>
    <div style={{display:'flex',flexDirection:"column"}}>
    <button onClick={crafting.addModToCurrentCraft}>
      Enchant Current Craft 
    </button>
    <button onClick={crafting.equipCurrentCraft}>
      Equip Current Craft
    </button>
    <button onClick={crafting.clearCraft}>
      Clear Current Craft
    </button>
      </div>
      <ItemDisplay item={data.crafting.currentCraft} />
    </div>}
    </div>
    <br/>
    Equipped:<br/>
    {data.crafting.equipedEnergyItem && <ItemDisplay item={data.crafting.equipedEnergyItem} />}<br/>
    Final Stats From Equipment:<br/>
    {gEngine.energyModule.energyGainFromAutoClickers.greaterThan(0) && <div><DisplayDecimal decimal={gEngine.energyModule.energyGainFromAutoClickers}/> Energy per second from autoclickers</div>}
    {JSON.stringify(crafting.energyCalcedData)}
  </div>)
}

export default CraftingRow;

const EnergyItemDisplay = (props: {item: EnergyItem}) => {
  return (<div>
    Energy Catalyst<br/>
    {props.item.mod1 && <ModDisplay mod={props.item.mod1} />}
    {props.item.mod2 && <ModDisplay mod={props.item.mod2} />}
    {props.item.mod3 && <ModDisplay mod={props.item.mod3} />}
  </div>)
}

const ItemDisplay = (props: {item: ItemData}) => {
  if (props.item.itemType === 1) return <EnergyItemDisplay item={props.item}/>
  return <span>error</span>;
}

const ModDisplay = (props: {mod: EnergyItemMod}) => {
  return (<div>
    {EnergyItemMods[props.mod.mod]} - {props.mod.value}
  </div>)
}