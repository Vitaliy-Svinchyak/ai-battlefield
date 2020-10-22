import IEffect from "./IEffect.js"
import Point from "../../../core/Point.js"

export default class CreateDefenciveCircleEffect extends IEffect {

    canRun() {
        return this.api.idleUnits.Warrior.length > 0
    }

    getNeeds() {
        return []
    }

    run() {
        const actions = []
        const defenceWarriors = this.api.idleUnits.Warrior
            .filter(w => this.api.squadValuer.isNearHome(w))
        const circlePoints = this._createWallOfBodies()

        for (const warrior of defenceWarriors) {
            // TODO left tunnel
            const point = this.api.pathFinder.getNextPointToTheNearestPoint(warrior.position, circlePoints)

            // TODO why undefined?
            if (point) {
                actions.push(this.api.actions.move(warrior, point))
            }
        }

        return actions
    }

    _createWallOfBodies() {
        const homePosition = this.api.getBuildings().townHall[0].position
        const map = this.api.getMap()
        const range = 10

        const pairs = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
        let points = []

        for (const pair of pairs) {
            let pointsBatch = []
            for (let i = 0; i <= range; i++) {
                pointsBatch.push(new Point(homePosition.y + (i * pair[0]), homePosition.x + ((range - i) * pair[1])))
            }

            if (pair[0] + pair[1] === 0) {
                pointsBatch = pointsBatch.reverse()
            }

            points = [...points, ...pointsBatch]
        }

        points = points.filter(p => map.has(p.y) && map.get(p.y).get(p.x) !== undefined
            && (map.get(p.y).get(p.x).isEmpty || !map.get(p.y).get(p.x).isExplored))

        return points
    }
}