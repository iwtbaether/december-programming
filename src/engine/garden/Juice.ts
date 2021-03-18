import Decimal, { DecimalSource } from "break_infinity.js";
import { IframeHTMLAttributes } from "react";
import { sum_I_FruitDecimals } from "../../UI/layout/mainrows/JuiceRow";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { moreDecimal, percentOfNum } from "../externalfns/util";
import { I_FruitDecimals, I_FruitDecimals_SetDecimals, SeedType } from "./Garden";

export default class JuiceLmao {
    constructor(public engine: Engine) {

    }

    setup(){
        this.calcDrinkPowers();
    }

    tickLength = 10000; //10,000 ms || 10 seconds
    tickCounter = 0
    processDelta = (deltaMs: number) => {
        this.tickCounter += deltaMs;
        if (this.tickCounter >= this.tickLength) {
            this.tickCounter -= this.tickLength;
            this.tick();
        }
    }

    tickedNumbers = {
        toHopper: ZERO,
        toPlant: ZERO,
        usedPPF: ZERO,
        powerGain: ZERO,
        toDecay: ZERO,
        crushed: ZERO,
    }

    tick = () => {
        //console.log('juicetick');

        //repair can
        if (this.data.guide === GuideTypes.Guth) {
            if (this.engine.crafting.fixWateringCan()) {
                this.engine.datamap.garden.fruits.hope = ZERO;
            }
        }

        if (this.data.fillingHopper) {
            let chosneFruit = this.getFuelFruit();
            if (chosneFruit === undefined) {
                //zammy is on boys!
                this.engine.garden.zammyHarvest();
            } else {

                const gain = this.fillHopper(Decimal.min(chosneFruit.count, this.calced_hopperFillSpeed.current));

                this.tickedNumbers.toHopper = gain;
                chosneFruit.loseResource(gain)
                this.data.hopperFruit = this.data.hopperFruit.add(gain)
            }

        } else {
            this.tickedNumbers.toHopper = ZERO;
        }
        this.hopperToPlant();
        this.plantToPower();
        this.crushFruit();
    }

    drinkPowers: I_DrinkPowers = {
        //base power
        basePower: 0,
    }

    fillHopper = (ammount: DecimalSource): Decimal => {
        let maxCanGain = Decimal.max(0, this.calced_maxHopperFill.current.minus(this.data.hopperFruit));
        let gain = Decimal.min(maxCanGain, ammount);
        this.data.hopperFruit = this.data.hopperFruit.add(gain)
        return gain;
    }

    crushFruit = () => {
        let tc = this.data.toCrush;
        if (tc === null) return;
        let fruitResource = this.engine.garden.seedTypeToResource(tc);
        let onePercentOfPower = this.data.powerAmount.times(.01)
        let resourceCount = fruitResource.count;
        let toUse = Decimal.min(onePercentOfPower, resourceCount);

        this.tickedNumbers.crushed = toUse;

        this.data.powerAmount = this.data.powerAmount.minus(toUse);
        fruitResource.loseResource(toUse);
        this.seedTypeToJuice(tc, toUse);
    }

    getTotalJuice = () => {
        let crushed = this.data.crushed;
        let total = crushed.bunched.add(crushed.circular).add(crushed.doom).add(crushed.egg).add(crushed.hope).add(
            crushed.knowledge).add(crushed.plain).add(crushed.square).add(crushed.triangular);
        return total;
    }


    hopperToPlant = () => {
        let pipeSize = new Decimal(.01);
        if (this.data.pipe_hopper_powerPlant_level.greaterThan(0)) {
            pipeSize = moreDecimal(pipeSize,this.data.pipe_hopper_powerPlant_level.times(.01))
        }
        let diff = this.data.hopperFruit.times(pipeSize);
        this.tickedNumbers.toPlant = diff;
        this.data.hopperFruit = this.data.hopperFruit.minus(diff);
        this.data.powerPlantFruit = this.data.powerPlantFruit.add(diff)
    }

