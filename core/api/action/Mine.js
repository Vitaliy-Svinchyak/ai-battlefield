import IAction from "./IACtion.js"
import IMovable from "../../entity/unit/IMovable.js"
import Peasant from "../../entity/unit/Peasant.js"
import GoldItem from "../../entity/item/GoldItem.js"
import FoodSource from "../../entity/resource/FoodSource.js"
import FoodItem from "../../entity/item/FoodItem.js"
import GoldSource from "../../entity/resource/GoldSource.js"
import * as symbol from "../../symbol.js"
import Point from "../../Point.js"

const amountSymbol = symbol.default.amount
const inventorySymbol = symbol.default.inventory

export default class Mine extends IAction {
    /**
     * @param {IMovable} unit
     * @param {IResourceSource} resource
     * @param {int} team
     */
    constructor(unit, resource, team) {
        super(team)
        this.unit = unit
        this.resource = resource
    }

    validate(api) {
        return this._validateParams(api) && this._validateUnitAction(this.unit) && this._validateMine(api)
    }

    _validateParams(api) {
        if (!this.resource.validate(api)) {
            console.error(this, ' invalid resource!')
            return false
        }
        if (!this.unit.validate(api)) {
            console.error(this, ' invalid unit!')
            return false
        }
        if (!(this.unit instanceof Peasant)) {
            console.error(this, ' unit should be peasant!')
            return false
        }

        const inventory = this.unit.inventory
        if (inventory.length > 0) {
            const item = inventory[0]
            if (
                (item instanceof GoldItem && this.resource instanceof FoodSource)
                || (item instanceof FoodItem && this.resource instanceof GoldSource)
            ) {
                console.error(this, ' resource is not the same as in inventory!')
                return false
            }

            if (item.amount >= 10) {
                console.error(this, ' peasant cant handle more then 10!')
                return false
            }
        }

        return true
    }

    _validateMine(api) {
        if (Math.abs(this.unit.position.y - this.resource.position.y) > 1) {
            console.error(this, ' too big distance!')
            return false
        }
        if (Math.abs(this.unit.position.x - this.resource.position.x) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        // diagonal
        if (this.unit.position.y !== this.resource.position.y && this.unit.position.x !== this.resource.position.x) {
            const wall1 = api.getObject(new Point(this.resource.position.y, this.unit.position.x))
            const wall2 = api.getObject(new Point(this.unit.position.y, this.resource.position.x))

            if (wall1.isSolid && wall2.isSolid) {
                console.log(wall1, wall2)
                console.error(this, ' wall on the way!')
                return false
            }
        }

        return true
    }

    perform(engine) {
        const inventory = this.unit.inventory
        let item = inventory.length > 0 ? inventory[0] : this.resource.item
        item[amountSymbol] = item.amount + 1
        this.unit[inventorySymbol] = [item]
    }
}