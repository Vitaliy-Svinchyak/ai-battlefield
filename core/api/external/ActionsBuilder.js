import MoveUnit from "../action/MoveUnit.js"
import Point from "../../Point.js"
import Mine from "../action/Mine.js"
import UnloadResources from "../action/UnloadResources.js"
import CreateUnit from "../action/CreateUnit.js"
import * as symbol from "../../symbol.js"
import AttackTarget from "../action/AttackTarget.js"

const teamSymbol = symbol.default.team

export default class ActionsBuilder {
    /**
     * @param {int} team
     */
    constructor(team) {
        this[teamSymbol] = team
    }

    get team() {
        return this[teamSymbol]
    }

    /**
     * @param {IMovable} unit
     * @param {Point} point
     * @return {MoveUnit}
     */
    move(unit, point) {
        return new MoveUnit(unit, point, this.team)
    }

    /**
     * @param {IMovable} unit
     * @param {IResourceSource} resource
     * @return {Mine}
     */
    mine(unit, resource) {
        return new Mine(unit, resource, this.team)
    }

    /**
     * @param {IMovable} unit
     * @param {IBuilding} building
     * @return {UnloadResources}
     */
    unload(unit, building) {
        return new UnloadResources(unit, building, this.team)
    }

    /**
     * @param {IMovable} unit
     */
    createUnit(unit) {
        return new CreateUnit(unit, this.team)
    }

    /**
     * @param {IMovable} unit
     * @param {IMovable|IBuilding} target
     */
    attack(unit, target) {
        return new AttackTarget(unit, target)
    }
}