    plantToPower = () => {
        //convert fruit to power
        if (this.data.powerPlantFruit.greaterThan(0)) {

            let diff = new Decimal(this.data.powerPlantFruit.log10() / 4).max(0);
            //if ppf is under 1 this returns a -. need to fix.;

            const usedPPF = this.tickedNumbers.usedPPF = diff.times(2);

            //diff = Decimal.max(diff, diff.abs().div(10))
            //lose x fruit
            this.data.powerPlantFruit = this.data.powerPlantFruit.minus(usedPPF);
            // x div 2 gets wasted
            this.data.fruitsSpentMakingPower = this.data.fruitsSpentMakingPower.add(diff);
            // x div 2 goes to power
            let powerGain = diff;
            if (this.drinkPowers.g1) {
                powerGain = powerGain.add(powerGain.times(this.drinkPowers.g1));
            }
            if (this.data.powerPlantLevel.greaterThan(0)) {
                powerGain = moreDecimal(powerGain, this.data.powerPlantLevel.times(.01))
            }
            this.data.powerAmount = this.data.powerAmount.add(powerGain)
            this.tickedNumbers.powerGain = powerGain
        } else {
            this.tickedNumbers.usedPPF = ZERO;
        }

        //power decays
        const decay = this.data.powerAmount.times(.01)
        this.tickedNumbers.toDecay = decay;
        this.data.powerAmount = this.data.powerAmount.minus(decay)
        this.data.powerDecayed = this.data.powerDecayed.add(decay)
    }

    getFuelFruit = () => {
        if (this.data.guide === GuideTypes.Sara) return this.engine.garden.doomedFruits;
        if (this.data.guide === GuideTypes.Guth) return this.engine.garden.plainFruit;
    }

    calc = () => {
        this.calced_hopperFillSpeed.set();
        this.calced_maxHopperFill.set();
    }

    calced_hopperFillSpeed = new CalcedDecimal(() => {
        let calc = new Decimal(1)
        let fromRebirth = this.engine.datamap.cell.rebirth;
        return calc.add(fromRebirth);
    })
    calced_maxHopperFill = new CalcedDecimal(() => {
        let calc = new Decimal(100);
        if (this.data.hopperLevel.greaterThan(0)) {
            calc = calc.add(this.data.hopperLevel.times(10))
        }
        if (this.drinkPowers.s4) {
            calc = calc.times(this.drinkPowers.s4)
        };
        return calc;
    })

    get data() {
        return this.engine.datamap.juice;
    }

    toggleHopper = () => {
        this.data.fillingHopper = !this.data.fillingHopper
        this.engine.notify();
    }


    chooseGuide = (chosen: GuideTypes) => {
        if (this.data.guide === GuideTypes.none) {


            //SUBTRACT GUIDE COSTS
            if (chosen === GuideTypes.Guth) {
                this.engine.garden.plainFruit.loseResource(10000)
            } else if (chosen === GuideTypes.Zammy) {
                this.engine.garden.knowledgeFruit.loseResource(1);
            } else if (chosen === GuideTypes.Sara) {
                this.engine.garden.data.fruits.knowledge = ZERO;
                this.engine.garden.data.plots = this.engine.garden.data.plots.filter((plant) => {
                    return plant.seed.type !== SeedType.knowledge
                })
                this.engine.garden.data.bag = this.engine.garden.data.bag.filter((seed) => {
                    return seed.type !== SeedType.knowledge
                })
            }

            //set new guide
            this.data.guide = chosen;
            this.engine.notify();


        } else return;
    }

    startDrink = () => {
        //this.clearCrushedFruit();
        this.engine.setPopup(5);
    }

    //finish drink!
    finishDrink = () => {
        let last_crushed = this.data.crushed;
        let last_guide = this.data.guide;
        this.dataReset();
        this.data.last_crushed = last_crushed;
        this.data.last_guide = last_guide;
        this.calcDrinkPowers();
        this.engine.clearPopup();
    }


    



    calcDrinkPowers = () => {
        if (this.data.last_crushed) {
            const crushed = this.data.last_crushed;
            let DP = calcDrink(crushed)
            this.drinkPowers = DP

            this.engine.garden.setFruitGainMulti();
            this.engine.calcGloom();
            this.calced_maxHopperFill.set();
            this.engine.jobs.calcJobSpeed();
            
            //g1 auto
            this.engine.garden.setPlantSpeedMult();
            

            this.engine.calcEnergy();
        
        } else return;
    }




    setCrushedFruit = (chosen: SeedType) => {
        this.data.toCrush = chosen;
        this.engine.notify();
    }

