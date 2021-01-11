import Decimal from "break_infinity.js";
import { log, timeStamp } from "console";
import { isUndefined } from "lodash";
import { prependListener } from "process";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { getRandomInt, MINUTE_MS } from "../externalfns/util";
import { SingleResearch } from "../Research";

export default class Garden {

    chosenSeed: number | undefined = undefined;
    maxBagSlots: number = 0;
    maxgGardenPlots: number = 0;
    constructor(public engine: Engine) {
        this.setTempData();
    }

    get equipment() {
        return this.engine.crafting.gardeningCalcData;
    }

    setTempData = () => {
        this.maxBagSlots = this.calcBagSlots();
        this.maxgGardenPlots = this.calcGardenPlots();
        this.setPlantSpeedMult();
        this.setWaterTime();
        this.setDoomFruitMult();
        this.setFruitGainMulti();
        this.setGardenJobSpeedMult();
        this.setGardenSpeedMulti();

    }

    calcBagSlots = () => {
        let base = 1 + this.data.researches.expansion + this.data.researches.bagExpansion + this.equipment.bagSlots;
        if (this.engine.datamap.jobs.notReset.upgrades.garden >= 4) base++;
        return base
    }

    calcGardenPlots = () => {
        let base = 1 + this.data.researches.expansion + this.equipment.gardenPlots;
        if (this.engine.datamap.unlocksStates.one >= 6) base++;
        if (this.engine.datamap.jobs.notReset.upgrades.garden >= 3) base++;
        return base
    }

    get data() {
        return this.engine.datamap.garden;
    }

    plantSeed = (bagIndex: number) => {
        this.quietPlantSeed(bagIndex);
        this.engine.notify();
    }

    quietPlantSeed = (bagIndex: number) => {
        const seed = this.data.bag[bagIndex];
        if (isUndefined(seed)) {
            return;
        }

        if (this.canPlantSeed()) {
            this.data.plots.push(this.getPlant(seed))
            this.data.bag.splice(bagIndex, 1);

            if (this.data.researches.doomedSeeds) {
                const rng = getRandomInt(1, 100);
                if (rng <= this.doomChance()) {
                    this.getSeedType(SeedType.doom)
                }
            }
        }
    }

    doomChance = () => {
        return 10 + this.equipment.doomChance
    }

    discardSeed = (bagIndex: number) => {
        const seed = this.data.bag[bagIndex];
        if (isUndefined(seed)) {
            return;
        }

        if (seed.type === SeedType.doom) {

        }

        else if (this.data.researches.doomedSeeds2) {
            this.data.bag.splice(bagIndex, 1);
            this.engine.doom.gainResource(1);

            const rng = getRandomInt(1, 100);
            if (rng <= this.doomChance()) {
                this.getSeedType(SeedType.doom)
            }
        }
        this.engine.notify();
    }


    canGetSeed = () => {
        const t1 = this.data.bag.length < this.maxBagSlots
        const t2 = this.data.seeds.greaterThanOrEqualTo(1);
        return t1 && t2
    }

    canPlantSeed = () => {
        return this.data.plots.length < this.maxgGardenPlots
    }

    gardenSpeedMulti = new Decimal(1);
    setGardenSpeedMulti = () => {
        let base = new Decimal(1);
        let incresed = new Decimal(1);
        let more = new Decimal(1);

        if (this.engine.datamap.cell.doomGardenSpeed.greaterThan(0)) {
            incresed = incresed.add(this.engine.datamap.cell.doomGardenSpeed.times(.1))
        }

        if (this.engine.datamap.cell.rebirth.greaterThan(0)) {
            more = more.times(this.engine.datamap.cell.rebirth.add(1))
        }

        this.gardenSpeedMulti = base.times(more).times(incresed);
    }

