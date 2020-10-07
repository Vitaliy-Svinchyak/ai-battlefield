import INeed from "./INeed.js"

export default class UnitNeed extends INeed {
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