    seedTypeToJuice = (type: SeedType, gain: DecimalSource) => {
        switch (type) {
            case SeedType.hope: this.data.crushed.hope = this.data.crushed.hope.add(gain);
                break;
            case SeedType.circle: this.data.crushed.circular = this.data.crushed.circular.add(gain);
                break;
            case SeedType.doom: this.data.crushed.doom = this.data.crushed.doom.add(gain);
                break;
            case SeedType.bunch: this.data.crushed.bunched = this.data.crushed.bunched.add(gain);
                break;
            case SeedType.triangle: this.data.crushed.triangular = this.data.crushed.triangular.add(gain);
                break;
            case SeedType.square:
                this.data.crushed.square = this.data.crushed.square.add(gain);
                break;
            case SeedType.egg:
                this.data.crushed.egg = this.data.crushed.egg.add(gain);
                break;

            case SeedType.plain:
                this.data.crushed.plain = this.data.crushed.plain.add(gain);
                break;
            case SeedType.knowledge:
                this.data.crushed.knowledge = this.data.crushed.knowledge.add(gain);
                break;

            default:
                throw new Error("no seed type?");

                break;
        }
    }

    clearCrushedFruit = () => {
        this.data.toCrush = null;
        this.engine.notify();
    }

    getRequiredFuelFriuit = () => {
        switch (this.data.guide) {
            case GuideTypes.Sara:
                return SeedType.doom
                break;

            case GuideTypes.Guth:
                return SeedType.plain

            default:
                return undefined;
                break;
        }
    }


    dataReset = () => {
        this.engine.datamap.juice = JuiceData_Init();
    }

    hopeJuide: SingleResource = new SingleResource({
        get: () => this.data.crushed.hope,
        setDecimal: (dec) => this.data.crushed.hope = dec,
        name: 'Hope Juide'
    })

    circularJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.circular,
        setDecimal: (dec) => {
            this.data.crushed.circular = dec;
            //this.setPlantSpeedMult();
        },
        name: 'Circular Juice'
    })

    squareJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.square,
        setDecimal: (dec) => this.data.crushed.square = dec,
        name: 'Square Juice'
    })

    triangularJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.triangular,
        setDecimal: (dec) => this.data.crushed.triangular = dec,
        name: 'Triangular Juice'
    })

    bunchedJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.bunched,
        setDecimal: (dec) => this.data.crushed.bunched = dec,
        name: 'Bunched Juice'
    })

    eggJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.egg,
        setDecimal: (dec) => {
            this.data.crushed.egg = dec;
            //this.engine.jobs.calcJobSpeed();
        },
        name: 'Egg Juice'
    })

    plainJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.plain,
        setDecimal: (dec) => {
            this.data.crushed.plain = dec;
            //calc new things
        },
        name: 'Plain Juice'
    })

    knowledgeJuice: SingleResource = new SingleResource({
        get: () => this.data.crushed.knowledge,
        setDecimal: (dec) => {
            this.data.crushed.knowledge = dec;
            //calc new things
        },
        name: 'Knowledge Juice'
    })

    doomedJuices: SingleResource = new SingleResource({
        get: () => this.data.crushed.doom,
        setDecimal: (dec) => this.data.crushed.doom = dec,
        name: 'Juide of Doom'
    })

    powerResource: SingleResource = new SingleResource({
        get: () => this.data.powerAmount,
        setDecimal: (dec) => this.data.powerAmount = dec,
        name: 'Power'
    })

    hopperLevel: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Big Hopper',
            get: () => this.engine.datamap.juice.hopperLevel,
            setDecimal: (dec) => {
                this.engine.datamap.juice.hopperLevel = dec;
                this.calced_maxHopperFill.set();
            },
        }),
        costs: [
            { expo: { initial: 20, coefficient: 1.5 }, resource: this.powerResource },
        ],
        description: `More Fruit can be stored in the hopper`,
        hidden: () => false,
        outcome: () => {
            return `+10 Base Hopper Size`
        },
    })

    pipeLevel: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Slightly Bigger Pipe',
            get: () => this.engine.datamap.juice.pipe_hopper_powerPlant_level,
            setDecimal: (dec) => {
                this.engine.datamap.juice.pipe_hopper_powerPlant_level = dec;
                //calc???
            },
        }),
        costs: [
            { expo: { initial: 20, coefficient: 1.5 }, resource: this.powerResource },
        ],
        description: `Increases the ammount of Fruits piped`,
        hidden: () => false,
        outcome: () => {
            return `1% increased Fruits piped per level`
        },
    })

    powerplantLevel: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            name: 'Powerplant Level',
            get: () => this.engine.datamap.juice.powerPlantLevel,
            setDecimal: (dec) => {
                this.engine.datamap.juice.powerPlantLevel = dec;
                //calc???
            },
        }),
        costs: [
            { expo: { initial: 20, coefficient: 1.5 }, resource: this.powerResource },
        ],
        description: `Inreases Power Generation`,
        hidden: () => false,
        outcome: () => {
            return `1% increased Power Generation per level`
        },
    })

}


