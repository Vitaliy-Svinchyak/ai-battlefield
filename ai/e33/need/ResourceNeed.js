import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import GetResourcesEffect from "../effect/MineResourcesEffect.js"

export default class ResourceNeed extends INeed {
    /**
     * @param {ProxyApi} api
     * @param {Resources} resources
     */
    constructor(api, resources) {
        super(api)
        this.neededResources = resources
    }

    getEffects() {
        return [
            new GetResourcesEffect(this.api, this.neededResources)
        ]
    }

    getEffectsToSatisfy() {
        return [
            new CreateUnitEffect(this.api, this.api.units.peasant, 1)
        ]
    }

    getWeight() {
        return 0
    }

    isSatisfied() {
        return this.api.getUnits().Peasant.length > 0
    }
}