    processDelta = (delta: number) => {

        delta = delta * this.gardenSpeedMulti.toNumber();

        if (this.equipment.autoPlant) {
            if (this.data.bag.length > 0) {
                if (this.canPlantSeed()) {
                    this.quietPlantSeed(0);
                }
            }
        }

        this.data.seedTimer += delta * this.engine.jobs.seedGainSpeedMult * this.engine.crafting.gardeningCalcData.seedGainMore;
        if (this.data.seedTimer >= TimeRequiredForSeed) {
            this.data.seeds = this.data.seeds.add(1);
            this.data.seedTimer -= TimeRequiredForSeed
            if (this.data.researches.progression === 0) {
                this.data.researches.progression = 1
            }
        }

        delta = Math.floor(delta * this.plantSpeedMult)
        if (this.data.plots.length > 0) {
            this.data.plots.forEach((plot, index) => {
                //console.log('andling plot', index, plot.plantTimer, delta);

                plot.plantTimer += delta;
                if (plot.water) {
                    const extra = Math.min(plot.water, delta);

                    plot.plantTimer += extra;
                    if (this.engine.datamap.jobs.notReset.upgrades.garden >= 2) plot.plantTimer += extra
                    if (this.denseWater.count.greaterThan(0)) plot.plantTimer += this.denseWater.count.times(extra).toNumber()

                    plot.water -= extra;
                } else if (this.equipment.autoWater) {
                    if (SeedGrowthTimeRequired(plot.seed) > plot.plantTimer) {
                        let rng = getRandomInt(1, 100)
                        if (rng === 100) this.engine.crafting.breakWateringCan();
                        this.waterPlantQuietly(index);
                    }
                }
            })
            if (this.equipment.autoHarvest) for (let index = this.data.plots.length - 1; index >= 0; index--) {
                this.quietHarvest(index);
            }
        }


        //console.log('end of garden delta');

    }

    quietHarvest = (index: number) => {
        const plant = this.data.plots[index];
        if (SeedGrowthTimeRequired(plant.seed) <= plant.plantTimer) {
            this.data.plots.splice(index, 1)
            this.getFruit(plant.seed.type)
            if (this.data.researches.progression === 2) {
                this.data.researches.progression = 3
            }
        }
    }



    harvest = (index: number) => {
        if (index >= this.data.plots.length) return;
        this.quietHarvest(index);
        this.engine.notify();
    }

    getFruitGain = () => {
        const base = this.equipment.fruitGainBase + 1;
        return base * this.fruitGainMult;
    }