export enum GuideTypes {
    none, Sara, Guth, Zammy
    //none is the initial state,
    //Sara is the "Holy God" disables Discard, Consumes Doom Fruit to Juice. 
    //  Costs All your Plain & Knowledge Fruit
    //Guth is down to earth, Consumes Plain Fruit to Juice
    //   Costs Plain Fruit
    //Zammy is demanding, consumes your harvested fruit to Juice.
    //   Doesn't Cost anything
}

export interface JuiceData {
    fillingHopper: boolean;
    guide: GuideTypes;
    toCrush: SeedType | null;
    hopperFruit: Decimal;
    hopperLevel: Decimal;
    pipe_hopper_powerPlant_level: Decimal;
    powerPlantFruit: Decimal;
    powerPlantLevel: Decimal;
    powerAmount: Decimal;

    //waste stats
    fruitsSpentMakingPower: Decimal;
    powerDecayed: Decimal;
    crushed: I_FruitDecimals;
    last_crushed?: I_FruitDecimals;
    last_guide?: GuideTypes;

}

export function calcDrink(crushed: I_FruitDecimals): I_DrinkPowers {

    //initialize power and dp object from juice
    const totalFruit = sum_I_FruitDecimals(crushed);
    const basePower = Decimal.log10(totalFruit) - 1;
    let DP: I_DrinkPowers = { basePower }

    let silverPowers = getSilverPowerArray(crushed);
    let goldPowersAndValues = getGoldPowerArray(crushed);
    let goldPowers = goldPowersAndValues.getEm;
    let goldValues = goldPowersAndValues.sPD;

    //bcest
    if (silverPowers[0] === true) {
        DP.s1 = Decimal.times(1.1, basePower)
    }
    if (silverPowers[1] === true) {
        DP.s2 = Decimal.times(.9, basePower);
    }
    if (silverPowers[2] === true) {
        DP.s3 = Decimal.times(.95, basePower);
    }
    if (silverPowers[3] === true) {
        DP.s4 = Decimal.times(1.05, basePower);
    }
    if (silverPowers[4] === true) {
        DP.s5 = ZERO;
    }

    if (goldPowers[0] === true) {
        DP.g1 = (goldValues[0].times(basePower));
    }
    if (goldPowers[1] === true) {
        DP.g2 = (goldValues[1].times(basePower));
    }
    if (goldPowers[2] === true) {
        DP.g3 = (goldValues[2].times(basePower));
    }
    if (goldPowers[3] === true) {
        DP.g4 = (goldValues[3].times(basePower));
    }
    if (goldPowers[4] === true) {
        DP.g5 = Decimal.max( Decimal.log10(goldValues[4].times(basePower)) , 1 );
    }

    const sumHD = crushed.hope.add(crushed.doom)
    if (sumHD.greaterThan(0)) {
        DP.hd = crushed.hope.div(crushed.doom.add(crushed.hope))
    }   
    

    /**
     const pointLengths = [
                    percentOfNum(juices.bunched.toNumber(),starTotal)+10,
                    percentOfNum(juices.circular.toNumber(),starTotal)+10,
                    percentOfNum(juices.egg.toNumber(),starTotal)+10,
                    percentOfNum(juices.square.toNumber(),starTotal)+10,
                    percentOfNum(juices.triangular.toNumber(),starTotal)+10,
                ]

                if (juices.bunched.greaterThan(100)) drawStar2(ctx, 38, 38 * 1, 5, 20, 10, 'silver', 'silver')
                if (juices.circular.greaterThan(100)) drawStar2(ctx, 38, 38 * 2, 5, 20, 10, 'silver', 'silver')
                if (juices.egg.greaterThan(100)) drawStar2(ctx, 38, 38 * 3, 5, 20, 10, 'silver', 'silver')
                if (juices.square.greaterThan(100)) drawStar2(ctx, 38, 38 * 4, 5, 20, 10, 'silver', 'silver')
                if (juices.triangular.greaterThan(100)) drawStar2(ctx, 38, 38 * 5, 5, 20, 10, 'silver', 'silver')
     */

    //return dp object
    return DP;
}

