import { DoomStoneModList, GardeningItemModList } from "../../engine/m_st/ModLists";

function GardeningModAndValueToString(mod: GardeningItemModList, value: number): string {
    switch (mod) {
        case GardeningItemModList.AutoHarvest:
            return `Automatically Harvest`
            break;
        case GardeningItemModList.AutoPlant:
            return `Automatically Plant`
            break;
        case GardeningItemModList.AutoWater:
            return `Automatically Water`
            break;
        case GardeningItemModList.BiggerBag:
            return `+1 Bag Slot`
            break;
        case GardeningItemModList.BiggerGarden:
            return `+1 Garden Plot`
            break;
        case GardeningItemModList.DoomRate:
            return `${value}% Doom Seed Find`
            break;
        case GardeningItemModList.FruitGainBase:
            return `+${(value * .1).toFixed(1)} Base Fruit Gain`
            break;
        case GardeningItemModList.FruitGrainMult:
            return `${value * 10}% More Fruit Gain`
            break;
        case GardeningItemModList.PlantGrowthSpeed:
            return `${value * 10}% More Plant Speed`
            break;
        case GardeningItemModList.WateringDurationBase:
            return `+${value}s Watering Time`
            break;
        case GardeningItemModList.WateringDurationMult:
            return `${value * 10}% More Watering time`
            break;
        case GardeningItemModList.SeedGainMore:
            return `${(value * 10)}% More Seed Gain Speed`
            break;

        case GardeningItemModList.Broken:
            return `Oops! It automatically broke!`
            break;

        case GardeningItemModList.NeverBreak:
            return `Unbreakable`
            break;


        default:
            return 'GardeningModAndValueToString error'
            break;
    }
}


function DoomModAndValueToString(mod: DoomStoneModList, value: number): string {
    switch (mod) {
        
    ///TODODODODODDOODDODDODODO

        case DoomStoneModList.BaseDoomGain: return `+${value} Doom Gain`
        case DoomStoneModList.IncreasedDoomGain: return `+${value*10}% Increased Doom Gain`
        case DoomStoneModList.MoreDoomGain: return `+${value*5}% More Doom Gain`
        case DoomStoneModList.DoomPerSecond: return `+${value} Doom Per Second`
        case DoomStoneModList.GloomPerSecond: return `+${value} Gloom Per Second`

      default:
        return 'error'
        break;
    }
  }

const IITEM_STRINGS = {
    GardeningModAndValueToString, DoomModAndValueToString
}
export default IITEM_STRINGS;
