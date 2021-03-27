import { KeyObject } from "crypto";
import { keys } from "lodash";
import { getCurrentNavAndNavs } from "../UI/layout/mainrows/NavRow";
import Engine from "./Engine";

export default class HotkeyManager {
    constructor(public engine: Engine) {

    }


    closePopup = () => {
        this.engine.datamap.popupUI = 0;
        this.engine.notify();
    }

    setPopup = (num: number) => {
        this.engine.datamap.popupUI = num;
        this.engine.notify();
    }

    handle = (key: string) => {
        const gEngine = this.engine;
        const data = gEngine.datamap;
        switch (key) {
            case '1':
                gEngine.silentSetNav(0);
                break;
            case '2':
                if (gEngine.datamap.unlocksStates.two > 0) gEngine.silentSetNav(1);
                break;
            case '3':
                if (gEngine.datamap.unlocksStates.one >= 4) gEngine.silentSetNav(6);
                break;

            case '4':
                if (gEngine.datamap.unlocksStates.one >= 5) gEngine.silentSetNav(3);
                break;

            case '5':
                if (gEngine.datamap.unlocksStates.one >= 6) gEngine.silentSetNav(5);
                break;
            case '6':
                //if (data.unlocksStates.magic) gEngine.silentSetNav(8)
                break;
            case 'd':
                
                if (data.nav === 0) this.engine.drive.buy();
                break;
            case 'm':
                if (data.nav === 0) this.engine.momentum.buy();
                break;
            case 'e':
                if (data.nav === 0) this.engine.effort.buy();
                break;
            case 'a':
                if (data.nav === 0) this.engine.antiDrive.buy();
                break;
            case 'r':
                if (data.nav === 0) this.engine.determination.buy();
                break;
            case 'Escape':
                data.popupUI = 0;
                break;
            case 'ArrowLeft':
                this.goL();
                break;
            case 'ArrowRight':
                this.goR();
                break;
                
            default:
                break;
        }
        this.engine.notify();
    }
    
    goL = () => {
        let data = this.engine.datamap;
        let [navs, current] = getCurrentNavAndNavs(data);
        let next = Math.max(0, current - 1)
        this.engine.setNav(navs[next][0])
      }
    
      goR = () => {
        let data = this.engine.datamap;
        let [navs, current] = getCurrentNavAndNavs(data);
        let next = Math.min(navs.length - 1, current + 1)
        this.engine.setNav(navs[next][0])
      }
    

}