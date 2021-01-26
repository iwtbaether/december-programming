import Decimal from "break_infinity.js";
import { gEngine } from "..";
import Engine from "./Engine";
import { SingleResource } from "./externalfns/decimalInterfaces/SingleResource";

export default class Research {

    constructor(public engine: Engine){

    }
    /*
    olivine: SingleResearch = new SingleResearch({
        name: "Planetary Olivine (Mg2+, Fe2+)2SiO",
        description: "Gives your planetary reactions access to magnesium, iron, and silicon.",
        makeTrue: ()=>{this.engine.datamap.bools.olivine = true},
        get: ()=>this.engine.datamap.bools.olivine,
        costs: [
            {count: new Decimal(10), resource: this.engine.resources.luck},
            {count: new Decimal(0.1), resource: this.engine.resources.oxygen},
        ],
        hidden: ()=>this.engine.datamap.cell.hillsNShit.eq(0) 
    })*/
    

}

export class SingleResearch {

    constructor(public info: ResearchInfo){

    }

    getCosts () {
        return this.info.costs.map((cost, index) => {
            const costDecimal = this.getCost(index);

            return {cost:costDecimal, name: cost.resource.info.name, can: cost.resource.count.greaterThanOrEqualTo(costDecimal),
            capped: cost.resource.cap.lessThan(costDecimal) };
        });
    }

    getCost (index: number) {
        return this.info.costs[index].count
    }


    //return 0 = no
    //return 1 = yes
    //return 2 = capped
    canBuy = () => {
        let can:number = 1;
        let costs = this.getCosts();
        costs.forEach((cost)=>{
            if (can != 2) {
                if (can != 0) {
                    if (!cost.can) can = 0;
                }
                if (cost.capped) can =2
            }

        })
        return can;

    }

    buy = () => {
        if (this.canBuy() !== 1) return;

        this.info.costs.forEach((cost, index) => {
                let resource_cost = this.getCost(index);                
                cost.resource.loseResource(resource_cost)
        });

        this.info.makeTrue()
        gEngine.notify();
    }

    get true () {
        return this.info.get();
    }

}

interface ResearchInfo {
    get: ()=>boolean,
    makeTrue: VoidFunction,
    name: string,
    description: string,
    costs: {count: Decimal, resource: SingleResource}[],
    hidden: ()=>boolean,
}