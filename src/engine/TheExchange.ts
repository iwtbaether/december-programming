import Decimal from "break_infinity.js";
import Engine from "./Engine";
import { SingleBuilding } from "./externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";
import { CraftingData } from "./m_st/Crafting";
import { SingleResearch } from "./Research";

export default class TheExchange {
    constructor (public engine: Engine ){

    }

    
    get data (): CraftingData {
        return this.engine.datamap.crafting
    }

    get currency () {
        return this.engine.datamap.crafting.currency;
    }

    sellTrans = () => {
        if (this.currency.transmutes < CEX.CEX_transToCopper) return;
        this.currency.chaos ++;
        this.currency.transmutes -= CEX.CEX_transToCopper;
        this.engine.notify();
    }

    buyTrans = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.transmutes += CEX.CEX_transToCopper - 1;
        }
        this.engine.notify();
    }

    sellAug = () => {
        if (this.currency.augmentations < CEX.CEX_augToCopper) return;
        this.currency.chaos ++;
        this.currency.augmentations -= CEX.CEX_augToCopper;
        this.engine.notify();
    }
    buyAug = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.augmentations += CEX.CEX_augToCopper - 1;
        }
        this.engine.notify();
    }

    sellDoom = () => {
        if (this.currency.doomOrbs < CEX.CEX_doomToCopper) return;
        this.currency.chaos ++;
        this.currency.doomOrbs -= CEX.CEX_doomToCopper;
        this.engine.notify();
    }
    buyDoom = () => {
        if (this.currency.chaos < 1) return;
        else {
            this.currency.chaos --;
            this.currency.doomOrbs += CEX.CEX_doomToCopper;
        }
        this.engine.notify();
    }

    chaosResource: SingleResource = new SingleResource({
        get:()=>{return new Decimal(this.currency.chaos)},
        setDecimal:(decimal)=>{this.currency.chaos = decimal.toNumber()},
        name: 'Copper Orbs'
    })


    ONE = new Decimal(1)
    EU1: SingleResearch = new SingleResearch({
        name: "100% more Energy Gain",
        hidden: ()=>(this.data.research.moreEnergy < 0 ),
        description: "Double Energy Gain",
        get: () => this.data.research.moreEnergy >= 1,
        makeTrue: () => {if (this.data.research.moreEnergy < 1) this.data.research.moreEnergy = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(8)},
        ]
    })
    EU2: SingleResearch = new SingleResearch({
        name: "100% more Energy Gain",
        hidden: ()=>(this.data.research.moreEnergy < 1),
        description: "Double Energy Gain Again",
        get: () => this.data.research.moreEnergy >= 2,
        makeTrue: () => {if (this.data.research.moreEnergy < 2) this.data.research.moreEnergy = 2},
        costs: [
            { resource: this.chaosResource, count: this.ONE  },
            {resource: this.engine.difficultyResource, count: new Decimal(9)},
        ]
    })
    EU3: SingleResearch = new SingleResearch({
        name: "100% more Energy Gain",
        hidden: ()=>(this.data.research.moreEnergy < 2),
        description: "Another one",
        get: () => this.data.research.moreEnergy >= 3,
        makeTrue: () => {if (this.data.research.moreEnergy < 3) this.data.research.moreEnergy = 3},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(10)},
        ]
    })
    EU4: SingleResearch = new SingleResearch({
        name: "Energy Pylon",
        hidden: ()=>(this.data.research.moreEnergy < 3),
        description: "That's a big energy item.",
        get: () => this.data.research.moreEnergy >= 4,
        makeTrue: () => {if (this.data.research.moreEnergy < 4) this.data.research.moreEnergy = 4},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(11)},
        ]
    })


    DU1: SingleResearch = new SingleResearch({
        name: "100% more Doom Gain",
        hidden: ()=>(this.data.research.moreEnergy < 1),
        description: "Double Doom Gain",
        get: () => this.data.research.moreDoom >= 1,
        makeTrue: () => {if (this.data.research.moreDoom < 1) this.data.research.moreDoom = 1;
            this.engine.calced_DoomPerPile.set();
        },
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(8)},
        ]
    })
    DU2: SingleResearch = new SingleResearch({
        name: "100% more Doom Gain",
        hidden: ()=>(this.data.research.moreDoom < 1),
        description: "Double Doom Gain",
        get: () => this.data.research.moreDoom >= 2,
        makeTrue: () => {if (this.data.research.moreDoom < 2) this.data.research.moreDoom = 2;
            this.engine.calced_DoomPerPile.set();
        },
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(12)},
        ]
    })
    DU3: SingleResearch = new SingleResearch({
        name: "100% more Doom Gain",
        hidden: ()=>(this.data.research.moreDoom < 2),
        description: "Double Doom Gain",
        get: () => this.data.research.moreDoom >= 3,
        makeTrue: () => {if (this.data.research.moreDoom < 3) this.data.research.moreDoom = 3;
            this.engine.calced_DoomPerPile.set();
        },
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(12)},
        ]
    })
    DU4: SingleResearch = new SingleResearch({
        name: "Doom Obelisk",
        hidden: ()=>(this.data.research.moreDoom < 3),
        description: "That's a big doom item.",
        get: () => this.data.research.moreDoom >= 4,
        makeTrue: () => {if (this.data.research.moreDoom < 4) this.data.research.moreDoom = 4},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(12)},
        ]
    })


    CU1: SingleResearch = new SingleResearch({
        name: "Unlock Unique Items",
        hidden: ()=>(this.data.research.moreDoom < 1),
        description: "Want to design a unique item? @me",
        get: () => this.data.research.moreCrafting >= 1,
        makeTrue: () => {if (this.data.research.moreCrafting < 1) this.data.research.moreCrafting = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(8)},
        ]
    })
    CU2: SingleResearch = new SingleResearch({
        name: "Unlock T2 Enchantments",
        hidden: ()=>(this.data.research.moreCrafting < 1 ),
        description: "This is huge",
        get: () => this.data.research.moreCrafting >= 2,
        makeTrue: () => {if (this.data.research.moreCrafting < 2) this.data.research.moreCrafting = 2},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(13)},
        ]
    })
    CU3: SingleResearch = new SingleResearch({
        name: "Item Storage",
        hidden: ()=>(this.data.research.moreCrafting < 2 ),
        description: "Seriously? Inventory?",
        get: () => this.data.research.moreCrafting >= 3,
        makeTrue: () => {if (this.data.research.moreCrafting < 3) this.data.research.moreCrafting = 3},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(14)},
        ]
    })
    CU4: SingleResearch = new SingleResearch({
        name: "Relic Creation",
        hidden: ()=>(this.data.research.moreCrafting < 3 ),
        description: "Turn an item into a relic that presists through the next reset",
        get: () => this.data.research.moreCrafting >= 4,
        makeTrue: () => {if (this.data.research.moreCrafting < 4) this.data.research.moreCrafting = 4},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(15)},
        ]
    })

    GU1: SingleResearch = new SingleResearch({
        name: "100% increased seed gain",
        hidden: ()=>(this.data.research.moreCrafting < 1 ),
        description: "Increases seed gain amount by 100%",
        get: () => this.data.research.moreGarden >= 1,
        makeTrue: () => {if (this.data.research.moreGarden < 1) this.data.research.moreGarden = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(9)},
        ]
    })

    GU1point5: SingleResearch = new SingleResearch({
        name: "Discard Aversion",
        hidden: ()=>(this.data.research.moreGarden < 1 ),
        description: "Increases seed gain amount by 100%",
        get: () => this.data.research.research_discardAversion,
        makeTrue: () => {
            this.data.research.research_discardAversion = true;
        },
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(11)},
        ]
    })
    GU2: SingleResearch = new SingleResearch({
        name: "Ascension",
        hidden: ()=>(this.data.research.research_discardAversion === false),
        description: "Unlock a new Garden Prestige Tier",
        get: () => this.data.research.moreGarden >= 2,
        makeTrue: () => {if (this.data.research.moreGarden < 2) this.data.research.moreGarden = 2},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(16)},
        ]
    })
    GU3: SingleResearch = new SingleResearch({
        name: "100% more Garden Speed",
        hidden: ()=>(this.data.research.moreGarden < 2),
        description: "Double garden speed.",
        get: () => this.data.research.moreGarden >= 3,
        makeTrue: () => {if (this.data.research.moreGarden < 3) this.data.research.moreGarden = 3},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(17)},
        ]
    })
    GU4: SingleResearch = new SingleResearch({
        name: "100% increased Garden Speed",
        hidden: ()=>(this.data.research.moreGarden < 3 ),
        description: "Not double garden speed.",
        get: () => this.data.research.moreGarden >= 4,
        makeTrue: () => {if (this.data.research.moreGarden < 4) this.data.research.moreGarden = 4},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(17)},
        ]
    })
    GU5: SingleResearch = new SingleResearch({
        name: "10% more Garden Speed",
        hidden: ()=>(this.data.research.moreGarden < 4),
        description: "Okay",
        get: () => this.data.research.moreGarden >= 4,
        makeTrue: () => {if (this.data.research.moreGarden < 4) this.data.research.moreGarden = 4},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(17)},
        ]
    })

    //below still being worked on

    JU11: SingleResearch = new SingleResearch({
        name: "100% more work gain",
        hidden: ()=>(this.data.research.moreGarden < 1),
        description: "",
        get: () => this.data.research.moreJobs1 >= 1,
        makeTrue: () => {if (this.data.research.moreJobs1 === 0) this.data.research.moreJobs1 = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(9)},
        ]
    })
    JU12: SingleResearch = new SingleResearch({
        name: "100% more progress gain",
        hidden: ()=>(this.data.research.moreJobs1 < 1),
        description: "",
        get: () => this.data.research.moreJobs2 >= 1,
        makeTrue: () => {if (this.data.research.moreJobs2 === 0) this.data.research.moreJobs2 = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(9)},
        ]
    })
    JU13: SingleResearch = new SingleResearch({
        name: "Job #2",
        hidden: ()=>(this.data.research.moreJobs2 < 1),
        description: "",
        get: () => this.data.research.moreJobs3 >= 1,
        makeTrue: () => {if (this.data.research.moreJobs3 === 0) this.data.research.moreJobs3 = 1},
        costs: [
            { resource: this.chaosResource, count: this.ONE },
            {resource: this.engine.difficultyResource, count: new Decimal(9)},
        ]
    })




}

export interface TheExchange_Data {

}

export function TheExchange_Data_Init (): TheExchange_Data {
    return {}
}

const CEX_transToCopper = 4
const CEX_augToCopper = 15
const CEX_doomToCopper = 1

export const CEX = {
    CEX_augToCopper, CEX_transToCopper, CEX_doomToCopper
}