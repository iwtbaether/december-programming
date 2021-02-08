import React, { useState } from "react";
import { gEngine } from "../../..";
import { Datamap } from "../../../engine/Datamap";
import { canCheat } from "../../../engine/externalfns/util";
import { EnergyItem, maxMods, DoomStone, ItemData, GardeningItem, EnergyItemMod, ItemTypes, GardeningItemMod, DoomStoneMod, unEqItemType } from "../../../engine/m_st/Crafting";
import { EnergyItemModList } from "../../../engine/m_st/ModLists";
import ConfirmCommandButton from "../../comps/ConfirmCommandButton";
import FlexColumn from "../../comps/FlexColumn";
import FlexRow from "../../comps/FlexRow";
import TipFC, { ChildTip } from "../../comps/TipFC";
import DisplayDecimal from "../../DisplayDecimal";
import DisplayNumber from "../../DisplayNumber";
import { ListedNumber } from "../../ListedResourceClass";
import IITEM_STRINGS from "../ItemStrings";


const CraftingRow = (props: { data: Datamap }) => {
  const [statDetails, setStatDetails] = useState(false);

  const data = props.data;
  const crafting = gEngine.crafting;
  return (<div>
    <FlexRow>
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0, flexBasis: '240px', gap:'5px' }}>
        <div>

        <span>
        Currency:
        </span>
        <ListedNumber resource={crafting.data.currency.transmutes} name={'Creation'} />
        <ListedNumber resource={crafting.data.currency.augmentations} name={'Enchantment'} />
        {data.doomResearch.gloomShard && <ListedNumber resource={crafting.data.currency.doomShards} name={'Doom Shard'} />}
        {data.crafting.vaalProgress >= 1 && <ListedNumber resource={crafting.data.currency.doomOrbs} name={'Doom Pog'} />}
        </div>
        <span>Get 5 random basic currency each time you accept Doom</span>
        {(data.unlocksStates.one < 7 && data.unlocksStates.one > 5 ) && <span> You can equip one Catalyst of each size</span>}
        {data.unlocksStates.one >= 8 && <button onClick={()=>{gEngine.setNav(7)}}>
            Visit The Exchange
          </button>}
      </div>
      {<FlexColumn>
        {data.unlocksStates.one >= 6 && <button onClick={() => crafting.makeCatalyst(2)}>
          Create Large Catalyst (Energy)
    </button>}
        <button onClick={() => crafting.makeCatalyst(1)}>
          Create Medium Catalyst (Energy)
    </button>
        {data.unlocksStates.one >= 5 && <button onClick={() => crafting.makeCatalyst(0)}>
          Create Small Catalyst (Energy)
    </button>}
        {data.unlocksStates.one >= 7 && <React.Fragment>
          <button onClick={crafting.makeRandomGardeningEquipment}>Make Random Garden Equipment</button>
        </React.Fragment>}
        {canCheat && <button onClick={crafting.getRandomACurrency}>
          Get Random Currency
    </button>}
      </FlexColumn>}
      {data.crafting.currentCraft && <FlexRow>
        <FlexColumn>
          <button onClick={crafting.addModToCurrentCraft}>
            Enchant Current Craft {craftToModCount(crafting.data.currentCraft)}
          </button>
          <button onClick={crafting.equipCurrentCraft}>
            Equip Current Craft
    </button>
          <button onClick={crafting.clearCraft}>
            Clear Current Craft
      <TipFC tip={'Get some currency, Start a new craft'} />
          </button>
        </FlexColumn>
        <div>
        <ItemDisplay item={data.crafting.currentCraft} />
        </div>
      </FlexRow>}
      {data.crafting.currentCraft && <FlexColumn>
        {crafting.data.vaalProgress >= 1 && <ConfirmCommandButton
          label={'Doom Item'}
          warning={'This has a chance to destory your item,\nand it forces a save'}
          do={crafting.applyDoomToCraft}
          disabled={crafting.data.currency.doomOrbs < 1}
        />}
      </FlexColumn>}
    </FlexRow>
    <br />
    Equipped:<br />
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {data.crafting.equipedEnergyItem && <ItemDisplay item={data.crafting.equipedEnergyItem} />}<br />
      {data.crafting.equipedMedEnergyItem && <ItemDisplay item={data.crafting.equipedMedEnergyItem} />}<br />
      {data.crafting.equipedSmallEnergyItem && <ItemDisplay item={data.crafting.equipedSmallEnergyItem} />}<br />
      {data.crafting.equipped.gardeningCap && <ItemDisplay item={data.crafting.equipped.gardeningCap} />}<br />
      {data.crafting.equipped.seceteurs && <ItemDisplay item={data.crafting.equipped.seceteurs} />}<br />
      {data.crafting.equipped.wateringCan && <ItemDisplay item={data.crafting.equipped.wateringCan} />}<br />
      {data.crafting.equipped.doomStone && <ItemDisplay item={data.crafting.equipped.doomStone} />}<br />
    </div>
    <div style={{ display: 'flex', flexDirection: 'row' }}>

    </div>
    Final Stats From Equipment:
    <button onClick={() => { setStatDetails(!statDetails) }}>
      {statDetails ? 'Hide' : 'Show'}
    </button>
    <br />
    {statDetails && <div>

      {gEngine.energyModule.energyGainFromAutoClickers.notEquals(0) && <div><DisplayDecimal decimal={gEngine.energyModule.energyGainFromAutoClickers} /> Energy per second from autoclickers</div>}
      <div>
        {JSON.stringify(crafting.energyCalcedData)}
      </div>
      {data.unlocksStates.one >= 7 && <div>
        <div>
          Total Fruit Gain: <DisplayNumber num={gEngine.garden.getFruitGain()} />
        </div><div>

          {JSON.stringify(crafting.gardeningCalcData)}
        </div>
        {data.crafting.equipped.doomStone && <div>{JSON.stringify(crafting.DoomAndGloomFromEQ)}</div>}
      </div>}
    </div>}
  </div>)
}

