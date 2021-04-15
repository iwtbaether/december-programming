import Decimal, { DecimalSource } from "break_infinity.js";
import DisplayDecimal from "../../../UI/DisplayDecimal";
import ExpoCurve, { expoI_buyNCost, expoI_getCost } from "./ExpoCurve";
import { SingleResource } from "./SingleResource";

export class SingleBuilding {

    constructor(public info: BuildingInfo) {

    }

    gainBuilding = (amount: DecimalSource) => {
        this.info.building.gainResource(amount)
    }

    get count() {
        return this.info.building.info.get();
    }

    getCosts() {
        return this.info.costs.map((cost, index) => {
            const costDecimal = this.getCost(index);

            return {
                cost: costDecimal, name: cost.resource.info.name, can: cost.resource.count.greaterThanOrEqualTo(costDecimal),
                capped: cost.resource.cap.lessThan(costDecimal)
            };
        });
    }

    getCostsN=(n: Decimal)=> {
        return this.info.costs.map((cost, index) => {
            const costDecimal = this.getCostN(index, n);

            return {
                cost: costDecimal, name: cost.resource.info.name, can: cost.resource.count.greaterThanOrEqualTo(costDecimal),
                capped: cost.resource.cap.lessThan(costDecimal)
            };
        });
    }

    getCost(index: number) {
        return expoI_getCost(this.info.costs[index].expo, this.count)
    }

    getCostN = (index:number, n:Decimal) => {
        return expoI_buyNCost(this.info.costs[index].expo, this.count, n)
    }

    display() {
        return DisplayDecimal({ decimal: this.count })
    }

    activeUP = () => {
        if (this.info.active) {
            let newActive = Decimal.min(this.count, this.info.active.count.add(1))
            this.info.active.info.setDecimal(newActive)
        }
    }

    activeDOWN = () => {
        if (this.info.active) {
            let newActive = Decimal.max(0, this.info.active.count.minus(1))
            this.info.active.info.setDecimal(newActive)
        }
    }

    activeABLED = () => {
        if (this.info.active) {
            return this.info.active.count
        }
    }

    activeDISABLED = () => {
        if (this.info.active) {
            return this.count.minus(this.activeABLED() as Decimal)
        }
    }

    reset = () => {
        this.info.building.info.setDecimal(new Decimal(0));
    }

    refund = () => {
        const purchased = this.count;
        const ZERO = new Decimal(0)
        this.info.costs.forEach((cost, costIndex)=>{
            let paidSoFar = expoI_buyNCost(cost.expo, ZERO, purchased);
            cost.resource.gainResource(paidSoFar);
        })
        this.reset();
        //let paidSoFar = expoI_buyNCost(this,)
    }

    //return 0 = no
    //return 1 = yes
    //return 2 = capped
    canBuy = () => {
        let can: number = 1;
        let costs = this.getCosts();
        costs.forEach((cost) => {
            if (can != 2) {
                if (can != 0) {
                    if (!cost.can) can = 0;
                }
                if (cost.capped) can = 2
            }

        })
        return can;
        /*
        if (this.info.building.cap.lessThanOrEqualTo(this.count)) return false;
        this.info.costs.forEach((cost, index) => {
            if (can) {
                let resource_cost = this.getCost(index);
                if (resource_cost.greaterThan(cost.resource.count)) can = false;
            }
        });
        return can;*/
    }

    //return 0 = no
    //return 1 = yes
    //return 2 = capped
    canBuyN = (n: Decimal) => {
        let can: number = 1;
        let costs = this.getCostsN(n);
        costs.forEach((cost) => {
            if (can != 2) {
                if (can != 0) {
                    if (!cost.can) can = 0;
                }
                if (cost.capped) can = 2
            }

        })
        return can;
        /*
        if (this.info.building.cap.lessThanOrEqualTo(this.count)) return false;
        this.info.costs.forEach((cost, index) => {
            if (can) {
                let resource_cost = this.getCost(index);
                if (resource_cost.greaterThan(cost.resource.count)) can = false;
            }
        });
        return can;*/
    }


    buy = () => {
        if (this.canBuy() !== 1) return;

        this.info.costs.forEach((cost, index) => {
            let resource_cost = this.getCost(index);
            //console.log(cost.expo, this.count.toNumber(), resource_cost.toNumber());

            cost.resource.loseResource(resource_cost)
        });

        this.gainBuilding(1)

    }

    buyN = (n: Decimal) => {
        if (this.canBuyN(n) !== 1) return;

        this.info.costs.forEach((cost, index) => {
            let resource_cost = this.getCostN(index, n);

            cost.resource.loseResource(resource_cost)
        });

        this.gainBuilding(n)
    }

    buyMaxMaybe = () => {
        while (this.canBuy() === 1) {
   
            this.info.costs.forEach((cost, index) => {
                let resource_cost = this.getCost(index);
                //console.log(cost.expo, this.count.toNumber(), resource_cost.toNumber());
                
                cost.resource.loseResource(resource_cost)
            });
            
            this.gainBuilding(1)
        }
    }
}


interface BuildingInfo {
    building: SingleResource,
    costs: BuildingCostInfo[],
    description: string,
    active?: SingleResource,
    outcome: () => string,
    hidden: () => boolean,
}

interface BuildingCostInfo {
    expo: ExpoCurve,
    resource: SingleResource,
}
