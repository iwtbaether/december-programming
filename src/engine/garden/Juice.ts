import Decimal, { DecimalSource } from "break_infinity.js";
import { IframeHTMLAttributes } from "react";
import { Datamap } from "../Datamap";
import Engine from "../Engine";
import CalcedDecimal from "../externalfns/decimalInterfaces/CalcedDecimal";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { I_FruitDecimals, I_FruitDecimals_SetDecimals, SeedType } from "./Garden";

export default class JuiceLmao {
    constructor(public engine: Engine) {

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
        toPower: ZERO,
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

    fillHopper = (ammount: DecimalSource): Decimal => {
        let maxCanGain = Decimal.max(0,this.calced_maxHopperFill.current.minus(this.data.hopperFruit));
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
        let diff = this.data.hopperFruit.times(.01);
        this.tickedNumbers.toPlant = diff;
        this.data.hopperFruit = this.data.hopperFruit.minus(diff);
        this.data.powerPlantFruit = this.data.powerPlantFruit.add(diff)
    }

    plantToPower = () => {
        //convert fruit to power
        if (this.data.powerPlantFruit.greaterThan(0)) {

            let diff = new Decimal(this.data.powerPlantFruit.log10()/4) 

            this.tickedNumbers.toPower = diff.times(2);
            
            //diff = Decimal.max(diff, diff.abs().div(10))
            //lose x fruit
            this.data.powerPlantFruit = this.data.powerPlantFruit.minus(diff.times(2));
            // x div 2 gets wasted
            this.data.fruitsSpentMakingPower = this.data.fruitsSpentMakingPower.add(diff);
            // x div 2 goes to power
            this.data.powerAmount = this.data.powerAmount.add(diff)
        } else {
            this.tickedNumbers.toPower = ZERO;
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

    calced_hopperFillSpeed = new CalcedDecimal(()=>{
        let calc = new Decimal(1)
        let fromRebirth = this.engine.datamap.cell.rebirth;
        return calc.add(fromRebirth);
    })
    calced_maxHopperFill = new CalcedDecimal(()=>{
        let calc = new Decimal(100)
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
                this.engine.garden.data.plots = this.engine.garden.data.plots.filter((plant)=>{
                    return plant.seed.type !== SeedType.knowledge
                })
                this.engine.garden.data.bag = this.engine.garden.data.bag.filter((seed)=>{
                    return seed.type !== SeedType.knowledge
                })
            }
            
            //set new guide
            this.data.guide = chosen;
            this.engine.notify();


        } else return;
    }

    startDrink = () => {
        this.clearCrushedFruit();
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

        } else return;
    }

    setCrushedFruit = (chosen : SeedType) => {
        this.data.toCrush = chosen;
        this.engine.notify();
    }

    seedTypeToJuice = (type:SeedType, gain: DecimalSource) => {
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

export  function JuiceData_Fix (data: Datamap): Datamap {
    
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