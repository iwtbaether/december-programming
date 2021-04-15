import Decimal, { DecimalSource } from "break_infinity.js";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";
import { canCheat, getRandomInt, randomEnum, randomEnumFromListWithExclusions } from "../externalfns/util";
import { SeedType } from "../garden/Garden";
import { ItemData, ItemTypes, ModData } from "../m_st/Crafting";
import { PShroom, PForm, ShroomTypes, formTypesList, FTYPES, PShroom_Mods, PForm_Mods, MDV2, getValueOfModType } from "./PatienceItemTypes";
import { SingleManagedSkill } from "./SingleManagedSkill";

const TEN_MIN_MS = 1000 * 60;// * 10;

export default class Patience_Skill extends SingleManagedSkill {

    useTokenGetLoot = () => {
        const cost = this.getLootBoxCost();
        if (cost > this.data2.mtx) return;

        this.data2.mtx -= cost;
        //first token always gives mushroom
        //second token always gives form
        //then rng between all 6 patience types
        if (this.data2.claimedBoxes === 0) {
            this.getShroomBox();
            // get new shroom!
        } else if (this.data2.claimedBoxes === 1) {
            this.getFormBox();
            // get new form
        } else {
            this.getRandomBox();
            //get random p item type
        }

        this.data2.claimedBoxes++;
    }

    extraLoad = () => {
        this.setUpFormData();
        this.setPowersFromFruit();
    }

    prestige = () => {
        let fortitudeGain = this.data2.claimedBoxes;
        if (fortitudeGain < 20 ) return;

        this.refundPeace();

        let oldPeace = new Decimal( this.data2.peace );

        this.engine.datamap.skillManager.patience_extra = Patience_Skill_Extra_Data_Init();

        this.data2.peace = oldPeace;
        this.engine.skillManager.skills.fortitude.gainXP(fortitudeGain);


        this.extraLoad();
    }

    getGrowTime = () => {
        if (this.data2.equipedShroom) {
            return TEN_MIN_MS * this.data2.equipedShroom.mods[0].value;
        } else
            return TEN_MIN_MS
    }


    canFertalize = () => {
        if (this.data2.equipedShroom) {
            if (this.data2.equipedShroom.mods) {
                let size = this.data2.equipedShroom.mods[0].value;
                return size > this.data2.fertalizer.length;
            }
        }

        return false;
    }

    powers = {
        bPower: 0,
        cPower: 0,
        ePower: 0,
        sPower: 0,
        tPower: 0,
        addWeights: {
            /*b:0,
            c:0,
            e:0,
            s:0,
            t:0,*/
        }
    }

    totalFormPowers: TotalFormPower = {
        totalExtraPowers: FFPAC_Init(),
        bunched: SingleFormPower_Init(),
        circular: SingleFormPower_Init(),
        square: SingleFormPower_Init(),
        egg: SingleFormPower_Init(),
        triangular: SingleFormPower_Init(),
    }

