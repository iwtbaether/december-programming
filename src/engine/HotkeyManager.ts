import Engine from "./Engine";

export default class HotkeyManager {
    constructor(public engine: Engine) {

    }

    handle = (key: string) => {
        const gEngine = this.engine;
        switch (key) {
            case '1':
                gEngine.setNav(0);
                break;
            case '2':
                if (gEngine.datamap.unlocksStates.two > 0) gEngine.setNav(1);
                break;
            case '3':
                if (gEngine.datamap.unlocksStates.one >= 4) gEngine.setNav(6);
                break;

            case '4':
                if (gEngine.datamap.unlocksStates.one >= 5) gEngine.setNav(3);
                break;

            case '5':
                if (gEngine.datamap.unlocksStates.one >= 6) gEngine.setNav(5);
                break;
            case 'd':
                this.engine.drive.buy();
                break;
            case 'm':
                this.engine.momentum.buy();
                break;
            case 'e':
                this.engine.effort.buy();
                break;
            case 'a':
                this.engine.antiDrive.buy();
                break;
            case 'r':
                this.engine.determination.buy();
                break;
            default:
                break;
        }
    }

}