export default CraftingRow;

const EnergyItemDisplay = (props: { item: EnergyItem }) => {
  return (<div className={'EnergyItemDisplay'}>
    <div className='ItemTitle'>
      <span className={props.item.doomed ? 'DoomedText' : ""}>Energy Catalyst</span>
      <UnEqMe it={props.item.itemType}/>

      <br />
    Size {maxMods(props.item)}
    </div>
    <div className='EnergyModList'>
      {props.item.mods.map((mod, index) => <EnergyModDisplay key={index} mod={mod} />)}
    </div>
  </div>)
}

const DoomItemDisplay = (props: { item: DoomStone }) => {
  return (<div className={'DoomItemDisplay'}>
    <div className='ItemTitle'>
      <span className={props.item.doomed ? 'DoomedText' : ""}>Doom Stone</span>
      <UnEqMe it={props.item.itemType}/>

    </div>
       <DoomModDisplay mod={props.item.doomMod}/>
      {props.item.energyMod && <EnergyModDisplay mod={props.item.energyMod}/>}
      {props.item.gardeningMod && <GardeningModDisplay mod={props.item.gardeningMod}/>}

  </div>)
}

const DoomItemModsList = (props: { item: DoomStone }) => {
  return (<div className={'DoomItemModsList'}>
       <DoomModDisplay mod={props.item.doomMod}/>
      {props.item.energyMod && <EnergyModDisplay mod={props.item.energyMod}/>}
      {props.item.gardeningMod && <GardeningModDisplay mod={props.item.gardeningMod}/>}

  </div>)
}


const ItemDisplay =   (props: { item: ItemData }) => {
  //if (props.item.itemType === 1) return <EnergyItemDisplay item={props.item as EnergyItem} />
  //if (props.item.itemType === 2) return <EnergyItemDisplay item={props.item as EnergyItem} />
  //if (props.item.itemType === 3) return <EnergyItemDisplay item={props.item as EnergyItem} />
  //if (props.item.itemType === 4) return <DoomItemDisplay item={props.item as DoomStone} />
  //if ([5, 6, 7].includes(props.item.itemType)) return <GardeningItemDisplay item={props.item as GardeningItem} />
  
  let base = '';
  if ([1,2,3].includes(props.item.itemType)) base = 'Energy';
  else if ([4].includes(props.item.itemType)) base = 'Doom';
  else if ([5,6,7].includes(props.item.itemType)) base = 'Gardening';
  else return (<span>error</span>);

  return (<div className={`${base}ItemDisplay`}>
    <div className={'ItemTitle'}>
      {props.item.unique && <span className='UniqueIcon'>★<ChildTip>This is a unique item with set enchantments</ChildTip></span>}
      <span style={{flexGrow:1}} className={props.item.doomed ? 'DoomedText' : ""}>
        {getItemName(props.item.itemType, props.item.unique)}
      </span>
      <span>
      <UnEqMe it={props.item.itemType}/>
      </span>
    </div>
    <div className={props.item.unique? 'UniqueModWindow ModWindow':'ModWindow'}>
    {[5,6,7].includes(props.item.itemType) && <div className='GardeningModList'>
      {(props.item as GardeningItem).mods.map((mod, index) => <GardeningModDisplay key={index} mod={mod} />)}
    </div>}
    {[1,2,3].includes(props.item.itemType) && <div className='EnergyModList'>
      {(props.item as EnergyItem).mods.map((mod, index) => <EnergyModDisplay key={index} mod={mod} />)}
    </div>}
    {(props.item as DoomStone).itemType === 4 && <DoomItemModsList item={props.item as DoomStone} />}
    </div>
  </div>)
}

