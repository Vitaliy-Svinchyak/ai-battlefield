import IAction from "./IACtion.js"
import Empty from "../../entity/Empty.js"
import * as symbol from "../../symbol.js"

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
        if (Math.abs(this.unit.position.y - this.newPosition.y) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        if (Math.abs(this.unit.position.x - this.newPosition.x) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        if (!(api.getObject(this.newPosition) instanceof Empty)) {
            console.error(this.newPosition, 'is not empty!')
            return false
        }

        // diagonal
        if (this.unit.position.y !== this.newPosition.y && this.unit.position.x !== this.newPosition.x) {

        }

        return true
    }

    perform(engine) {
        const oldPosition = this.unit.position
        engine.field.moveObject(this.unit, this.unit.position, this.newPosition)
        this.unit[symbol.default.position] = this.newPosition

        return [oldPosition, this.newPosition]
    }
}