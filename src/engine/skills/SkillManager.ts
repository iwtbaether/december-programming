import Engine from "../Engine";
import { SingleBuilding } from "../externalfns/decimalInterfaces/SingleBuilding";
import { SingleResource } from "../externalfns/decimalInterfaces/SingleResource";

export default class SkillManager {

    constructor (public engine: Engine) {
        
    }
}

export interface SkillInterface {
    name: string;
    xpRes: SingleResource;
    levelRes: SingleBuilding;

}