    getFruit(type: SeedType) {
        let gain = this.getFruitGain();

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
            case SeedType.egg:
                this.eggFruit.gainResource(gain);
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
        if (this.data.researches.typeEgg) possibleTypes.push(SeedType.egg);
        let rng = getRandomInt(0, possibleTypes.length - 1);
        //console.log(possibleTypes, rng);

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

    waterPlantQuietly = (index: number) => {
        if (this.data.plots.length <= index) return;
        else {
            this.data.plots[index].water = this.waterTimeBase.times(this.waterTimeMulti).toNumber();
        }
    }

    waterPlant = (index: number) => {
        this.waterPlantQuietly(index);
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
        description: "You can generate circular seeds now\nCircular Fruits speed up plant growth",
        get: () => this.data.researches.typeCircle,
        makeTrue: () => { this.data.researches.typeCircle = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_squre: SingleResearch = new SingleResearch({
        name: "Square Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate square seeds now\n Square fruits are used for garden expansion",
        get: () => this.data.researches.typeSquare,
        makeTrue: () => { this.data.researches.typeSquare = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_bunch: SingleResearch = new SingleResearch({
        name: "Bunched Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate bunched seeds now\nBunched fruits make all plants provide more fruit",
        get: () => this.data.researches.typeBunch,
        makeTrue: () => { this.data.researches.typeBunch = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_triangle: SingleResearch = new SingleResearch({
        name: "Trianglular Seeds",
        hidden: () => this.data.researches.expansion === 0,
        description: "You can generate triangular seeds now\nTriangular fruits give more watering duration",
        get: () => this.data.researches.typeTriangle,
        makeTrue: () => { this.data.researches.typeTriangle = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(3) }
        ]
    })

    res_seedtype_egg: SingleResearch = new SingleResearch({
        name: "Egg Shaped Seeds",
        hidden: () => this.data.researches.expansion === 0 || this.engine.datamap.unlocksStates.one < 6,
        description: "You can generate egg seeds now\n Egg fruits provide more job speed",
        get: () => this.data.researches.typeEgg,
        makeTrue: () => { this.data.researches.typeEgg = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(30) }
        ]
    })

    circularFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.circular,
        setDecimal: (dec) => {
            this.data.fruits.circular = dec;
            this.setPlantSpeedMult();
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

    eggFruit: SingleResource = new SingleResource({
        get: () => this.data.fruits.egg,
        setDecimal: (dec) => {
            this.data.fruits.egg = dec;
            this.engine.jobs.calcJobSpeed();

        },
        name: 'Egg Fruit'
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

    res_doomedDiscard: SingleResearch = new SingleResearch({
        name: "Doomed Discard",
        hidden: () => this.data.researches.doomedSeeds === false,
        description: "You can discard seeds for exactly 1 doom.\nSometimes this replaces the seed instead.",
        get: () => this.data.researches.doomedSeeds2,
        makeTrue: () => { this.data.researches.doomedSeeds2 = true },
        costs: [
            { resource: this.hopeFruit, count: new Decimal(20) },
            { resource: this.engine.doom, count: new Decimal(1e7) }
        ]
    })


    doomedFruits: SingleResource = new SingleResource({
        get: () => this.data.fruits.doom,
        setDecimal: (dec) => this.data.fruits.doom = dec,
        name: 'Fruit of Doom'
    })

    plantSpeedMult = 1;
    setPlantSpeedMult = () => {

        let mult = Decimal.ln(this.data.fruits.circular.add(1)) + 1;

        //console.log('calcing garden speed mult',mult);
        if (this.equipment.plantGrowthMulti !== 1) {
            mult = mult * this.equipment.plantGrowthMulti;
        }
        this.plantSpeedMult = mult;
    }

    waterTimeMulti = new Decimal(1);
    waterTimeBase = new Decimal(1);
    setWaterTime = () => {
        let mult = this.data.fruits.triangular.divideBy(5).add(1);
        if (this.engine.datamap.jobs.notReset.upgrades.garden >= 1) {
            mult = mult.times(2)
        }
        if (this.equipment.waterTimeMulti !== 1) {
            mult = mult.times(this.equipment.waterTimeMulti);
        }
        if (this.data.buildings.denseWater.greaterThan(0)) {
            mult = mult.divideBy(this.data.buildings.denseWater.add(1))
        }
        this.waterTimeMulti = mult;

        const base = this.data.buildings.wateringCan.times(1000).add(MINUTE_MS * 2).add(this.equipment.waterTimeBase * 1000);
        this.waterTimeBase = base;
    }

    fruitGainMult = 1;
    setFruitGainMulti = () => {
        const mult = this.data.fruits.bunched.times(.01).add(1);
        let scaled = Decimal.ln(mult);
        if (this.bunchPower.count.greaterThan(0)) {
            scaled += scaled * this.bunchPower.count.toNumber();
        }
        scaled += 1;
        if (this.equipment.fruitGainMulti !== 1) {
            scaled = scaled * this.equipment.fruitGainMulti;
        }
        this.fruitGainMult = scaled;
    }

    doomFruitMult = new Decimal(1);
    setDoomFruitMult = () => {
        const mult = this.data.fruits.doom.add(1);
        this.doomFruitMult = mult;
    }

    gardenJobSpeedMult = new Decimal(1);
    setGardenJobSpeedMult = () => {
        const mult = this.data.fruits.egg.div(1).add(1);
        this.gardenJobSpeedMult = Decimal.add(1, Decimal.ln(mult));
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
            { resource: this.squareFruit, count: new Decimal(6) },
            { resource: this.hopeFruit, count: new Decimal(6) },
        ]
    })

    res_expansion_three: SingleResearch = new SingleResearch({
        name: "Square Expansion 2",
        hidden: () => this.data.researches.expansion < 2,
        description: "+1 Bag Slot / +1 Plot",
        get: () => this.data.researches.expansion > 2,
        makeTrue: () => {
            this.data.researches.expansion = 3
            this.setTempData();
        },
        costs: [
            { resource: this.squareFruit, count: new Decimal(19) },
            { resource: this.hopeFruit, count: new Decimal(19) },
        ],

    })

    resetGarden = () => {
        this.cleanGarden();
        this.engine.datamap.cell.rebirth = new Decimal(0);
        this.setTempData();
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

    cleanGarden = () => {
        this.engine.datamap.garden = GardenData_Init();
        this.engine.determination.reset();
    }

    rebirthReset = () => {
        
        this.cleanGarden();

        this.data.researches.progression = 1
        this.data.seeds = this.engine.datamap.cell.rebirth.times(24).floor();
        this.setTempData();
    }

    wateringCan: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Watering Can',
            get: () => this.data.buildings.wateringCan,
            setDecimal: (dec) => {
                this.data.buildings.wateringCan = dec;
                this.setWaterTime();
            },
        }),
        costs: [
            { expo: { initial: 1, coefficient: 1.3 }, resource: this.hopeFruit },
        ],
        description: `Base Watering Duration`,
        hidden: () => this.data.researches.watering === false,
        outcome: () => {
            return `+1s base watering duration\nCurrent: ${this.waterTimeBase.div(1000).floor()}s`
        },
    })

    denseWater: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Dense Water',
            get: () => this.data.buildings.denseWater,
            setDecimal: (dec) => {
                this.data.buildings.denseWater = dec;
                this.setWaterTime();
            },
        }),
        costs: [
            { expo: { initial: 1000, coefficient: 1.3 }, resource: this.engine.gloom },
            { expo: { initial: 10, coefficient: 1.45 }, resource: this.doomedFruits },
        ],
        description: `Water dries up faster, but gives more plant growth`,
        hidden: () => this.engine.datamap.unlocksStates.two < 3,
        outcome: () => {
            const now = this.data.buildings.denseWater.add(1);
            return `${now.floor()}x -> ${now.add(1).floor()}x more plant growth water use`
        },
    })

    bunchPower: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Bunched Fruit Power',
            get: () => this.data.buildings.bunchPower,
            setDecimal: (dec) => {
                this.data.buildings.bunchPower = dec;
                this.setFruitGainMulti();
            },
        }),
        costs: [
            { expo: { initial: 5, coefficient: 1.42 }, resource: this.squareFruit },
        ],
        description: `Bunched Fruit provide more Fruit Gain Multiplier`,
        hidden: () => this.engine.datamap.cell.rebirth.lessThan(1),
        outcome: () => {
            const now = this.data.buildings.bunchPower.add(1);
            return `${now.floor()}x -> ${now.add(1).floor()}x more multi from Bunched Fruit`
        },
    })

    seedGeneration: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Make Some Seeds',
            get: () => this.data.buildings.seedGeneration,
            setDecimal: (dec) => {
                this.data.buildings.seedGeneration = dec;
                this.data.seeds = this.data.seeds.add(dec)
                if (this.data.researches.progression === 0) {
                    this.data.researches.progression = 1
                }
            },
        }),
        costs: [
            { expo: { initial: 5000, coefficient: 2 }, resource: this.engine.gloom },
        ],
        description: `Add seeds to your stockpile`,
        hidden: () => this.engine.datamap.unlocksStates.two < 3,
        outcome: () => {
            return `+${this.data.buildings.seedGeneration.add(1)} seeds `
        },
    })

}

