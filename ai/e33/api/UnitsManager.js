import Peasant from "../../../core/entity/unit/Peasant.js"
import Warrior from "../../../core/entity/unit/Warrior.js"

export default class UnitsManager {
    busyUnits = {
        [Peasant.name]: [],
        [Warrior.name]: []
    }

    /**
     * @param {ProxyApi} api
     */
    constructor(api) {
        this.api = api
    }

    /**
     * @return {{Peasant: Peasant[], Warrior: Warrior[]}}
     */
    get idleUnits() {
        return {
            [Peasant.name]: this.api.getUnits().Peasant.filter(u => this.busyUnits[Peasant.name].indexOf(u) === -1),
            [Warrior.name]: this.api.getUnits().Warrior.filter(u => this.busyUnits[Warrior.name].indexOf(u) === -1),
            all: this.api.getUnits().all.filter(u => this.busyUnits[u.constructor.name].indexOf(u) === -1)
        }
    }

    /**
     * @param{IMovable} unit
     */
    book(unit) {
        this.busyUnits[unit.constructor.name].push(unit)
    }

    clear() {
        this.busyUnits = {
            [Peasant.name]: [],
            [Warrior.name]: []
        }
    }
}