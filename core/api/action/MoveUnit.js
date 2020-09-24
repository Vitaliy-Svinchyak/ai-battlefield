import IAction from "./IACtion.js"
import Empty from "../../entity/Empty.js"
import * as symbol from "../../symbol.js"
import Point from "../../Point.js"
import UnitActionRegistry from "../UnitActionRegistry.js"
import IMovable from "../../entity/unit/IMovable.js"

export default class MoveUnit extends IAction {

    /**
     * @param {Peasant} unit
     * @param {Point} position
     */
    constructor(unit, position) {
        super()
        this.unit = unit
        this.newPosition = position
    }

    validate(api) {
        return this._validateParams(api) && this._validateAction() && this._validateMove(api)
    }

    perform(engine) {
        UnitActionRegistry.addAction(this.unit[symbol.default.id])

        engine.field.moveObject(this.unit, this.unit.position, this.newPosition)
        this.unit[symbol.default.position] = this.newPosition
    }

    _validateParams(api) {
        if (!this.newPosition.validate(api)) {
            console.error(this, ' invalid params!')
            return false
        }
        if (!(this.unit instanceof IMovable)) {
            console.error(this, ' invalid params!')
            return false
        }
        if (this.unit[symbol.default.id] === undefined) {
            console.error(this, ' invalid params!')
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
        if (!(api.getObject(this.newPosition) instanceof Empty)) {
            console.error(this, 'is not empty!')
            return false
        }
        // diagonal
        if (this.unit.position.y !== this.newPosition.y && this.unit.position.x !== this.newPosition.x) {
            const wall1 = api.getObject(new Point(this.newPosition.y, this.unit.position.x))
            const wall2 = api.getObject(new Point(this.newPosition.y, this.unit.position.x))

            if (!(wall1 instanceof Empty) && !(wall2 instanceof Empty)) {
                console.error(this, ' wall on the way!')
                return false
            }
        }

        return true
    }

    _validateAction() {
        if (UnitActionRegistry.didAction(this.unit[symbol.default.id])) {
            console.error(this, ' already did action!')
            return false
        }

        return true
    }
}