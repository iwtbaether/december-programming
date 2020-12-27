import React from "react";
import { gEngine } from "../..";
import { Datamap } from "../../engine/Datamap";
import { canCheat } from "../../engine/externalfns/util";
import { EnergyItem, EnergyItemMod, EnergyItemModList, GardeningItem, GardeningItemMod, GardeningItemModList, ItemData, ItemTypes, maxMods } from "../../engine/m_st/Crafting";
import DisplayDecimal from "../DisplayDecimal";
import DisplayNumber from "../DisplayNumber";
import { ListedNumber } from "../ListedResourceClass";

const CraftingRow = (props: { data: Datamap }) => {
  const data = props.data;
  const crafting = gEngine.crafting;
  return (<div>
    <span style={{color:'red'}}>
      BETA FEATURE: Freshly added to speedup progress after Progression Reset #4. You get currency from doom resets and use it to make different items that modify your energy gain.<br/>
      Better UI and explinations incoming. Come to discord if you need help, and please report bugs! You can ignore this and still beat the game (Progress |7), when the final 3 item types are unlocked.
    </span><br/>
    <div style={{display:'flex',flexDirection:'row'}}>
      <div style={{display:'flex',flexDirection:'column', flexShrink:0, flexBasis:'240px'}}>
        Currency:
        <ListedNumber resource={crafting.data.currency.transmutes} name={'Creation'}/>
        <ListedNumber resource={crafting.data.currency.augmentations} name={'Enchantment'}/>
      </div>
    {!data.crafting.currentCraft && <div style={{display:'flex',flexDirection:'column'}}>
      {data.unlocksStates.one >=  6 && <button onClick={()=>crafting.makeCatalyst(2)}>
      Create Large Catalyst (Energy)
    </button>}
    <button onClick={()=>crafting.makeCatalyst(1)}>
      Create Medium Catalyst (Energy)
    </button>
    {data.unlocksStates.one >= 5 &&<button onClick={()=>crafting.makeCatalyst(0)}>
      Create Small Catalyst (Energy)
    </button>}
    {data.unlocksStates.one >= 7 &&<React.Fragment>
      <button onClick={crafting.makeRandomGardeningEquipment}>Make Randon Garden Equipment</button>  
    </React.Fragment>}
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
    {data.crafting.equipped.gardeningCap && <ItemDisplay item={data.crafting.equipped.gardeningCap} />}<br/>
    {data.crafting.equipped.seceteurs && <ItemDisplay item={data.crafting.equipped.seceteurs} />}<br/>
    {data.crafting.equipped.wateringCan && <ItemDisplay item={data.crafting.equipped.wateringCan} />}<br/>
    </div>
    Final Stats From Equipment:<br/>
    {gEngine.energyModule.energyGainFromAutoClickers.notEquals(0) && <div><DisplayDecimal decimal={gEngine.energyModule.energyGainFromAutoClickers}/> Energy per second from autoclickers</div>}
    <div>
    {JSON.stringify(crafting.energyCalcedData)}
    </div>
    {data.unlocksStates.one >= 7 && <div>
      {JSON.stringify(crafting.gardeningCalcData)}  
    </div>}
  </div>)
}

export default CraftingRow;

const EnergyItemDisplay = (props: {item: EnergyItem}) => {
  return (<div className={'EnergyItemDisplay'}>
    <div className='ItemTitle'>
    Energy Catalyst<br/>
    Size {maxMods(props.item)}
    </div>
    <div className='EnergyModList'>
    {props.item.mods.map((mod,index)=><EnergyModDisplay key={index} mod={mod}/>)}
    </div>
  </div>)
}

const ItemDisplay = (props: {item: ItemData}) => {
  if (props.item.itemType === 1) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  if (props.item.itemType === 2) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  if (props.item.itemType === 3) return <EnergyItemDisplay item={props.item as EnergyItem}/>
  if ([5,6,7].includes(props.item.itemType)) return <GardeningItemDisplay item={props.item as GardeningItem}/> 
  return <span>error</span>;
}

const EnergyModDisplay = (props: {mod: EnergyItemMod}) => {
  return (<div className='EnergyModDisplay'>
    {EnergyModAndValueToString(props.mod.mod, props.mod.value)}
  </div>)
}

function EnergyModAndValueToString  (mod: EnergyItemModList, value: number):string {
  switch (mod) {
    case EnergyItemModList.BaseGain:
      return `+${value} Base Energy Gain`
      break;

      case EnergyItemModList.ClickMore:
        return `x${value*.1+1} More Energy from Clicking`
        break;

        case EnergyItemModList.ClicksPerSecond:
          return `${value} Autoclickers`
          break;

          case EnergyItemModList.HoverMore:
            return `x${value*.1+1} More Energy from Hovering`
            break;
            
            case EnergyItemModList.IncreasedGain:
              return `+${value} Increased Energy Gain`
              break;
              
              case EnergyItemModList.MoreGain:
            return `x${value*.1+1} More Energy Gain`
        break;

                case EnergyItemModList.PassiveMore:
            return `x${value*.1+1} More Energy per second`
                  break;
  
    default:
      return 'error'
      break;
  }
}

const GardeningItemDisplay = (props: {item: GardeningItem}) => {
  return (<div className='GardeningItemDisplay'>
    <div className='ItemTitle'>
      {gItemName(props.item.itemType)}
    </div>
    <div className='GardeningModList'>
    {props.item.mods.map((mod,index)=><GardeningModDisplay key={index} mod={mod}/>)}
    </div>
  </div>)
}

function gItemName (it: ItemTypes): string {
  switch (it) {
    case ItemTypes.MagicSecateurs:
      return 'Magic Secateurs';
      break;

    case ItemTypes.MagicWateringCan:
      return 'Magic Watering Can';
      break;

    case ItemTypes.GardeningHat:
      return 'Gardening Cap';
      break;
  
    default:
      return `error ${it}`;
      break;
  }
}

const GardeningModDisplay = (props: {mod: GardeningItemMod}) => {
  return (<div className='GardeningModDisplay'>
    {GardeningItemModList[props.mod.mod]} - {props.mod.value}
  </div>)
}