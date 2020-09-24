import MoveUnit from "./action/MoveUnit.js"
import Point from "../Point.js"
import * as symbol from "../symbol.js"
import Mine from "./action/Mine.js"

const teamSymbol = Symbol('team')
const apiSymbol = Symbol('team')
const idSymbol = symbol.default.id
export default class TeamApi {
    /**
     * @param {int} team
     * @param {Api} api
     */
    constructor(team, api) {
        this[teamSymbol] = team
        this[apiSymbol] = api
    }

    getMap() {
        return this[apiSymbol].getMap(this[teamSymbol])
    }

    /**
     * @return {IMovable[]}
     */
    getUnits() {
        return this[apiSymbol].getOwnUnits(this[teamSymbol]).sort((a, b) => a[idSymbol] - b[idSymbol])
    }

    getResources() {
        return this[apiSymbol].getResources(this[teamSymbol])
    }

    getResourcePoints() {
        return this[apiSymbol].getResourcePoints(this[teamSymbol])
    }

    /**
     * @param {IMovable} unit
     * @param {int} y
     * @param {int} x
     * @return {MoveUnit}
     */
    move(unit, y, x) {
        return new MoveUnit(unit, new Point(y, x))
    }

    /**
     * @param {IMovable} unit
     * @param {IResource} resource
     * @return {Mine}
     */
    mine(unit, resource) {
        return new Mine(unit, resource)
    }
}