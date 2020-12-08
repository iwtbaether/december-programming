import Decimal from "break_infinity.js";
import { timeStamp } from "console";
import { isUndefined } from "lodash";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { getRandomInt, MINUTE_MS } from "../externalfns/util";
import { SingleResearch } from "../Research";

export default class Garden {

    chosenSeed: number|undefined = undefined;
    maxBagSlots: number = 0;
    maxgGardenPlots: number = 0;
    constructor(public engine: Engine) {
        this.setTempData();
    }

    setTempData = () => {
        this.maxBagSlots = this.calcBagSlots();
        this.maxgGardenPlots = this.calcBagSlots();
        this.setGardenSpeedMult();
        this.setWaterTimeMulti();
        this.setDoomFruitMult();
        this.setSeedGainMulti();
    }

    calcBagSlots = () => {
        return 1 + this.data.researches.expansion + this.data.researches.bagExpansion;
    }

    calcGardenPlots = () => {
        return 1 + this.data.researches.expansion;
    }

    get data() {
        return this.engine.datamap.garden;
    }

    plantSeed = (bagIndex: number) => {
        const seed = this.data.bag[bagIndex];
        if (isUndefined(seed)) {
            return;
        }

        if (this.canPlantSeed()) {
            this.data.plots.push(this.getPlant(seed))
            this.data.bag.splice(bagIndex, 1);

            if (this.data.researches.doomedSeeds) {
                const rng = getRandomInt(1, 10);
                if (rng === 10) {
                    this.getSeedType(SeedType.doom)
                }
            }
        }
    }


    canGetSeed = () => {
        const t1= this.data.bag.length < this.maxBagSlots
        const t2 = this.data.seeds.greaterThanOrEqualTo(1);
        return t1 && t2
    }

    canPlantSeed = () => {
        return this.data.plots.length < this.maxgGardenPlots
    }

    processDelta = (delta: number) => {
        if (this.engine.datamap.cell.rebirth.greaterThan(0)) {
            delta = delta * this.engine.datamap.cell.rebirth.add(1).toNumber();
        }

        this.data.seedTimer += delta;
        if (this.data.seedTimer >= TimeRequiredForSeed) {
            this.data.seeds = this.data.seeds.add(1);
            this.data.seedTimer -= TimeRequiredForSeed
            if (this.data.researches.progression === 0) {
                this.data.researches.progression = 1
            }
        }
        
        delta = Math.floor(delta * this.gardenSpeedMult)
        if (this.data.plots.length > 0) {
            this.data.plots.forEach((plot, index) => {
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
        this.engine.notify();
    }

    getFruit(type: SeedType) {
        let gain = 1;
        if (this.data.fruits.bunched.greaterThan(0)) {
            gain = gain * this.seedGainMult
        }
        switch (type) {
            case SeedType.hope:
                this.hopeFruit.gainResource(gain);
                break;
            case SeedType.circle:
                this.circularFruit.gainResource(gain);
                break;
            case SeedType.doom: this.doomedFruits.gainResource(gain); break;
            case SeedType.bunch: this.bunchedFruit.gainResource(gain); break;
            case SeedType.triangle: this.triangularFruit.gainResource(gain); break;
            case SeedType.square:
                this.squareFruit.gainResource(gain);
                break;

            default:
                break;
        }
        this.setTempData();
    }

    getSeed = () => {
        if (!this.canGetSeed()) return;

        let possibleTypes: SeedType[] = [SeedType.hope];
        if (this.data.researches.typeBunch) possibleTypes.push(SeedType.bunch);
        if (this.data.researches.typeCircle) possibleTypes.push(SeedType.circle);
        if (this.data.researches.typeSquare) possibleTypes.push(SeedType.square);
        if (this.data.researches.typeTriangle) possibleTypes.push(SeedType.triangle);
        let rng = getRandomInt(0, possibleTypes.length - 1);
        console.log(possibleTypes, rng);
        
        let chosenType = possibleTypes[rng]

        const seed: GardenSeed = {
            type: chosenType,
            level: 1,
        }
        this.data.bag.push(seed);
        this.data.seeds = this.data.seeds.subtract(1);
        if (this.data.researches.progression === 1) {
            this.data.researches.progression = 2;
        }

        this.engine.notify();
    }

    getSeedType = (typ: SeedType) => {
        if (!this.canGetSeed()) return;
        const seed: GardenSeed = {
            type: typ,
            level: 1,
        }
        this.data.bag.push(seed);

    }

    getPlant = (seed: GardenSeed): GardenPlant => {
        return {
            plantTimer: 0,
            water: 0,
            seed: seed,
        }
    }

    waterPlant = (index: number) => {
        if (this.data.plots.length <= index) return;
        else {
            this.data.plots[index].water = MINUTE_MS * this.waterTimeMulti;
        }
        this.engine.notify();
    }

    hopeFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.hope,
        setDecimal: (dec) => this.data.fruits.hope = dec,
        name: 'Hope Fruit'
    })

    res_watering: SingleResearch = new SingleResearch({
        name: "Watering",
        hidden: () => false,
        description: "Watering Plants increases their growth speed",
        get: () => this.data.researches.watering,
        makeTrue: () => { this.data.researches.watering = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(2) }
        ]
    })

