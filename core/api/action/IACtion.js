import UnitActionRegistry from "../UnitActionRegistry.js"
import * as symbol from "../../symbol.js"
import IMovable from "../../entity/unit/IMovable.js"

export default class IAction {

    constructor(team) {
        this[symbol.default.team] = team
    }

    get team() {
        return this[symbol.default.team]
    }

    /**
     * @param {Api} api
     * @return boolean
     */
    validate(api) {
        throw new Error('Implement validate method!')
    }

    /**
     * @param {Engine} engine
     */
    perform(engine) {
        throw new Error('Implement perform method!')
    }

    /**
     * @param {IMovable} unit
     * @return {boolean}
     * @protected
     */
    _validateUnitAction(unit) {
        if (!(unit instanceof IMovable)) {
            console.error(this, ' invalid params!')
            return false
        }

        if (unit[symbol.default.id] === undefined) {
            console.error(this, ' invalid params!')
            return false
        }

        if (unit.team !== this.team) {
            console.error(this, ' it is not your unit!')
            return false
        }

        if (UnitActionRegistry.didAction(unit[symbol.default.id])) {
            console.error(this, ' already did action!')
            return false
        }

        return true
    }
}