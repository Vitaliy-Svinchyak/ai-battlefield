import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import ProtectHomeEffect from "../effect/ProtectHomeEffect.js"

export default class ProtectHomeNeed extends INeed {

    getEffects() {
        return [
            new ProtectHomeEffect(this.api)
        ]
    }

    getEffectsToSatisfy() {
        const leftPlace = this.api.maximumPopulation - this.api.getPopulation()

        if (leftPlace > this.api.units.warrior.livingPlace) {
            return [
                new CreateUnitEffect(this.api, this.api.units.warrior, 1)
            ]
        }

        return []
    }

    getWeight() {
        const enemyValue = this.api.squadValuer.getEnemyValueOnMyBase()
        if (enemyValue === 0) {
            return 0
        }
        return this.linearWeight(enemyValue, this.api.squadValuer.getMyValueOnMyBase())
    }

    isSatisfied() {
        return this.api.getEnemyUnits().all.filter(e => this.api.squadValuer.isNearHome(e)).length > 0
    }
}
