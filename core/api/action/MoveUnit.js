import IAction from "./IAction.js"
import * as symbol from "../../symbol.js"
import Point from "../../Point.js"
import UnitActionRegistry from "../UnitActionRegistry.js"
import IMovable from "../../entity/unit/IMovable.js"

export default class MoveUnit extends IAction {

    /**
     * @param {IMovable} unit
     * @param {Point} position
     * @param {int} team
     */
    constructor(unit, position, team) {
        super(team)
        this.unit = unit
        this.newPosition = position
    }

    validate(api) {
        return this._validateParams(api) && this._validateUnitAction(this.unit) && this._validateMove(api)
    }

    perform(engine) {
        UnitActionRegistry.addAction(this.unit[symbol.default.id])

        engine.field.moveObject(this.unit, this.unit.position, this.newPosition)
        this.unit[symbol.default.position] = this.newPosition
    }

    _validateParams(api) {
        if (!(this.newPosition instanceof Point)) {
            console.error(this, ' invalid new position!')
            return false
        }
        if (!this.newPosition.validate(api)) {
            console.error(this, ' invalid new position!')
            return false
        }
        if (!this.unit.validate(api)) {
            console.error(this, ' invalid unit!')
            return false
        }

        return true
    }

    _validateMove(api) {
        if (Math.abs(this.unit.position.y - this.newPosition.y) > 1) {
            console.error(this, ' too big distance!')
            return false
        }
        if (Math.abs(this.unit.position.x - this.newPosition.x) > 1) {
            console.error(this, ' too big distance!')
            return false
        }
        if (!(api.getObject(this.newPosition).isEmpty)) {
            console.error(this, 'is not empty!')
            return false
        }
        // diagonal
        if (this.unit.position.y !== this.newPosition.y && this.unit.position.x !== this.newPosition.x) {
            const wall1 = api.getObject(new Point(this.newPosition.y, this.unit.position.x))
            const wall2 = api.getObject(new Point(this.unit.position.y, this.newPosition.x))

            if (wall1.isSolid && wall2.isSolid) {
                console.log(wall1, wall2)
                console.error(this, ' wall on the way!')
                return false
            }
        }

        return true
    }
}