import IAction from "./IAction.js"
import IMovable from "../../entity/unit/IMovable.js"
import IBuilding from "../../entity/building/IBuilding.js"
import Point from "../../Point.js"
import * as symbol from "../../symbol.js"

const hpSymbol = symbol.default.hp
export default class AttackTarget extends IAction {

    /**
     * @param {IMovable} unit
     * @param {IMovable|IBuilding} target
     */
    constructor(unit, target) {
        super()
        this.unit = unit
        this.target = target
    }

    validate(api) {
        return this._validateParams() && this._validateAttack(api)
    }

    perform(engine) {
        const damage = this.unit.attack
        let newHp = this.target.hp - damage
        if (newHp < 0) {
            newHp = 0
        }

        this.target[hpSymbol] = newHp
    }

    _validateParams() {
        if (!(this.unit instanceof IMovable)) {
            console.error(this, ' unit should be an instance of IMovable')
            return false
        }

        if (!(this.target instanceof IMovable) && !(this.target instanceof IBuilding)) {
            console.error(this, ' target should be an instance of IMovable/IBuilding')
            return false
        }

        return true
    }

    _validateAttack(api) {
        if (this.unit === this.target) {
            console.error(this, "unit can't attack himself")
            return false
        }

        if (Math.abs(this.unit.position.y - this.target.position.y) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        if (Math.abs(this.unit.position.x - this.target.position.x) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        // diagonal
        if (this.unit.position.y !== this.target.position.y && this.unit.position.x !== this.target.position.x) {
            const wall1 = api.getObject(new Point(this.target.position.y, this.unit.position.x))
            const wall2 = api.getObject(new Point(this.unit.position.y, this.target.position.x))

            if (wall1.isSolid && wall2.isSolid) {
                console.log(wall1, wall2)
                console.error(this, ' wall on the way!')
                return false
            }
        }

        if (this.unit.hp === 0) {
            console.error(this, ' unit dead!')
            return false
        }

        if (this.target.hp === 0) {
            console.error(this, ' target dead!')
            return false
        }

        return true
    }
}