    res_expansion_one: SingleResearch = new SingleResearch({
        name: "Expansion",
        hidden: () => this.data.researches.watering === false,
        description: "+1 Bag Slot / +1 Plot",
        get: () => this.data.researches.expansion > 0,
        makeTrue: () => {
            this.data.researches.expansion = 1
            this.setTempData();
        },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    

    res_seedtype_circle: SingleResearch = new SingleResearch({
        name: "Circular Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate circular seeds now",
        get: () => this.data.researches.typeCircle,
        makeTrue: () => { this.data.researches.typeCircle = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_squre: SingleResearch = new SingleResearch({
        name: "Squre Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate square seeds now",
        get: () => this.data.researches.typeSquare,
        makeTrue: () => { this.data.researches.typeSquare = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_bunch: SingleResearch = new SingleResearch({
        name: "Bunched Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate bunched seeds now",
        get: () => this.data.researches.typeBunch,
        makeTrue: () => { this.data.researches.typeBunch = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_triangle: SingleResearch = new SingleResearch({
        name: "Trianglular Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate triangular seeds now",
        get: () => this.data.researches.typeTriangle,
        makeTrue: () => { this.data.researches.typeTriangle = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    circularFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.circular,
        setDecimal: (dec) => {
            this.data.fruits.circular = dec;
            this.setGardenSpeedMult();
        },
        name: 'Circular Fruit'
    })

    squareFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.square,
        setDecimal: (dec) => this.data.fruits.square = dec,
        name: 'Square Fruit'
    })

    triangularFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.triangular,
        setDecimal: (dec) => this.data.fruits.triangular = dec,
        name: 'Triangular Fruit'
    })

    bunchedFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.bunched,
        setDecimal: (dec) => this.data.fruits.bunched = dec,
        name: 'Bunched Fruit'
    })

    res_doomfromhope: SingleResearch = new SingleResearch({
        name: "Doomed Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "Sometimes you find a doom seed\nwhile planting another seed",
        get: () => this.data.researches.doomedSeeds,
        makeTrue: () => { this.data.researches.doomedSeeds = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(2) },
            { resource: this.engine.doom, count: new Decimal(1e6) }
        ]
    })

    doomedFruits: SingleResource = new SingleResource({
        get: () => this.data.fruits.doom,
        setDecimal: (dec) => this.data.fruits.doom = dec,
        name: 'Fruit of Doom'
    })

    gardenSpeedMult = 1;
    setGardenSpeedMult = () => {

        const mult = this.data.fruits.circular.times(.1).add(1).toNumber();
        //console.log('calcing garden speed mult',mult);
        this.gardenSpeedMult = mult;
    }

    waterTimeMulti = 1;
    setWaterTimeMulti = () => {
        const mult = this.data.fruits.triangular.add(1).toNumber();
        this.waterTimeMulti = mult;
    }

    seedGainMult = 1;
    setSeedGainMulti = () => {
        const mult = this.data.fruits.bunched.times(.1).add(1).toNumber();
        this.seedGainMult = mult;
    }

    doomFruitMult = new Decimal(1);
    setDoomFruitMult = () => {
        const mult = this.data.fruits.doom.add(1);
        this.doomFruitMult = mult;
    }

    res_expansion_two: SingleResearch = new SingleResearch({
        name: "Square Expansion",
        hidden: () => this.data.researches.typeSquare === false,
        description: "+1 Bag Slot / +1 Plot",
        get: () => this.data.researches.expansion > 1,
        makeTrue: () => {
            this.data.researches.expansion = 2
            this.setTempData();
        },
        costs: [
            { resource: this.squareFruit, count: new Decimal(25) },
            { resource: this.hopeFruit, count: new Decimal(25) },
        ]
    })

    resetGarden = () => {
        this.engine.datamap.garden = GardenData_Init();
    }

    rebirth: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Rebirth',
            get: () => this.engine.datamap.cell.rebirth,
            setDecimal: (dec) => {
                this.engine.datamap.cell.rebirth = dec;
                this.rebirthReset();
            },
        }),
        costs: [
            { expo: { initial: 3, coefficient: 5 }, resource: this.doomedFruits },
        ],
        description: `More Garden Speed, Resets Garden`,
        hidden: () => this.engine.datamap.cell.rebirth.lessThan(1) && this.engine.datamap.garden.fruits.doom.eq(0),
        outcome: () => {
            return `+1x Garden Speed\nCurrent: ${this.engine.datamap.cell.rebirth.add(1)}x`
        },
    })

    res_bag_expansion: SingleResearch = new SingleResearch({
        name: "Bigger Bag",
        hidden: () => this.data.researches.expansion < 2,
        description: "+1 Bag Slot",
        get: () => this.data.researches.bagExpansion > 0,
        makeTrue: () => {
            this.data.researches.bagExpansion = 1;
            this.setTempData();
        },
        costs: [
            { resource: this.squareFruit, count: new Decimal(50) },
        ]
    })
    

    rebirthReset = () => {
        this.resetGarden();
    }

}

export const TimeRequiredForSeed = MINUTE_MS * 60;

export enum SeedType {
    hope,
    circle,
    square,
    bunch,
    triangle,
    doom
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
        square: Decimal;
        doom: Decimal;
    }
    researches: {
        progression: number;
        expansion: number;
        bagExpansion: number;
        watering: boolean;
        typeCircle: boolean;
        typeSquare: boolean;
        typeBunch: boolean;
        typeTriangle: boolean;
        doomedSeeds: boolean;
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

export function GardenData_Init(): GardenData {
    const ZERO = new Decimal(0);
    return {
        seedTimer: 0,
        seeds: ZERO,
        bag: [],
        plots: [],
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
            hope: new Decimal(0),
            bunched: new Decimal(0),
            circular: new Decimal(0),
            square: new Decimal(0),
            triangular: new Decimal(0),
            doom: new Decimal(0)
        },
        researches: {
            progression: 0,
            expansion: 0,
            bagExpansion: 0,
            watering: false,
            typeBunch: false,
            typeCircle: false,
            typeSquare: false,
            typeTriangle: false,
            doomedSeeds: false,
        }
    }
}

export function GardenData_SetDecimals(data: Datamap) {
    data.garden.seeds = new Decimal(data.garden.seeds)

    data.garden.fruits.hope = new Decimal(data.garden.fruits.hope)
    data.garden.fruits.bunched = new Decimal(data.garden.fruits.bunched)
    data.garden.fruits.circular = new Decimal(data.garden.fruits.circular)
    data.garden.fruits.square = new Decimal(data.garden.fruits.square)
    data.garden.fruits.triangular = new Decimal(data.garden.fruits.triangular)
    data.garden.fruits.doom = new Decimal(data.garden.fruits.doom)

}


export function SeedGrowthTimeRequired(seed: GardenSeed) {
    let base = TimeRequiredForSeed;
    let mult = seed.type + 1;
    return base * mult;
}