    //call this when fruits are made and after forms are setup. don't calculate form data here, just the magnitude determined by powers.
    //OPTIMIZE
    setPowersFromFruit = () => {
        this.powers.bPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.bunched)
        this.powers.cPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.circular)
        this.powers.ePower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.egg)
        this.powers.sPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.square)
        this.powers.tPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.triangular)

        this.calcExtraPowers();
        this.calcPatienceOutcoems();
    }

    setPowersFromSingleFruit = (fType: SeedType) => {
        switch (fType) {
            case SeedType.bunch:
                this.powers.bPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.bunched)
                break;
            case SeedType.circle:
                this.powers.cPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.circular)
                break;
            case SeedType.egg:
                this.powers.ePower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.egg)
                break;
            case SeedType.square:
                this.powers.sPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.square)
                break;
            case SeedType.triangle:
                this.powers.tPower = getPowerFromFruitCount(this.engine.datamap.garden.fruits.triangular)
                break;
            default:
                break;
        }

        this.calcExtraPowers();

        this.calcPatienceOutcoems();
    }

    calcExtraPowers = () => {
        const bPair: FormPowerPair = { form: this.totalFormPowers.bunched, power: this.powers.bPower }
        const cPair: FormPowerPair = { form: this.totalFormPowers.circular, power: this.powers.cPower }
        const ePair: FormPowerPair = { form: this.totalFormPowers.egg, power: this.powers.ePower }
        const sPair: FormPowerPair = { form: this.totalFormPowers.square, power: this.powers.sPower }
        const tPair: FormPowerPair = { form: this.totalFormPowers.triangular, power: this.powers.tPower }
        const pairs = [bPair, cPair, ePair, sPair, tPair];

        /** 
         * 
        */
        //THIS IS WHERE WE ARE
        //TODODODODODOD
        //TODO: count fruits to calc magnitude of powers
        //TODO: implement all the form mods except weight?
        let startingTotal = FFPAC_Init();

        pairs.forEach(pairs => {
            startingTotal.doom = startingTotal.doom.add(
                pairs.form.extraPowers.doom * pairs.power
            )

            startingTotal.energy = startingTotal.energy.add(
                pairs.form.extraPowers.energy * pairs.power
            )

            startingTotal.fruit = startingTotal.fruit.add(
                pairs.form.extraPowers.fruit * pairs.power
            )

            startingTotal.gloom = startingTotal.gloom.add(
                pairs.form.extraPowers.gloom * pairs.power
            )

            startingTotal.juice = startingTotal.juice.add(
                pairs.form.extraPowers.juice * pairs.power
            )

            startingTotal.mana = startingTotal.mana.add(
                pairs.form.extraPowers.mana * pairs.power
            )

            startingTotal.power = startingTotal.power.add(
                pairs.form.extraPowers.power *
                pairs.power
            )

            startingTotal.work = startingTotal.work.add(
                pairs.form.extraPowers.work * pairs.power
            )
        });

        this.totalFormPowers.totalExtraPowers = startingTotal;


    }


    calcPatienceOutcoems = () => {
        if (canCheat) console.log('cpo');
        

        //things that then rely on just form data;
        this.engine.garden.setSeedTimes();

        //todo
        // D, E , F, G , J , M , P , W 
        //DONE 
        // E, F, G??
        this.engine.calcEnergy();
        this.engine.garden.setFruitGainMulti();
        this.engine.gloomManger.gloomMulti.set();
        this.engine.garden.juice.juiceGainMulti.set();


        //this.totalFormPower.totalExtraPowers.energy
        //LOL DONT CALL WEN BACK TO DEFAULT LMAO
        /*

        if (this.totalFormPowers.totalExtraPowers.energy.greaterThan(0)) {
            this.engine.calcEnergy();
        }
        if (this.totalFormPowers.totalExtraPowers.fruit.greaterThan(0)) {
            this.engine.garden.setFruitGainMulti();
        }
        if (this.totalFormPowers.totalExtraPowers.gloom.greaterThan(0)) {
            if (canCheat)console.log('gloom gain ps before', this.engine.gloom.gainPS);

            this.engine.gloomManger.gloomMulti.set();

            this.engine.calcGloom();
            if (canCheat)console.log('gloom gain ps after', this.engine.gloom.gainPS);

        }
        */

    }

    //call this when forms are equiped NOT when fruits are made
    setUpFormData = () => {


        if (this.data2.equipedForms.bunch) {
            this.totalFormPowers.bunched = this.processForm(this.data2.equipedForms.bunch);
            //this.powers.addWeights.b = this.data2.equipedForms.bunch.mods[0].value;
        } else this.totalFormPowers.bunched = SingleFormPower_Init();//this.powers.addWeights.b = 0;

        if (this.data2.equipedForms.circle) {
            this.totalFormPowers.circular = this.processForm(this.data2.equipedForms.circle);
            //this.powers.addWeights.c = this.data2.equipedForms.circle.mods[0].value;
        } else this.totalFormPowers.circular = SingleFormPower_Init();//this.powers.addWeights.c = 0;

        if (this.data2.equipedForms.egg) {
            this.totalFormPowers.egg = this.processForm(this.data2.equipedForms.egg);
            //this.powers.addWeights.e = this.data2.equipedForms.egg.mods[0].value;
        } else this.totalFormPowers.egg = SingleFormPower_Init();//this.powers.addWeights.e = 0;

        if (this.data2.equipedForms.square) {
            this.totalFormPowers.square = this.processForm(this.data2.equipedForms.square);
            //this.powers.addWeights.s = this.data2.equipedForms.square.mods[0].value;
        } else this.totalFormPowers.square = SingleFormPower_Init();//this.powers.addWeights.s = 0;

        if (this.data2.equipedForms.triangle) {
            this.totalFormPowers.triangular = this.processForm(this.data2.equipedForms.triangle);
            //this.powers.addWeights.t = this.data2.equipedForms.triangle.mods[0].value;
        } else this.totalFormPowers.triangular = SingleFormPower_Init();//this.powers.addWeights.t = 0;



    }

    processForm = (form: PForm): SingleFormPower => {

        let power: SingleFormPower = SingleFormPower_Init();

        //...like i mentioned, unnneded duplication of item data? may be needed, i guess.
        const weightGain = getValueOfModType(form.mods, PForm_Mods.size);
        if (weightGain !== undefined) {
            power.weightGain = weightGain;
        }

        const rebirthGain = getValueOfModType(form.mods, PForm_Mods.rebirthGain);
        if (rebirthGain !== undefined) {
            power.startCount = rebirthGain;
        }

        const strongerRegularPower = getValueOfModType(form.mods, PForm_Mods.strongerRegularPower);
        if (strongerRegularPower !== undefined) {
            power.strongerRegularPower = strongerRegularPower;
        }

        const strongerShroomPowers = getValueOfModType(form.mods, PForm_Mods.strongerShroomPowers);
        if (strongerShroomPowers !== undefined) {
            power.strongerExtraPowers = strongerShroomPowers;
        }

        const moreOfType = getValueOfModType(form.mods, PForm_Mods.moreOfFormType);
        if (moreOfType !== undefined) {
            power.moreOfType = moreOfType;
        }

        const doom = getValueOfModType(form.mods, PForm_Mods.doomFromBase);
        if (doom !== undefined) {
            power.extraPowers.doom = doom;
        }

        const energy = getValueOfModType(form.mods, PForm_Mods.energyFromBase);
        if (energy !== undefined) {
            power.extraPowers.energy = energy;
        }

        const fruit = getValueOfModType(form.mods, PForm_Mods.fruitFromBase);
        if (fruit !== undefined) {
            power.extraPowers.fruit = fruit;
        }

        const gloom = getValueOfModType(form.mods, PForm_Mods.gloomFromBase);
        if (gloom !== undefined) {
            power.extraPowers.gloom = gloom;
        }

        const juice = getValueOfModType(form.mods, PForm_Mods.juiceFromBase);
        if (juice !== undefined) {
            power.extraPowers.juice = juice;
        }

        const mana = getValueOfModType(form.mods, PForm_Mods.manaFromBase);
        if (mana !== undefined) {
            power.extraPowers.mana = mana;
        }

        const powerPlant = getValueOfModType(form.mods, PForm_Mods.powerFromBase);
        if (powerPlant !== undefined) {
            power.extraPowers.power = powerPlant;
        }

        const work = getValueOfModType(form.mods, PForm_Mods.workFromBase);
        if (work !== undefined) {
            power.extraPowers.work = work;
        }





        return power;
    }

    fertalize = (formIndex: number) => {
        if (this.canFertalize() === false) return;

        let inventory = this.data2.storedItems;
        let chosenForm = inventory[formIndex];
        if (chosenForm.itemType === ItemTypes.PatienceMushroom) {
            //SHOULD NOT HAPPEN
        } else {
            let fert = inventory.splice(formIndex, 1);
            this.data2.storedItems = inventory;

            this.data2.fertalizer.push([chosenForm, Date.now()])
        }
    }

    chooseFlower = (flowerIndex: number) => {
        if (this.data2.floweredForms) {
            const chosen = this.data2.floweredForms[flowerIndex];
            this.storeItem(chosen);
            this.data2.floweredForms = undefined;
        }
    }

    flower = (fertIndex: number) => {
        let chosenFert = this.data2.fertalizer[fertIndex];
        if (chosenFert) {
            const growTimeReq = this.getGrowTime();
            const now = Date.now();
            const growTimeHave = now - chosenFert[1];
            if (growTimeHave >= growTimeReq) {
                const bye = this.data2.fertalizer.splice(fertIndex, 1)[0][0];
                const newForms = this.augmentForm(bye)
                this.data2.floweredForms = newForms;
                //console.log(newForms);
                //console.log(this.engine.datamap.skillManager.patience_extra.floweredForms);

            }
        }
    }

    augmentForm = (form: PForm): PForm[] => {
        const shroom = this.data2.equipedShroom;
        if (shroom === undefined) throw new Error('NO SHROOM??');

        let PossibleMods: PForm_Mods[] = [
            PForm_Mods.rebirthGain,
            PForm_Mods.strongerRegularPower,
            PForm_Mods.moreOfFormType,
            PForm_Mods.strongerShroomPowers,
        ]

        if (shroom.shroomType === ShroomTypes.doom) {
            PossibleMods.push(PForm_Mods.doomFromBase)
        } else if (shroom.shroomType === ShroomTypes.energy) {
            PossibleMods.push(PForm_Mods.energyFromBase)
        } else if (shroom.shroomType === ShroomTypes.fruit) {
            PossibleMods.push(PForm_Mods.fruitFromBase)
        } else if (shroom.shroomType === ShroomTypes.gloom) {
            PossibleMods.push(PForm_Mods.gloomFromBase)
        } else if (shroom.shroomType === ShroomTypes.juice) {
            PossibleMods.push(PForm_Mods.juiceFromBase)
        } else if (shroom.shroomType === ShroomTypes.power) {
            PossibleMods.push(PForm_Mods.powerFromBase)
        } else if (shroom.shroomType === ShroomTypes.work) {
            PossibleMods.push(PForm_Mods.workFromBase)
        }

        const currentModCount = form.mods.length - 1 //size doesn't count
        const MAXMODS = 3;
        if (currentModCount < MAXMODS) {

            //can add new mods 
        } else {
            //can only upgrade mods
            PossibleMods = PossibleMods.filter((mod) => {
                let dummy: MDV2 = {
                    mod: mod,
                    value: 0,
                }
                if (form.mods.find((currentMod) => {
                    if (currentMod.mod === dummy.mod) return true;
                    else return false;
                })) return true;
                else return false;
            })
            if (PossibleMods.length === 0) {
                PossibleMods.push(PForm_Mods.spores)
            }
        }

        //console.log('possible',PossibleMods);

        let add = randomEnumFromListWithExclusions(PossibleMods, []);
        let newModList = modifyFormMods(form.mods, add)

        const newForm: PForm = {
            itemType: form.itemType,
            mods: newModList,
        }

        const add2 = randomEnumFromListWithExclusions(PossibleMods, []);
        const newModList2 = modifyFormMods(form.mods, add2)

        const newForm2: PForm = {
            itemType: form.itemType,
            mods: newModList2,
        }


        return [newForm, newForm2];
    }

    ifExistsGetPeace = (exists: PForm | undefined) => {
        if (exists !== undefined) {
            this.data2.peace = this.data2.peace.add(1)
        }
    }

    equipFormByIndex = (formIndex: number) => {
        let chosen = this.data2.storedItems.splice(formIndex, 1)[0];
        switch (chosen.itemType) {
            case ItemTypes.BunchedForm:
                this.ifExistsGetPeace(this.data2.equipedForms.bunch)
                this.data2.equipedForms.bunch = chosen;

                break;

            case ItemTypes.CircularForm:
                this.ifExistsGetPeace(this.data2.equipedForms.circle)

                this.data2.equipedForms.circle = chosen;

                break;

            case ItemTypes.EggForm:
                this.ifExistsGetPeace(this.data2.equipedForms.egg)

                this.data2.equipedForms.egg = chosen;

                break;

            case ItemTypes.SquareForm:
                this.ifExistsGetPeace(this.data2.equipedForms.square)

                this.data2.equipedForms.square = chosen;

                break;

            case ItemTypes.TriangleForm:
                this.ifExistsGetPeace(this.data2.equipedForms.triangle)

                this.data2.equipedForms.triangle = chosen;

                break;

            default:
                break;
        }
        //what to do after equiping a form?
        this.setUpFormData();
        this.setPowersFromFruit();


    }

    plantShroom = (shroomIndex: number) => {
        let chosenShroom = this.data2.storedItems.splice(shroomIndex, 1)[0];
        if (chosenShroom.itemType === ItemTypes.PatienceMushroom) {
            this.data2.equipedShroom = chosenShroom;
            this.data2.floweredForms = undefined;
            this.data2.fertalizer = [];
        }
    }

    getShroomBox = () => {
        const tempShrooms = [];
        for (let index = 0; index < 3; index++) {
            const shroom = this.getNewShroom();
            tempShrooms.push(shroom)
        }
        this.data2.tempItems = tempShrooms;
    }

    getFormBox = () => {
        const tempForms = [];
        for (let index = 0; index < 3; index++) {
            const form = this.getNewForm();
            tempForms.push(form)
        }
        this.data2.tempItems = tempForms;
    }

    getRandomBox = () => {
        const tempItems: (PForm | PShroom)[] = [];
        for (let index = 0; index < 3; index++) {
            const rng = getRandomInt(1, 6);
            if (rng === 1) tempItems.push(this.getNewShroom());
            else if (rng !== 1) tempItems.push(this.getNewForm());
        }
        this.data2.tempItems = tempItems;

    }



    chooseItem = (index: number) => {
        if (this.data2.tempItems) {
            const chosen = this.data2.tempItems[index];
            this.storeItem(chosen);
            this.clearTempItems();
        } else return;
    }

    clearTempItems = () => {
        this.data2.tempItems = undefined;
    }

    storeItem = (item: PForm | PShroom) => {
        this.data2.storedItems.push(item)
        if (this.data2.storedItems.length > 5) {
            this.data2.storedItems.shift();
            this.data2.peace = this.data2.peace.add(1);
        }
    }

    getNewShroom = () => {
        let shroomType = randomEnum(ShroomTypes);
        let size = getRandomInt(1, 3)
        let shroom: PShroom = {
            itemType: ItemTypes.PatienceMushroom,
            shroomType: shroomType,
            mods: [
                { mod: PShroom_Mods.size, value: size }
            ]
        }
        return shroom;
    }

    getNewForm = () => {
        let formType = randomEnumFromListWithExclusions(formTypesList, []) as FTYPES;
        let size = getRandomInt(0, 3)

        let form: PForm = {
            itemType: formType,
            mods: [
                { mod: PForm_Mods.size, value: size }
            ]
        }
        return form;
    }

    getLootBoxCost = () => {
        return this.data2.claimedBoxes + 10;
        //box cost is  10 + #
    }



    get data2() {
        return this.engine.datamap.skillManager.patience_extra;
    }


    tokenTimer = 60 * 1000 //1 minute
    canClaim = () => {
        return isTimerDone(this.tokenTimer, this.data2.lastClaim);
    }
    claimTokens = () => {
        if (isTimerDone(this.tokenTimer, this.data2.lastClaim)) {


            this.data2.mtx = this.data2.mtx + this.getData().level.add(1).toNumber();
            this.data2.lastClaim = Date.now();
            this.engine.notify();
        } else return;
    }

    refundPeace = () => {
        this.building_FormAugmentaionPower.refund();
    }

    peacource: SingleResource = new SingleResource({
        name: "Peace",
        get: () => this.engine.datamap.skillManager.patience_extra.peace,
        setDecimal: (decimal) => { this.engine.datamap.skillManager.patience_extra.peace = decimal },
    })

    building_FormAugmentaionPower: SingleBuilding = new SingleBuilding({
        building: new SingleResource({
            get: ()=>{return this.engine.datamap.skillManager.patience_extra.peaceSpends.formAugPower},
            setDecimal: (dec)=>{this.engine.datamap.skillManager.patience_extra.peaceSpends.formAugPower = dec},
            name: 'Mushroom Power'
        }),
        costs: [
            {resource: this.peacource, expo: {initial: 1,coefficient: 2}}
        ],
        description: '+1 Base Mushroom Power',
        hidden: ()=>false,
        outcome: ()=>'',
    })


    //GROW A MUSHROOM THAT GROWS FRUIT FORMS
    //1. grow mushroom
    //2, fertalize with a fruit form
    //3. ???
    //4. mushroom grows a new fruit form

}
/*
    if (mod.mod === PForm_Mods.size) return `Weight: +${mod.value}`;

    if (mod.mod === PForm_Mods.rebirthGain) return `Starting fruit +${mod.value}`;
    if (mod.mod === PForm_Mods.moreOfFormType) return `${mod.value}0% more form fruit gain`;
    if (mod.mod === PForm_Mods.strongerRegularPower) return `${mod.value}% more fruit effect`;
    if (mod.mod === PForm_Mods.strongerShroomPowers) return `${mod.value}% more shroom effects`;

    if (mod.mod === PForm_Mods.fruitFromBase) return `Fruit Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.doomFromBase) return `Doom Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.workFromBase) return `Work Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.gloomFromBase) return `Gloom Gain Lv ${mod.value}`;
    if (mod.mod === PForm_Mods.juiceFromBase) return `Juice Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.powerFromBase) return `Power Gain Lv${mod.value}`;
    if (mod.mod === PForm_Mods.energyFromBase) return `Energy Gain Lv.${mod.value}`;
    */