export const TimeRequiredForSeed = MINUTE_MS * 60;

export enum SeedType {
    hope,
    circle,
    square,
    bunch,
    triangle,
    doom,
    egg
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
        egg: Decimal
        doom: Decimal;
    }
    buildings: {
        wateringCan: Decimal;
        denseWater: Decimal;
        bunchPower: Decimal;
        seedGeneration: Decimal;
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
        typeEgg: boolean;
        doomedSeeds: boolean;
        doomedSeeds2: boolean;
        doomedSeeds3: boolean;
        doomedSeeds4: boolean;
        doomedSeeds5: boolean;
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
            egg: new Decimal(0),
            doom: new Decimal(0),
        },
        buildings: {
            wateringCan: new Decimal(0),
            denseWater: new Decimal(0),
            bunchPower: new Decimal(0),
            seedGeneration: new Decimal(0),
        },
        researches: {
            progression: 0,
            expansion: 0,
            bagExpansion: 0,
            watering: false,
            typeBunch: false,
            typeCircle: false,
            typeEgg: false,
            typeSquare: false,
            typeTriangle: false,
            doomedSeeds: false,
            doomedSeeds2: false,
            doomedSeeds3: false,
            doomedSeeds4: false,
            doomedSeeds5: false,
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
    data.garden.fruits.egg = new Decimal(data.garden.fruits.egg)

    data.garden.buildings.wateringCan = new Decimal(data.garden.buildings.wateringCan);
    data.garden.buildings.denseWater = new Decimal(data.garden.buildings.denseWater);
    data.garden.buildings.bunchPower = new Decimal(data.garden.buildings.bunchPower);
    data.garden.buildings.seedGeneration = new Decimal(data.garden.buildings.seedGeneration);
}


export function SeedGrowthTimeRequired(seed: GardenSeed) {
    let base = TimeRequiredForSeed;
    let mult = seed.type + 1;
    return base * mult;
}