import Decimal from "break_infinity.js";
import { timeStamp } from "console";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { MINUTE_MS } from "../externalfns/util";
import { SingleResearch } from "../Research";

export default class Garden {

    maxBagSlots : number;
    maxgGardenPlots: number;
    constructor(public engine: Engine) {
        this.maxBagSlots = this.calcBagSlots();
        this.maxgGardenPlots = this.calcGardenPlots();
    }

    setTempData = () => {
        this.maxBagSlots = this.calcBagSlots();
        this.maxgGardenPlots = this.calcBagSlots();
    }

    calcBagSlots = () => {
        return 1 + this.data.researches.expansion;
    }

    calcGardenPlots = () => {
        return 1 + this.data.researches.expansion;
    }

    get data (){ 
        return this.engine.datamap.garden;
    }

    plantSeed  = (bagIndex: number) => {
        const seed = this.data.bag[bagIndex];
        if (this.canPlantSeed()) {
            this.data.plots.push(this.getPlant(seed))
        }
        this.data.bag.splice(bagIndex, 1);
    }


    canGetSeed = () => {
        return this.data.bag.length < this.maxBagSlots
    }

    canPlantSeed = () => {
        return this.data.plots.length < this.maxgGardenPlots
    }

    processDelta = (delta: number) => {
        this.data.seedTimer += delta;
        if (this.data.seedTimer >= TimeRequiredForSeed) {
            this.data.seeds = this.data.seeds.add(1);
            this.data.seedTimer -= TimeRequiredForSeed
            if (this.data.researches.progression === 0) {
                this.data.researches.progression = 1
            }
        }

        if (this.data.plots.length > 0) {
            this.data.plots.forEach((plot,index)=>{
                plot.plantTimer += delta;
                if (plot.water) {
                    const extra = Math.min(plot.water, delta);
                    plot.plantTimer += extra;
                    plot.water -= extra;
                }
            })
        }
    }

    harvest = (index: number) => {
        if (index >= this.data.plots.length) return;
        const plant = this.data.plots[index];
        if (SeedGrowthTimeRequired(plant.seed) <= plant.plantTimer) {
            this.data.plots.splice(index, 1)
            this.getFruit(plant.seed.type)
        }
        if (this.data.researches.progression === 2) {
            this.data.researches.progression = 3
        }
    }

    getFruit(type:SeedType) {
        switch (type) {
            case SeedType.hope:
                this.hopeFruit.gainResource(1);
                break;
        
            default:
                break;
        }
    }

    getSeed = () => {
        if (!this.canGetSeed()) return;
        const seed: GardenSeed = {
            type: SeedType.hope,
            level: 1,
        }
        this.data.bag.push(seed);
        this.data.seeds = this.data.seeds.subtract(1);
        if (this.data.researches.progression === 1) {
            this.data.researches.progression = 2;
        }
    }

    getPlant = (seed: GardenSeed): GardenPlant => {
        return {
            plantTimer: 0,
            water: 0,
            seed: seed,
        }
    }

    waterPlant = (index:number) => {
        if (this.data.plots.length <= index) return;
        else {
            this.data.plots[index].water = MINUTE_MS;
        }
        this.engine.notify();
    }

    hopeFruit: SingleResource = new SingleResource({
        get: ()=>this.data.fruits.hope,
        setDecimal: (dec)=>this.data.fruits.hope = dec,
        name: 'Hope Fruit'
    })

    res_watering: SingleResearch = new SingleResearch({
        name: "Watering",
        hidden: ()=>false,
        description: "Watering Plants increases their growth speed",
        get: ()=>this.data.researches.watering,
        makeTrue: ()=>{this.data.researches.watering = true},
        costs: [
            {resource: this.hopeFruit, count: new Decimal(2)}
        ]
    })

    res_expansion_one: SingleResearch = new SingleResearch({
        name: "Expansion",
        hidden: ()=>this.data.researches.watering === false,
        description: "+1 Bag Slot / +1 Plot",
        get: ()=>this.data.researches.expansion > 0,
        makeTrue: ()=>{this.data.researches.expansion = 1
            this.setTempData();
        },
        costs: [
            {resource: this.hopeFruit, count: new Decimal(3)}
        ]
    })

    res_seedtype_circle: SingleResearch = new SingleResearch({
        name: "Circular Seeds",
        hidden: ()=>this.data.researches.expansion === 0,
        description: "You can generate circular seeds now",
        get: ()=>this.data.researches.typeCircle,
        makeTrue: ()=>{this.data.researches.typeCircle = true},
        costs: [
            {resource: this.hopeFruit, count: new Decimal(3)}
        ]
    })

    res_seedtype_squre: SingleResearch = new SingleResearch({
        name: "Squre Seeds",
        hidden: ()=>this.data.researches.expansion === 0,
        description: "You can generate square seeds now",
        get: ()=>this.data.researches.typeSquare,
        makeTrue: ()=>{this.data.researches.typeSquare = true},
        costs: [
            {resource: this.hopeFruit, count: new Decimal(3)}
        ]
    })

