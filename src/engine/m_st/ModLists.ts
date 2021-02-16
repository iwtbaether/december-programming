
export enum EnergyItemModList {
    ClicksPerSecond,
    HoverMore,
    ClickMore,
    PassiveMore,
    BaseGain,
    IncreasedGain,
    MoreGain,
}

export enum DoomStoneModList {
    MoreDoomGain,
    BaseDoomGain,
    IncreasedDoomGain,
    //DoomPerSecond,
    //GloomPerSecond,
}

export enum GardeningItemModList {
    AutoHarvest, //implemented
    AutoPlant, //implemented
    AutoWater, //implemented

    BiggerBag, //implemented
    BiggerGarden, //implemented

    FruitGainBase, //implemented
    FruitGrainMult, //implemented

    WateringDurationBase, //implemented
    WateringDurationMult, //implemented

    PlantGrowthSpeed, //implemented
    DoomRate, //implemented

    
    Broken,

    SeedGainMore,

    NeverBreak, // for unique watering can
}

const MOD_LISTS = {
    DoomStoneModList,
    EnergyItemModList,
    GardeningItemModList
}

export default MOD_LISTS;