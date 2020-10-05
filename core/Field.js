import Empty from "./entity/Empty.js"
import IMovable from "./entity/unit/IMovable.js"
import IBuilding from "./entity/building/IBuilding.js"

export default class Field {
    get size() {
        return {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        }
    }

    /**
     * @param {Map<int, Map<int, IEntity>>} fieldMap
     * @param {Map<int, Map<int, boolean>>} visibleMap
     */
    constructor(fieldMap, visibleMap) {
        this.fieldMap = fieldMap
        this.visibleMap = visibleMap
    }

    /**
     * @return {IMovable[]}
     */
    getAllUnits() {
        const units = []

        for (let y = 0; y < this.size.rows; y++) {
            for (let x = 0; x < this.size.cells; x++) {
                const object = this.getObject(y, x)
                if (object instanceof IMovable) {
                    units.push(object)
                }
            }
        }

        return units
    }

    getAllBuildings() {
        const units = []

        for (let y = 0; y < this.size.rows; y++) {
            for (let x = 0; x < this.size.cells; x++) {
                const object = this.getObject(y, x)
                if (object instanceof IBuilding) {
                    units.push(object)
                }
            }
        }

        return units
    }

    getObject(y, x) {
        if (!this.fieldMap.has(y)) {
            return undefined
        }

        return this.fieldMap.get(y).get(x)
    }

    /**
     * @param {int} y
     * @param {int} x
     * @param {IEntity} object
     */
    putObject(y, x, object) {
        return this.fieldMap.get(y).set(x, object)
    }

    /**
     * @param {IMovable} object
     * @param {Point} from
     * @param {Point} to
     */
    moveObject(object, from, to) {
        this.fieldMap.get(from.y).set(from.x, new Empty())
        this.fieldMap.get(to.y).set(to.x, object)
    }

    /**
     * @param {int} y
     * @param {int} x
     * @return {boolean}
     */
    isVisible(y, x) {
        if (this.visibleMap === null) {
            return true
        }

        if (!this.visibleMap.has(y)) {
            return false
        }

        return this.visibleMap.get(y).get(x)
    }
}