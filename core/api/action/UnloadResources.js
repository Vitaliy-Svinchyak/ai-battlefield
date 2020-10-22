import IAction from "./IAction.js"
import Peasant from "../../entity/unit/Peasant.js"
import TownHall from "../../entity/building/TownHall.js"
import IItemResource from "../../entity/item/IItemResource.js"
import GoldItem from "../../entity/item/GoldItem.js"
import FoodItem from "../../entity/item/FoodItem.js"
import * as symbol from "../../symbol.js"

const goldSymbol = symbol.default.gold
const foodSymbol = symbol.default.food
const inventorySymbol = symbol.default.inventory

export default class UnloadResources extends IAction {
    /**
     * @param {IMovable} unit
     * @param {IBuilding} building
     * @param {int} team
     */
    constructor(unit, building, team) {
        super(team)
        this.unit = unit
        this.building = building
    }

    validate(api) {
        return this._validateParams(api) && this._validateUnitAction(this.unit) && this._validateUnload()
    }

    _validateParams(api) {
        if (!this.building.validate(api)) {
            console.error(this, ' invalid building!')
            return false
        }
        if (!(this.building instanceof TownHall)) {
            console.error(this, ' should be TownHall!')
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

        return true
    }

    _validateUnload() {
        if (Math.abs(this.unit.position.y - this.building.position.y) > 1) {
            console.error(this, ' too big distance!')
            return false
        }
        if (Math.abs(this.unit.position.x - this.building.position.x) > 1) {
            console.error(this, ' too big distance!')
            return false
        }

        if (this.unit.inventory.length === 0) {
            console.error(this, ' empty inventory!')
            return false
        }

        if (!(this.unit.inventory[0] instanceof IItemResource)) {
            console.error(this, ' item is not a resource!')
            return false
        }

        if (this.building.team !== this.team) {
            console.error(this, ' it is not your building!')
            return false
        }

        return true
    }

    perform(engine) {
        const inventory = this.unit.inventory
        let item = inventory[0]
        const resources = engine.api.getResources(this.unit.team)

        if (item instanceof GoldItem) {
            resources[goldSymbol] = resources.gold + item.amount
        } else if (item instanceof FoodItem) {
            resources[foodSymbol] = resources.food + item.amount
        }

        this.unit[inventorySymbol] = []
    }
}