import Peasant from "./entity/unit/Peasant.js"
import Empty from "./entity/Empty.js"

export default class Field {
    get size() {
        return {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        }
    }

    /**
     * @param {Map<int, Map<int, IEntity>>} fieldMap
     */
    constructor(fieldMap) {
        console.log(fieldMap)
        this.fieldMap = fieldMap
    }

    getImage(y, x) {
        return this.fieldMap.get(y).get(x).image
    }

    getAllUnits() {
        const units = []

        for (let y = 0; y < this.size.rows; y++) {
            for (let x = 0; x < this.size.cells; x++) {
                const object = this.getObject(y, x)
                if (object instanceof Peasant) {
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
     * @param {IEntity} object
     * @param {Point} from
     * @param {Point} to
     */
    moveObject(object, from, to) {
        this.fieldMap.get(from.y).set(from.x, new Empty())
        this.fieldMap.get(to.y).set(to.x, object)
    }
}