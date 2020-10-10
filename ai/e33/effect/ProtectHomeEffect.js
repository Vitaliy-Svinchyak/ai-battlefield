import IEffect from "./IEffect.js"
import CreateUnitNeed from "../need/CreateUnitNeed.js"

export default class ProtectHomeEffect extends IEffect {

    canRun() {
        return this.api.idleUnits.all.length > 0
    }

    getNeeds() {
        // TODO
        return [
            new CreateUnitNeed(this.api, this.api.units.peasant, 1),
            new CreateUnitNeed(this.api, this.api.units.warrior, 1)
        ]
    }

    run() {
        const actions = []
        const enemies = this.api.getEnemyUnits().all.filter(w => this.api.squadValuer.isNearHome(w))
        let enemyValue = this.api.squadValuer.getEnemyValueOnMyBase()
        const homePosition = this.api.getBuildings().townHall[0].position

        // TODO sort by distance to enemies
        const closestWarriors = this.api.idleUnits.Warrior
            .filter(w => this.api.squadValuer.isNearHome(w))
            .sort((a, b) => this._nearestToTheX(a, b, homePosition))
        const closestPeasants = this.api.idleUnits.Peasant
            .filter(p => this.api.squadValuer.isNearHome(p))
            .sort((a, b) => this._nearestToTheX(a, b, homePosition))
        const otherWarriors = this.api.idleUnits.Warrior
            .filter(w => !this.api.squadValuer.isNearHome(w))
            .sort((a, b) => this._nearestToTheX(a, b, homePosition))
        const otherPeasants = this.api.idleUnits.Peasant
            .filter(p => !this.api.squadValuer.isNearHome(p))
            .sort((a, b) => this._nearestToTheX(a, b, homePosition))
        const allMyUnits = [...closestWarriors, ...closestPeasants, ...otherWarriors, ...otherPeasants]

        for (const unit of allMyUnits) {
            const action = this._fightWithAttackers(unit, enemies)

            if (action !== null) {
                actions.push(action)
                enemyValue -= this.api.squadValuer.getUnitValue(unit)
            }

            if (enemyValue < 0) {
                break
            }
        }

        return actions
    }

    /**
     * @param {IMovable} unit
     * @param {IMovable[]} enemies
     * @return {IAction}
     */
    _fightWithAttackers(unit, enemies) {
        const map = this.api.getMap()
        const nearestEnemies = enemies.sort((a, b) => this._nearestToTheX(a, b, unit.position))
        const enemyToAttack = nearestEnemies[0]

        if (this.api.pathFinder.getDistanceSq(unit.position, enemyToAttack.position) <= 2) {
            return this.api.actions.attack(unit, enemyToAttack)
        } else {
            const newPoint = this.api.pathFinder.getNextPointToTheX(unit.position, (p) => enemies.indexOf(map.get(p.y).get(p.x)) !== -1)
            if (newPoint !== null) {
                return this.api.actions.move(unit, newPoint)
            }
        }

        return null
    }

    /**
     * @param {IMovable} a
     * @param {IMovable} b
     * @param {Point} position
     * @return {number}
     * @private
     */
    _nearestToTheX(a, b, position) {
        const aDistance = this.api.pathFinder.getDistanceSq(a.position, position)
        const bDistance = this.api.pathFinder.getDistanceSq(b.position, position)

        return aDistance - bDistance
    }

}