    res_seedtype_bunch: SingleResearch = new SingleResearch({
        name: "Bunched Seeds",
        hidden: ()=>this.data.researches.expansion === 0,
        description: "You can generate bunched seeds now",
        get: ()=>this.data.researches.typeBunch,
        makeTrue: ()=>{this.data.researches.typeBunch = true},
        costs: [
            {resource: this.hopeFruit, count: new Decimal(3)}
        ]
    })

    res_seedtype_triangle: SingleResearch = new SingleResearch({
        name: "Trianglular Seeds",
        hidden: ()=>this.data.researches.expansion === 0,
        description: "You can generate triangular seeds now",
        get: ()=>this.data.researches.typeTriangle,
        makeTrue: ()=>{this.data.researches.typeTriangle = true},
        costs: [
            {resource: this.hopeFruit, count: new Decimal(3)}
        ]
    })

    circularFruit: SingleResource = new SingleResource({
        get: ()=>this.data.fruits.circular,
        setDecimal: (dec)=>this.data.fruits.circular = dec,
        name: 'Circular Fruit'
    })

    squareFruit: SingleResource = new SingleResource({
        get: ()=>this.data.fruits.square,
        setDecimal: (dec)=>this.data.fruits.square = dec,
        name: 'Square Fruit'
    })

    triangularFruit: SingleResource = new SingleResource({
        get: ()=>this.data.fruits.triangular,
        setDecimal: (dec)=>this.data.fruits.triangular = dec,
        name: 'Triangular Fruit'
    })

    bunchedFruit: SingleResource = new SingleResource({
        get: ()=>this.data.fruits.bunched,
        setDecimal: (dec)=>this.data.fruits.bunched = dec,
        name: 'Bunched Fruit'
    })

    resetGarden = () => {
        this.engine.datamap.garden = GardenData_Init();
    }
     
 }

export const TimeRequiredForSeed = MINUTE_MS * 60;

export enum SeedType {
    hope,
    circle,
    square,
    bunch,
    triangle,
}

export interface GardenSeed {
    type: SeedType;
    level: number;
}

export interface GardenPlant {
    seed: GardenSeed;
    plantTimer: number;
    water: number;
}

export interface GardenData {
    seedTimer: number;
    seeds: Decimal;
    bag: GardenSeed[];
    plots: GardenPlant[];
    fruits: {
        hope: Decimal
        circular: Decimal;
        triangular: Decimal
        bunched: Decimal;
        square: Decimal
    }
    researches: {
        progression: number;
        expansion: number;
        watering: boolean;
        typeCircle: boolean;
        typeSquare: boolean;
        typeBunch: boolean;
        typeTriangle: boolean;
    }
    bagSlot1: GardenSeed | null;
    bagSlot2: GardenSeed | null;
    bagSlot3: GardenSeed | null;
    gardenSlot1: GardenPlant | null;
    gardenSlot2: GardenPlant | null;
    gardenSlot3: GardenPlant | null;
    gardenSlot4: GardenPlant | null;
    gardenSlot5: GardenPlant | null;
    gardenSlot6: GardenPlant | null;
    gardenSlot7: GardenPlant | null;
    gardenSlot8: GardenPlant | null;
    gardenSlot9: GardenPlant | null;
}

export function GardenData_Init (): GardenData {
    const ZERO = new Decimal(0);
    return {
        seedTimer: 0,
        seeds: ZERO,
        bag: [],
        plots : [],
        bagSlot1: null,
        bagSlot2: null,
        bagSlot3: null,
        gardenSlot1: null,        
        gardenSlot2: null,        
        gardenSlot3: null,        
        gardenSlot4: null,        
        gardenSlot5: null,        
        gardenSlot6: null,        
        gardenSlot7: null,        
        gardenSlot8: null,        
        gardenSlot9: null,        
        fruits: {
            hope : new Decimal(0),
            bunched: new Decimal(0),
            circular: new Decimal(0),
            square: new Decimal(0),
            triangular: new Decimal(0),
        },
        researches: {
            progression: 0,
            expansion: 0,
            watering: false,
            typeBunch: false,
            typeCircle: false,
            typeSquare: false,
            typeTriangle: false,
        }
    }
}

export function GardenData_SetDecimals (data:Datamap) {
    data.garden.seeds = new Decimal(data.garden.seeds)

    data.garden.fruits.hope = new Decimal(data.garden.fruits.hope)
    data.garden.fruits.bunched = new Decimal(data.garden.fruits.bunched)
    data.garden.fruits.circular = new Decimal(data.garden.fruits.circular)
    data.garden.fruits.square = new Decimal(data.garden.fruits.square)
    data.garden.fruits.triangular = new Decimal(data.garden.fruits.triangular)
    
}


export function SeedGrowthTimeRequired (seed: GardenSeed) {
    let base  = TimeRequiredForSeed;
    let mult = seed.type + 1;
    return base * mult;
}