function getSilverPowerArray (crushed: I_FruitDecimals):[boolean,boolean,boolean,boolean,boolean] {
    const getEm:[boolean,boolean,boolean,boolean,boolean] = [false,false,false,false,false];
    [crushed.bunched,crushed.circular,crushed.egg,crushed.square,crushed.triangular].forEach((dec,index)=>{
        if (dec.greaterThan(100)) getEm[index] = true
    })
    return getEm
}

function getGoldPowerArray (crushed: I_FruitDecimals) {
    const starTotal = crushed.bunched.add(crushed.circular).add(crushed.egg).add(crushed.square).add(crushed.triangular);
    const sPD = [
        Decimal.div(crushed.bunched, starTotal),
        Decimal.div(crushed.circular, starTotal),
        Decimal.div(crushed.egg, starTotal),
        Decimal.div(crushed.square, starTotal),
        Decimal.div(crushed.triangular, starTotal),
    ]
    const getEm:[boolean,boolean,boolean,boolean,boolean] = [false,false,false,false,false];
    sPD.forEach((dec,index)=>{
        if (dec.greaterThanOrEqualTo(.3)) getEm[index] = true
    })
    return {getEm, sPD}
}

export interface I_DrinkPowers {
    //base power
    basePower: number,

    //silver star powers (true or false)
    s1?: Decimal,
    s2?: Decimal,
    s3?: Decimal,
    s4?: Decimal,
    s5?: Decimal,

    //gold star powers (power determined by ratio)
    g1?: Decimal,
    g2?: Decimal,
    g3?: Decimal,
    g4?: Decimal,
    g5?: Decimal,

    // hope:doom ratio power
    hd?: Decimal,
}

/*
drinkPowers = {
    //base power
    basePower: 0,

    //silver star powers (true or false)
    s1: false, 
    s2: false,
    s3: false,
    s4: false,
    s5: false,

    //gold star powers (power determined by ratio)
    g1: ZERO,
    g2: ZERO,
    g3: ZERO,
    g4: ZERO,
    g5: ZERO,

    // hope:doom ratio power
    hd: ZERO,
}*/

const ZERO = new Decimal(0)

export function JuiceData_Init(): JuiceData {
    return {
        guide: GuideTypes.none,
        hopperFruit: ZERO,
        hopperLevel: ZERO,
        toCrush: null,
        pipe_hopper_powerPlant_level: ZERO,
        powerPlantFruit: ZERO,
        powerPlantLevel: ZERO,
        powerAmount: ZERO,
        fillingHopper: false,
        fruitsSpentMakingPower: ZERO,
        powerDecayed: ZERO,
        crushed: {
            bunched: ZERO,
            circular: ZERO,
            doom: ZERO,
            egg: ZERO,
            hope: ZERO,
            knowledge: ZERO,
            plain: ZERO,
            square: ZERO,
            triangular: ZERO
        }
    }
}

export function JuiceData_Fix(data: Datamap): Datamap {

    data.juice.hopperFruit = new Decimal(data.juice.hopperFruit)
    data.juice.hopperLevel = new Decimal(data.juice.hopperLevel)
    data.juice.pipe_hopper_powerPlant_level = new Decimal(data.juice.pipe_hopper_powerPlant_level)
    data.juice.powerPlantLevel = new Decimal(data.juice.powerPlantLevel)
    data.juice.powerPlantFruit = new Decimal(data.juice.powerPlantFruit)
    data.juice.powerAmount = new Decimal(data.juice.powerAmount)

    I_FruitDecimals_SetDecimals(data.juice.crushed)
    if (data.juice.last_crushed) I_FruitDecimals_SetDecimals(data.juice.last_crushed);

    data.juice.fruitsSpentMakingPower = new Decimal(data.juice.fruitsSpentMakingPower)
    data.juice.powerDecayed = new Decimal(data.juice.powerDecayed)


    return data;
}

/**
 *      === JUICE PLANS ===
 *  "Juicing is unlocked at difficulty 10"
 *   Each fruit represents a religious attribute when juiced
 *  Circular
 *  Square
 *  Triangular
 *  Bunched
 *  Egg
 *  Plain
 *  todo: Knowledge
 *  Hope
 *  Doom
 *
 */