import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import Peasant from "../../../core/entity/unit/Peasant.js"
import GetResourcesEffect from "../effect/GetResourcesEffect.js"

export default class ResourceNeed extends INeed {
    /**
     * @param {TeamApi} api
     * @param {Resources} resources
     */
    constructor(api, resources) {
        super(api)
        this.neededResources = resources
    }

    getEffects() {
        return [
            new GetResourcesEffect()
        ]
    }

    getEffectsToSatisfy() {
        return [
            new CreateUnitEffect(this.api, Peasant, 1)
        ]
    }

    getWeight() {
        return 0
    }

    isSatisfied() {
        return this.api.getUnits().Peasant.length > 0
    }
}