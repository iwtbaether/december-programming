import { sum_I_FruitDecimals } from "../../UI/layout/mainrows/JuiceRow";
import { I_FruitDecimals } from "./Garden";
import JuiceLmao, { calcDrink, GuideTypes, I_DrinkPowers } from "./Juice";

export default class JuiceTradeManager {
    constructor(public juice: JuiceLmao) {

    }

    tradeStatus = {
        book: false,
        absolution: false,
        oneK: false,
        tenK: false,
        threeS: false,
        fiveS: false,
        threeG: false,
        fiveSThreeG: false,
        balancedShapes: false,
        balancedShade: false,
    }

    setTrades = (juice: I_FruitDecimals) => {
        const totalFruit = sum_I_FruitDecimals(juice);
        let powers = calcDrink(juice);

        const oneK = totalFruit.greaterThanOrEqualTo(1000);
        this.tradeStatus.oneK = oneK
        this.tradeStatus.tenK = totalFruit.greaterThanOrEqualTo(10000);

        let SS = getSilverStarCount(powers);
        let GS = getGoldStarCount(powers);

        this.tradeStatus.threeS = (SS === 3 && GS === 0) && oneK
        this.tradeStatus.fiveS = (SS === 5 && GS === 0) && oneK
        this.tradeStatus.threeG = (GS === 3 && SS === 0) && oneK
        this.tradeStatus.fiveSThreeG = (SS === 5 && GS === 3) && oneK

        const spellbookIsInfluenced = (spellbook: null | GuideTypes) => {
            if (spellbook === null) return false;
            if (spellbook === GuideTypes.none) return false;
            return true;
        }

        this.tradeStatus.book = this.tradeStatus.oneK && (this.juice.engine.datamap.magic.spellbook === null);
        this.tradeStatus.absolution = this.tradeStatus.tenK && spellbookIsInfluenced(this.juice.engine.datamap.magic.spellbook)

        this.tradeStatus.balancedShade = juice.hope.minus(juice.doom).abs().lessThan(1);
        //const sumPoints = juice.bunched.add(juice.square).add(juice.circular).add(juice.egg).add(juice.triangular).div(5);




        return this.tradeStatus;
    }

    absolution = () => {
        const dm = this.juice.engine.datamap;
        dm.magic.spellbook = GuideTypes.none;
        dm.skillManager.magic.unlocked = false;
    }

    tryTrade = (trade: juiceTrade_Enum) => {

        switch (trade) {
            case juiceTrade_Enum.book:
                if (this.tradeStatus.book) {
                    this.juice.clearCurrentJuice();
                    this.juice.engine.datamap.magic.spellbook = this.juice.data.guide;
                    // GET BOOK
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.absolution:
                if (this.tradeStatus.absolution) {
                    this.juice.clearCurrentJuice();
                    this.absolution();
                    // REMOVE BOOK;
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.oneK:
                if (this.tradeStatus.oneK) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.threeS:
                if (this.tradeStatus.threeS) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.fiveS:
                if (this.tradeStatus.fiveS) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.threeG:
                if (this.tradeStatus.threeG) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.fiveSThreeG:
                if (this.tradeStatus.fiveSThreeG) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.balancedShapes:
                if (this.tradeStatus.balancedShapes) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;
                case juiceTrade_Enum.balancedShade:
                if (this.tradeStatus.balancedShade) {
                    this.juice.clearCurrentJuice();
                    this.juice.data.trades[trade] = this.juice.data.trades[trade] + 1;
                }
                break;

            default:
                break;
        }
        this.juice.calcDrinkPowers();
        this.juice.engine.notify();
    }

}

export enum juiceTrade_Enum {
    book, absolution, oneK,
    threeS, fiveS, threeG,
    fiveSThreeG, balancedShapes, balancedShade
}

function getSilverStarCount(powers: I_DrinkPowers) {
    let SS = 0;
    if (powers.s1) SS++;
    if (powers.s2) SS++;
    if (powers.s3) SS++;
    if (powers.s4) SS++;
    if (powers.s5) SS++;
    return SS;
}

function getGoldStarCount(powers: I_DrinkPowers) {
    let GS = 0;
    if (powers.g1) GS++;
    if (powers.g2) GS++;
    if (powers.g3) GS++;
    if (powers.g4) GS++;
    if (powers.g5) GS++;
    return GS;
}