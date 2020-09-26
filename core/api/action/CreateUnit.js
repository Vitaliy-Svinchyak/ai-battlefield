import IAction from "./IACtion.js"
import IMovable from "../../entity/unit/IMovable.js"
import * as symbol from "../../symbol.js"

const goldSymbol = symbol.default.gold
const foodSymbol = symbol.default.food

export default class CreateUnit extends IAction {

    /**
     * @param {typeof IMovable} unit
     * @param {int} team
     */
    constructor(unit, team) {
        super(team)
        this.unit = unit
    }

    validate(api) {
        return this._validateParams() && this._validateCreation(api)
    }

    perform(engine) {
        const resources = engine.api.getResources(this.team)
        resources[goldSymbol] = resources.gold - this.unit.price.gold
        resources[foodSymbol] = resources.food - this.unit.price.food

        engine.api.creteDelayedSpawn(new this.unit(this.team), this.team, this.unit.ticksForSpawn)
    }

    _validateParams() {
        if (!(this.unit.prototype instanceof IMovable)) {
            console.error(this, ' should be an instance of IMovable')
            return false
        }

        return true
    }

    /**
     * @param {Api} api
     * @return {boolean}
     * @private
     */
    _validateCreation(api) {
        if (!api.getResources(this.team).enough(this.unit.price)) {
            console.error(this, 'not enough resources!')
            return false
        }

        if (!api.getPopulation(this.team) + this.unit.livingPlace > api.maximumPopulation) {
            console.error(this, 'not enough living place!')
            return false
        }

        return true
    }
}