interface TotalFormPower {
    totalExtraPowers: FruitFormPowersAFTERCount

    //are all these a waste of memory? duplicating stored item data ??
    bunched: SingleFormPower;
    circular: SingleFormPower;
    egg: SingleFormPower;
    square: SingleFormPower;
    triangular: SingleFormPower;
}

export interface SingleFormPower {
    weightGain: number;

    startCount: number;
    moreOfType: number;

    strongerRegularPower: number;
    strongerExtraPowers: number;

    extraPowers: FruitFormPowers
}

function SingleFormPower_Init(): SingleFormPower {
    return {
        extraPowers: FruitFormPowers_Init(),
        moreOfType: 0,
        startCount: 0,
        strongerExtraPowers: 0,
        strongerRegularPower: 0,
        weightGain: 0,
    }
}

interface FormPowerPair {
    form: SingleFormPower;
    power: number;
}

function FruitFormPowers_Init(): FruitFormPowers {
    return {
        doom: 0,
        energy: 0,
        fruit: 0,
        gloom: 0,
        juice: 0,
        mana: 0,
        power: 0,
        work: 0,
    }
}

interface FruitFormPowersAFTERCount {
    fruit: Decimal;
    doom: Decimal;
    work: Decimal;
    gloom: Decimal;
    juice: Decimal;
    power: Decimal;
    energy: Decimal;
    mana: Decimal;
}

