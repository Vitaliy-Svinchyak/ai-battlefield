import IMovable from "./entity/unit/IMovable.js"
import IBuilding from "./entity/building/IBuilding.js"
import Rock from "./entity/solid/Rock.js"
import Empty from "./entity/Empty.js"
import Tree from "./entity/solid/Tree.js"
import FoodSource from "./entity/resource/FoodSource.js"
import GoldSource from "./entity/resource/GoldSource.js"

export default class SaveManager {
    /**
     * @param {Field} field
     * @return {*}
     */
    static toJson(field) {
        const json = []
        for (let y = 0; y < field.size.rows; y++) {
            const row = []

            for (let x = 0; x < field.size.cells; x++) {
                const entity = field.fieldMap.get(y).get(x)
                if (entity instanceof IMovable || entity instanceof IBuilding) {
                    row.push({type: 'empty'})
                } else {
                    row.push(entity.json)
                }

            }

            json.push(row)

        }

        return JSON.stringify(json)
    }

    /**
     * @param {string} field
     * @return {Map<int, Map<int, IEntity>>}
     */
    static fromJson(field) {
        const mapArr = JSON.parse(field)
        const map = new Map()

        for (let y = 0; y < mapArr.length; y++) {
            const row = new Map()

            for (let x = 0; x < mapArr[y].length; x++) {
                let entity
                switch (mapArr[y][x].type) {
                    case 'rock':
                        entity = new Rock()
                        break
                    case 'empty':
                        entity = new Empty()
                        break
                    case 'tree':
                        entity = new Tree()
                        break
                    case 'foodSource':
                        entity = new FoodSource()
                        break
                    case 'goldSource':
                        entity = new GoldSource()
                        break
                    default:
                        throw new Error('Unknown type ' + mapArr[y][x].type)
                }
                row.set(x, entity)
            }
            map.set(y, row)
        }

        return map
    }
}