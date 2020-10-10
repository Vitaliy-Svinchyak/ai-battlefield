import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import Resources from "../../../core/api/external/Resources.js"
import GetResourcesEffect from "../effect/MineResourcesEffect.js"

export default class BuildEconomyNeed extends INeed {
    neededAmountOfPeasants = 7

    getEffects() {
        return [
            new GetResourcesEffect(this.api, new Resources(Infinity, Infinity))
        ]
    }

    getEffectsToSatisfy() {
        return [
            new CreateUnitEffect(this.api, this.api.units.peasant, this.neededAmountOfPeasants - this.api.getUnits().Peasant.length)
        ]
    }

    getWeight() {
        const currentPeasantsAmount = this.api.getUnits().Peasant.length

        // console.log(this, this.rotatedWeight(this.linearWeight(this.neededAmountOfPeasants, currentPeasantsAmount)))
        return this.rotatedWeight(this.linearWeight(this.neededAmountOfPeasants, currentPeasantsAmount))
    }

    isSatisfied() {
        return this.api.getUnits().Peasant.length >= this.neededAmountOfPeasants
    }
}