const ZERO = new Decimal(0)
function FFPAC_Init(): FruitFormPowersAFTERCount {
    return {
        doom: ZERO,
        energy: ZERO,
        fruit: ZERO,
        gloom: ZERO,
        juice: ZERO,
        mana: ZERO,
        power: ZERO,
        work: ZERO,
    }
}

export interface FruitFormPowers {
    fruit: number;
    doom: number;
    work: number;
    gloom: number;
    juice: number;
    power: number;
    energy: number;
    mana: number;
}

interface PowerFromFruitCount {
    power: number;
}

function getPowerFromFruitCount(fruitCount: DecimalSource) {
    let power = Decimal.ln(Decimal.add(fruitCount, 1))
    return power;
}


function isTimerDone(timer: number, last: number) {
    return (Date.now() - last) >= timer
}

function modifyFormMods(modList: MDV2[], add: PForm_Mods) {
    //console.log(modList,add);

    //does mod already exist?
    let newModList: MDV2[] = [...modList]
    const exists = modList.findIndex((existingMod) => {
        return existingMod.mod === add;
    })

    if (exists === -1) {
        newModList.push({ mod: add, value: 1 });
    } else {
        newModList[exists] = {
            mod: newModList[exists].mod,
            value: newModList[exists].value + 1,
        };
    }

    return newModList;
}

