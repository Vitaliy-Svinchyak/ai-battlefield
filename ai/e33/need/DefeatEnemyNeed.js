import INeed from "./INeed.js"
import CreateUnitEffect from "../effect/CreateUnitEffect.js"
import {AttackEnemyBaseEffect} from "../effect/AttackEnemyBaseEffect.js"

export default class DefeatEnemyNeed extends INeed {

    getEffects() {
        return [
            new AttackEnemyBaseEffect(this.api)
        ]
    }

    getEffectsToSatisfy() {
        return [
            // new CreateUnitEffect(this.api, this.api.units.warrior, 1),
        ]
    }

    getWeight() {
        return this.linearWeight(4, this.api.idleUnits.Warrior.length)
    }

    isSatisfied() {
        return this.api.idleUnits.Warrior.length >= 4
    }
}