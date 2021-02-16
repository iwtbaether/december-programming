import Decimal from "break_infinity.js";
import Achievements, { Achievements_Data, Achievements_Data_Init } from "./Achievements";
import { DoomResearchData, DoomResearchData_Init } from "./DoomResearches";
import { GardenData, GardenData_Init, GardenData_SetDecimals } from "./garden/Garden";
import Jobs, { JobsData, JobsData_Init, JobsData_SetDecimals } from "./Jobs";
import { CraftingData, CraftingData_Init } from "./m_st/Crafting";
import { Magic_Data, Magic_Data_Init } from "./skills/Magic";
import { SkillManager_Data, SkillManager_Data_Init, SkillManager_Data_SetDecimals } from "./skills/SkillManager";
import TheExchange, { TheExchange_Data, TheExchange_Data_Init } from "./TheExchange";

export interface Datamap {
    //core data
    autosave: boolean;
    autosaveCounter: number;
    last: number;
    nav: number,
    popupUI: number,
    activity: number,
    doomResearch: DoomResearchData,
    testDec: Decimal;
    theExchange:TheExchange_Data
    cell: I_HoldDecimals;
    skillManager: SkillManager_Data;
    jobs: JobsData;
    achievments: Achievements_Data;
    unlocksStates: {
        one: number,
        two: number,
        three: number,
        four: number,
        five: number,
        magic: boolean,
    };
    garden: GardenData;
    crafting: CraftingData;
    magic: Magic_Data;
}

export function newDefaultMap() {
    let map: Datamap = {
        autosave: true,
        autosaveCounter: 0,
        activity: 0,
        popupUI: 0,
        last: Date.now(),
        jobs: JobsData_Init(),
        theExchange: TheExchange_Data_Init(),
        doomResearch: DoomResearchData_Init(),
        skillManager: SkillManager_Data_Init(),
        achievments: Achievements_Data_Init(),
        nav: 0,
        cell: {
            a: ZERO,
            aa: ZERO,
            b: ZERO,
            c: ZERO,
            cc: ZERO,
            d1: ZERO,
            d2: ZERO,
            d3: ZERO,
            doom: ZERO,
            gloom: ZERO,
            zoom: ZERO,
            determination: ZERO,
            swimmerNumber: new Decimal(1),
            rebirth: ZERO,
            autoclicker: ZERO,

            doomGardenSpeed: ZERO,
            doomJobSpeed: ZERO,

            d4: ZERO,
            d5: ZERO,
            d6: ZERO,
            d7: ZERO,
            d8: ZERO,

            momentum: ZERO,

            gloomGen1: ZERO,
            gloomGen2: ZERO,
            gloomGen3: ZERO,
            gloomGen4: ZERO,

            gloomGen1E: ZERO,
            gloomGen2E: ZERO,
            gloomGen3E: ZERO,
            gloomGen4E: ZERO,

            aewf: ZERO,


        },
        unlocksStates: {
            five: 0,
            four: 0,
            one: 0,
            three: 0,
            two: 0,
            magic: false,
        },



        testDec: new Decimal(0),
        garden: GardenData_Init(),
        crafting: CraftingData_Init(),
        magic: Magic_Data_Init(),
    }
    return map;
}

interface I_HoldDecimals {
    a: Decimal,
    aa: Decimal,
    b: Decimal,
    c: Decimal,
    cc: Decimal,
    doom: Decimal,
    gloom: Decimal,
    zoom: Decimal,
    d1: Decimal,
    d2: Decimal,
    d3: Decimal,
    swimmerNumber: Decimal,
    determination: Decimal,
    rebirth: Decimal,
    autoclicker: Decimal,
    doomGardenSpeed: Decimal,
    doomJobSpeed: Decimal,

    d4: Decimal,
    d5: Decimal,
    d6: Decimal,
    d7: Decimal,
    d8: Decimal,

    momentum: Decimal,

    gloomGen1: Decimal,
    gloomGen2: Decimal,
    gloomGen3: Decimal,
    gloomGen4: Decimal,

    gloomGen1E: Decimal,
    gloomGen2E: Decimal,
    gloomGen3E: Decimal,
    gloomGen4E: Decimal,

    aewf: Decimal,


    [key: string]: Decimal
}


export function setDecimals(data: Datamap) {
    data.testDec = new Decimal(data.testDec);

    Object.keys(data.cell).forEach(key => {
        data.cell[key] = new Decimal(data.cell[key])
    });

    GardenData_SetDecimals(data);
    JobsData_SetDecimals(data);
    SkillManager_Data_SetDecimals(data);
    //data.whateverdecimal = new Decimal(whateverdecimal)
}

const ZERO = new Decimal(0);