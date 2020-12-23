import React from "react";
import { gEngine } from "../..";
import { Datamap } from "../../engine/Datamap";
import { canCheat } from "../../engine/externalfns/util";
import { EnergyItem, EnergyItemMod, EnergyItemMods, ItemData, ItemTypes, maxMods } from "../../engine/m_st/Crafting";
import DisplayDecimal from "../DisplayDecimal";
import DisplayNumber from "../DisplayNumber";

const CraftingRow = (props: { data: Datamap }) => {
  const data = props.data;
  const crafting = gEngine.crafting;
  return (<div>
    <span style={{color:'red'}}>
      BETA FEATURE: Just added this to speedup progress after Progression Reset #4.
      You get currency from doom resets and use it to make items that modify your energy gain.
      Better UI and explinations incoming. Come to discord if you need help! You can ignore this and still beat the game (Progress |7).
    </span><br/>
    <div style={{display:'flex',flexDirection:'row'}}>
      <div style={{display:'flex',flexDirection:'column', flexShrink:0, flexBasis:'240px'}}>
        Currency:
        <DisplayNumber num={crafting.data.currency.transmutes} name={'Creation'}/>
        <DisplayNumber num={crafting.data.currency.augmentations} name={'Enchantment'}/>
      </div>
    {!data.crafting.currentCraft && <div style={{display:'flex',flexDirection:'column'}}>
      {data.unlocksStates.one >=  6 && <button onClick={crafting.makeNewCatalyst}>
      Create Large Catalyst (Energy)
    </button>}
    <button onClick={crafting.makeNewMediumCatalyst}>
      Create Medium Catalyst (Energy)
    </button>
    {data.unlocksStates.one >= 5 &&<button onClick={crafting.makeNewSmallCatalyst}>
      Create Small Catalyst (Energy)
    </button>}
    {canCheat && <button onClick={crafting.getRandomCurrency}>
      Get Random Currency
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
    <div style={{display:'flex',flexDirection:'row'}}>
    {data.crafting.equipedEnergyItem && <ItemDisplay item={data.crafting.equipedEnergyItem} />}<br/>
    {data.crafting.equipedMedEnergyItem && <ItemDisplay item={data.crafting.equipedMedEnergyItem} />}<br/>
    {data.crafting.equipedSmallEnergyItem && <ItemDisplay item={data.crafting.equipedSmallEnergyItem} />}<br/>
    </div>
    Final Stats From Equipment:<br/>
    {gEngine.energyModule.energyGainFromAutoClickers.notEquals(0) && <div><DisplayDecimal decimal={gEngine.energyModule.energyGainFromAutoClickers}/> Energy per second from autoclickers</div>}
    {JSON.stringify(crafting.energyCalcedData)}
  </div>)
}

export default CraftingRow;

const EnergyItemDisplay = (props: {item: EnergyItem}) => {
  return (<div>
    Energy Catalyst<br/>
    Size {maxMods(props.item)}<br/>
    {props.item.mods.map((mod,index)=><ModDisplay key={index} mod={mod}/>)}
  </div>)
}

const ItemDisplay = (props: {item: ItemData}) => {
  if (props.item.itemType === 1) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  if (props.item.itemType === 2) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  if (props.item.itemType === 3) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  return <span>error</span>;
}

const ModDisplay = (props: {mod: EnergyItemMod}) => {
  return (<div>
    {EnergyItemMods[props.mod.mod]} - {props.mod.value}
  </div>)
}