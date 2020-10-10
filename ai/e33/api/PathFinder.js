import Point from "../../../core/Point.js"

export default class PathFinder {

    /**
     * @type {Point[]}
     */
    bookedPoints = []

    /**
     * @param {ProxyApi} api
     */
    constructor(api) {
        this._api = api
    }

    /**
     * @param {Point} point
     */
    book(point) {
        this.bookedPoints.push(point)
    }

    /**
     * @param {Point} startPoint
     * @param {Function} check
     * @return {Point}
     */
    getNextPointToTheX(startPoint, check) {
        let startPositions = [{parent: null, point: startPoint}]
        const usedPoints = new Map()
        const maxRadius = this._api.getMap().size

        let i = 0
        while (true) {
            const newPoints = this._getVariants(startPositions, usedPoints)
                .filter((p) => this._filterValidPositions(p))
            startPositions = newPoints

            for (const position of newPoints) {
                usedPoints.set(position.point.toString(), true)
                const point = position.point
                if (check(point)) {
                    return this._getRoot(position)
                }
            }

            i++
            if (i > maxRadius) {
                // console.dir(startPoint)
                // console.dir(check)
                // console.error('too long')
                return null
            }
        }
    }

    /**
     * @param {Point} point1
     * @param {Point} point2
     * @return {number}
     */
    getDistanceSq(point1, point2) {
        let d0 = point2.x - point1.x
        let d1 = point2.y - point1.y
        return d0 * d0 + d1 * d1
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
     * @return {boolean}
     * @private
     */
    _filterValidPositions(position) {
        const map = this._api.getMap()

        const from = position.parent.point
        const to = position.point
        if (!map.has(to.y) || !map.get(to.y).has(to.x)) {
            return false
        }

        if (this.bookedPoints.filter(p => p.y === to.y && p.x === to.x).length > 0) {
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
}