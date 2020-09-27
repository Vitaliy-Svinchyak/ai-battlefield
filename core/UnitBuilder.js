import Point from "./Point.js"
import * as symbol from "./symbol.js"

const positionSymbol = symbol.default.position
const idSymbol = symbol.default.id
let id = 0
export default class UnitBuilder {
    static buildUnit(y, x, team, constructor) {
        const peasant = new constructor(team)
        peasant[positionSymbol] = new Point(y, x)
        peasant[idSymbol] = id
        id++
        return peasant
    }
}