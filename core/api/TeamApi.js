import MoveUnit from "./action/MoveUnit.js"
import Point from "../Point.js"
import * as symbol from "../symbol.js"

const teamSymbol = Symbol('team')
const idSymbol = symbol.default.id
export default class TeamApi {
    /**
     * @param {int} team
     * @param {Api} api
     */
    constructor(team, api) {
        this[teamSymbol] = team
        this.api = api
    }

    getMap() {
        return this.api.getMap(this[teamSymbol])
    }

    /**
     * @return {Peasant[]}
     */
    getUnits() {
        return this.api.getOwnUnits(this[teamSymbol]).sort((a, b) => a[idSymbol] - b[idSymbol])
    }

    getResources() {
        return this.api.getResources(this[teamSymbol])
    }

    move(unit, y, x) {
        return new MoveUnit(unit, new Point(y, x))
    }
}