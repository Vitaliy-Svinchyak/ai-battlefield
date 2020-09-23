import MoveUnit from "./action/MoveUnit.js"
import Point from "../Point.js"

const teamSymbol = Symbol('team')
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
        return this.api.getOwnUnits(this[teamSymbol])
    }

    getResources() {
        return this.api.getResources(this[teamSymbol])
    }

    move(unit, y, x) {
        return new MoveUnit(unit, new Point(y, x))
    }
}