//idk what this is for
//function unEqMaybe (type:ItemTypes) {}

const EnergyModDisplay = (props: { mod: EnergyItemMod }) => {
  const base = 'Energy';
  const rest = 'ModDisplay';
  const extra = props.mod.doomed ? ' DoomedMod' : ''
  return (<div className={base + rest + extra}>
    {EnergyModAndValueToString(props.mod.mod, props.mod.value)}
  </div>)
}

function EnergyModAndValueToString(mod: EnergyItemModList, value: number): string {
  switch (mod) {
    case EnergyItemModList.BaseGain:
      return `+${value.toFixed(1)} Base Energy Gain`
      break;

    case EnergyItemModList.ClickMore:
      return `x${(value * .1 + 1).toFixed(1)} More Energy from Clicking`
      break;

    case EnergyItemModList.ClicksPerSecond:
      return `${value.toFixed(1)} Autoclickers`
      break;

    case EnergyItemModList.HoverMore:
      return `x${(value * .1 + 1).toFixed(1)} More Energy from Hovering`
      break;

    case EnergyItemModList.IncreasedGain:
      return `+${value.toFixed(1)}x Increased Energy Gain`
      break;

    case EnergyItemModList.MoreGain:
      return `x${(value * .1 + 1).toFixed(1)} More Energy Gain`
      break;

    case EnergyItemModList.PassiveMore:
      return `x${(value * .1 + 1).toFixed(1)} More Energy per second`
      break;

    default:
      return 'error'
      break;
  }
}

const GardeningItemDisplay = (props: { item: GardeningItem }) => {
  return (<div className='GardeningItemDisplay'>
    <div className='ItemTitle'>
      <span className={props.item.doomed ? 'DoomedText' : ""}>
        {gItemName(props.item.itemType)}
      </span>

      <UnEqMe it={props.item.itemType}/>
    </div>
    <div className='GardeningModList'>
      {props.item.mods.map((mod, index) => <GardeningModDisplay key={index} mod={mod} />)}
    </div>
  </div>)
}

function gItemName(it: ItemTypes): string {
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

function getItemName(it: ItemTypes, unique?: number): string {

  if (unique) {
    switch (unique) {
      case 1:
        return 'Unbreakable Broken Watering Can'
        break;
    
      default:
        return 'unique error'
        break;
    }
  }

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

    case ItemTypes.LargeEnergyItem: return 'Large Energy Catalyst'; break;
    case ItemTypes.MediumEnergyItem: return 'Medium Energy Catalyst'; break;
    case ItemTypes.SmallEnergyItem: return 'Small Energy Catalyst'; break;
    case ItemTypes.DoomedCrystal: return 'Doom Stone'; break;

    default:
      return `error ${it}`;
      break;
  }
}

const GardeningModDisplay = (props: { mod: GardeningItemMod }) => {
  const base = 'Gardening';
  const rest = 'ModDisplay';
  const extra = props.mod.doomed ? ' DoomedMod' : ''
  return (<div className={base + rest + extra}>
    {IITEM_STRINGS.GardeningModAndValueToString(props.mod.mod, props.mod.value)}
  </div>)
}

const DoomModDisplay = (props: { mod: DoomStoneMod }) => {
  const base = 'Doom';
  const rest = 'ModDisplay';
  const extra = props.mod.doomed ? ' DoomedMod' : ''
  return (<div className={base + rest + extra}>
    {IITEM_STRINGS.DoomModAndValueToString(props.mod.mod, props.mod.value)}
  </div>)
}

const UnEqMe = (props: {it: ItemTypes}) => {
  if (gEngine.datamap.crafting.currentCraft) return null;
  return (
    <button style={{alignSelf:'flex-end',border:'none',background:'none',height:'0px',color:'black',textAlign:'right'}} onClick={()=>{unEqItemType(props.it)}}>
      x
    </button>
  )
}

function craftToModCount(item: ItemData | null) {
  if (item) {
    let max = maxMods(item);
    if ((item as any).mods) {
      let min = (item as any).mods.length;
      return `${min}/${max}`
    }
  } else return ''
}

