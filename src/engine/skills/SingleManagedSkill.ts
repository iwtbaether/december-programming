import Decimal, { DecimalSource } from "break_infinity.js";
import SkillManager, { Skill_Data, levelToXPReq } from "./SkillManager";


export class SingleManagedSkill {
    constructor(public manager: SkillManager, public getData: () => Skill_Data, public name: string) {
    }

    open = () => {
        this.manager.openSkill(this);
    };

    setReqXP = () => {
        this.reqXP = this.getReqXP();
    };
    private getReqXP = () => {
        return levelToXPReq(this.getData().level);
    };
    reqXP: Decimal = this.getReqXP();

    gainXP = (gained: DecimalSource) => {
        let data = this.getData();
        data.xp = Decimal.floor(data.xp.add(gained));
    };
}
