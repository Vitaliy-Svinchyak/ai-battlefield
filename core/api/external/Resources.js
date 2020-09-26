import * as symbol from "../../symbol.js"

const goldSymbol = symbol.default.gold
const foodSymbol = symbol.default.food

export default class Resources {
    /**
     * @param {int} gold
     * @param {int} food
     */
    constructor(gold, food) {
        this[goldSymbol] = gold
        this[foodSymbol] = food
    }

    get gold() {
        return this[goldSymbol]
    }

    get food() {
        return this[foodSymbol]
    }

    /**
     * @param {Resources} resources
     */
    enough(resources) {
        return this.gold >= resources.gold && this.food >= resources.food
    }
}