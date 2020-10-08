import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import Peasant from "../../../core/entity/unit/Peasant.js"
import Resources from "../../../core/api/external/Resources.js"
import GetResourcesEffect from "../effect/MineResourcesEffect.js"

export default class BuildEconomyNeed extends INeed {
    neededAmountOfPeasants = 6

    getEffects() {
        return [
            new GetResourcesEffect(this.api, new Resources(Infinity, Infinity))
        ]
    }

    getEffectsToSatisfy() {
        return [
            new CreateUnitEffect(this.api, Peasant, this.neededAmountOfPeasants - this.api.getUnits().Peasant.length)
        ]
    }

    getWeight() {
        const currentPeasantsAmount = this.api.getUnits().Peasant.length
        return this.rotatedWeight(this.linearWeight(this.neededAmountOfPeasants, currentPeasantsAmount))
    }

    isSatisfied() {
        return this.api.getUnits().Peasant.length >= this.neededAmountOfPeasants
    }
}