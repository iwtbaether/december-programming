import { GardeningItemModList } from "../../engine/m_st/Crafting";

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
        case GardeningItemModList.FruitGainBase:
            return `+${value * .1} base fruit gain`
            break;
        case GardeningItemModList.FruitGrainMult:
            return `${value * 10}% more fruit gain`
            break;
        case GardeningItemModList.PlantGrowthSpeed:
            return `${value * 10}% more plant speed`
            break;
        case GardeningItemModList.WateringDurationBase:
            return `+${value}s watering time`
            break;
        case GardeningItemModList.WateringDurationMult:
            return `${value * 10}% more watering time`
            break;


        default:
            return 'error'
            break;
    }
}

const IITEM_STRINGS = {
    GardeningModAndValueToString
}
export default IITEM_STRINGS;