export const SpiritualityLevelUnlocks = {
    juiceTrades: 19,
    juicerUpgrades: 9,
    juiceEarlyUnlock: 39,
    startingHope:29
}

export interface Patience_Skill_Extra_Data {
    mtx: number;
    claimedBoxes: number;
    peace: Decimal;

    peaceSpends: {
        formAugPower: Decimal;
        persistantAutoclickers: Decimal;
        manaShroms: boolean;

    }

    equipedShroom?: PShroom;
    fertalizer: [PForm, number][];
    storedShroom?: PShroom;
    tempItems?: (PShroom | PForm)[];
    floweredForms?: PForm[];
    storedItems: (PShroom | PForm)[];
    equipedForms: {
        square?: PForm;
        circle?: PForm;
        triangle?: PForm;
        bunch?: PForm;
        egg?: PForm;
    }

    //timer bases -- USE THIS INSTEAD OF ADDING WIH DELTA
    lastClaim: number;
    lastMushroom: number;
}

export function Patience_Skill_Extra_Data_Init(): Patience_Skill_Extra_Data {
    return {
        mtx: 0,
        claimedBoxes: 0,
        lastClaim: 0,
        lastMushroom: 0,
        storedItems: [],
        equipedForms: {

        },
        fertalizer: [],
        peaceSpends: {
            formAugPower: new Decimal(0),
            persistantAutoclickers: new Decimal(0),
            manaShroms: false,
        },
        peace: new Decimal(0),
    }
}
