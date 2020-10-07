import IEffect from "./IEffect.js"
import ResourceNeed from "../need/ResourceNeed.js"

export default class CreateUnitEffect extends IEffect {
    createdUnits = 0

    /**
     * @param {TeamApi} api
     * @param {typeof IMovable} unitType
     * @param {number} amount
     */
    constructor(api, unitType, amount) {
        super(api)

        this.unitType = unitType
        this.requiredAmount = amount
    }

    canRun() {
        return this.api.getResources().biggerThan(this.unitType.price)
    }

    getNeeds() {
        return [
            new ResourceNeed(this.api, this.unitType.price.multiply(this.requiredAmount))
        ]
    }

    run() {
        // TODO
        return []
    }

    isFinished() {
        return this.createdUnits >= this.requiredAmount
    }
}