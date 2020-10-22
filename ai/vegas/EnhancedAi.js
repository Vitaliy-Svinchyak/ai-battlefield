import AI from "../../core/api/external/AI.js"
import Point from "../../core/Point.js"

export default class EnhancedAi extends AI {

    howManyAttacks = 0;

    tick(api) {
        const actions = []
        const units = api.getUnits().peasant
        const enemyBuildings = api.getEnemyBuildings().townHall
        const enemyUnits = api.getEnemyUnits().all
        //TODO change howManyAttacks to killedUnits count
        if (!enemyUnits || !enemyUnits.length && this.howManyAttacks < 20) {
            for (const unit of units) {
                const newPoint = this._getNextPointToTheNearestFog(unit, api)
                actions.push(api.actions.move(unit, newPoint))
            }
        }
        else if (this.howManyAttacks >= 20 && !enemyUnits.length) {
            if (enemyBuildings.length === 0) {
                for (const unit of units) {
                    const newPoint = this._getNextPointToTheNearestFog(unit, api)
                    actions.push(api.actions.move(unit, newPoint))
                }
            } else {
                for (const unit of units) {
                    if (this._getDistanceSq(unit.position, enemyBuildings[0].position) <= 2) {
                        actions.push(api.actions.attack(unit, enemyBuildings[0]))
                    } else {
                        const newPoint = this._getNextPointToTheBuilding(unit, enemyBuildings[0], api)
                        actions.push(api.actions.move(unit, newPoint))
                    }
                }
            }
        }
        else {
            for (const unit of units) {
                if (this._getDistanceSq(unit.position, enemyUnits[0].position) <= 2) {
                    actions.push(api.actions.attack(unit, enemyUnits[0]))
                    this.incrementHowManyAttacks();
                } else {
                    const newPoint = this._getNextPointToTheBuilding(unit, enemyUnits[0], api)
                    actions.push(api.actions.move(unit, newPoint))
                }
            }
        }

        return actions
    }

    get color() {
        return [117, 0, 182]
    }

    incrementHowManyAttacks() {
       return this.howManyAttacks++
    }

    /**
     * @param {IMovable} unit
     * @param {IBuilding} building
     * @param {TeamApi} api
     * @return {Point}
     * @private
     */
    _getNextPointToTheBuilding(unit, building, api) {
        return this._getNextPointToTheX(
            unit,
            (point) => this._getDistanceSq(point, building.position) <= 2,
            api
        )
    }

    /**
     * @param {IMovable} unit
     * @param {TeamApi} api
     * @return {Point}
     * @private
     */
    _getNextPointToTheNearestFog(unit, api) {
        const map = api.getMap()

        return this._getNextPointToTheX(
            unit,
            (point) => !map.get(point.y).get(point.x).isExplored,
            api
        )
    }


    /**
     * @param {IMovable} unit
     * @param {TeamApi} api
     * @return {Point}
     * @private
     */
    _fuckEnemyPussy(unit, api) {
        const map = api.getMap()

        return this._getNextPointToTheX(
            unit,
            (point) => !map.get(point.y).get(point.x).isExplored,
            api
        )
    }

    /**
     * @param {IMovable} unit
     * @param {Function} check
     * @param {TeamApi} api
     * @return {Point}
     * @private
     */
    _getNextPointToTheX(unit, check, api) {
        let startPositions = [{parent: null, point: unit.position}]
        const usedPoints = new Map()

        while (true) {
            const newPoints = this._getVariants(startPositions, usedPoints)
                .filter((p) => this._filterValidPositions(p, api))
            startPositions = newPoints

            for (const position of newPoints) {
                usedPoints.set(position.point.toString(), true)
                if (check(position.point)) {
                    return this._getRoot(position)
                }
            }
        }
    }

    /**
     * @param {{parent:Object,point:Point}[]} points
     * @param {Map<string, boolean>} usedPoints
     * @return {{parent:Object,point:Point}[]}
     */
    _getVariants(points, usedPoints) {
        const newVariants = []
        const usedOnThisStepPoints = new Map()

        for (const position of points) {
            const point = position.point
            const variantsFromPoint = [
                new Point(point.y, point.x + 1),
                new Point(point.y, point.x - 1),
                new Point(point.y - 1, point.x),
                new Point(point.y + 1, point.x),

                new Point(point.y + 1, point.x - 1),
                new Point(point.y + 1, point.x + 1),
                new Point(point.y - 1, point.x - 1),
                new Point(point.y - 1, point.x + 1),
            ].filter(p =>
                usedPoints.get(p.toString()) === undefined
                && usedOnThisStepPoints.get(p.toString()) === undefined)

            for (const newPoint of variantsFromPoint) {
                usedOnThisStepPoints.set(newPoint.toString(), true)
                newVariants.push({parent: position, point: newPoint})
            }
        }

        return newVariants
    }

    /**
     * @param {{parent:Object,point:Point}} position
     * @param {TeamApi} api
     * @return {boolean}
     * @private
     */
    _filterValidPositions(position, api) {
        const map = api.getMap()

        const from = position.parent.point
        const to = position.point
        if (!map.has(to.y) || !map.get(to.y).has(to.x)) {
            return false
        }

        if (!map.get(to.y).get(to.x).isExplored) {
            return true
        }

        if (!map.get(to.y).get(to.x).isEmpty) {
            return false
        }

        // diagonal
        if (from.y !== to.y && from.x !== to.x) {
            const wall1 = map.get(to.y).get(from.x)
            const wall2 = map.get(from.y).get(to.x)

            if (wall1.isSolid && wall2.isSolid) {
                return false
            }
        }

        return true
    }

    /**
     * @param {{parent:Object,point:Point}} position
     * @return {Point}
     * @private
     */
    _getRoot(position) {
        while (position.parent.parent !== null) {
            position = position.parent
        }

        return position.point
    }

    _getDistanceSq(point1, point2) {
        let d0 = point2.x - point1.x
        let d1 = point2.y - point1.y
        return d0 * d0 + d1 * d1
    }
}
