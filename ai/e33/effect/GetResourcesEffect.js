import IEffect from "./IEffect.js"
import UnitNeed from "../need/UnitNeed.js"
import Peasant from "../../../core/entity/unit/Peasant.js"

export default class GetResourcesEffect extends IEffect {
    constructor(api, resources) {
        super(api)
        this.neededResources = resources
    }

    canRun() {
        return this.api.getUnits().Peasant.length > 0
    }

    getNeeds() {
        return [new UnitNeed(this.api, Peasant, 1)]
    }

    run() {
        // TODO
        return []
    }

    isFinished() {
        return this.api.getResources().biggerThan(this.neededResources)
    }
}