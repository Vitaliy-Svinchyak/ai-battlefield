import IEffect from "./IEffect.js"

export class AttackEnemyBaseEffect extends IEffect {

    canRun() {
        return this.api.idleUnits.Warrior.length > 0
    }

    getNeeds() {
        return []
    }

    run() {
        const actions = []
        const map = this.api.getMap()
        const offenceWarriors = this.api.idleUnits.Warrior
        const enemyBase = this.api.getEnemyBuildings().townHall

        for (const warrior of offenceWarriors) {
            let point

            if (enemyBase.length > 0) {
                if (this.api.pathFinder.getDistanceSq(warrior.position, enemyBase[0].position) <= 2) {
                    actions.push(this.api.actions.attack(warrior, enemyBase[0]))
                } else {
                    point = this.api.pathFinder.getNextPointToTheNearestPoint(warrior.position, enemyBase[0].position.neighbors())
                }
            } else {
                point = this.api.pathFinder.getNextPointToTheX(warrior.position, (p) => !map.get(p.y).get(p.x).isExplored)
            }

            // TODO why undefined?
            if (point) {
                actions.push(this.api.actions.move(warrior, point))
            }
        }

        return actions
    }
}