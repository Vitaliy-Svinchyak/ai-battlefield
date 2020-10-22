import INeed from "./INeed.js"

export default class CreateUnitNeed extends INeed {
    /**
     * @param {ProxyApi} api
     * @param {typeof IMovable} unitType
     * @param {number} amount
     */
    constructor(api, unitType, amount) {
        super(api)
        this.unitType = unitType
        this.requiredAmount = amount
    }

    getEffects() {
        return []
    }

    getEffectsToSatisfy() {
        return []
    }

    getWeight() {
        return 0
    }

    isSatisfied() {
        const allUnits = this.api.getUnits()
        const totalAmount = allUnits[this.unitType.name]

        return totalAmount >= this.requiredAmount
    }
}