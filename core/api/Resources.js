import * as symbol from "../symbol.js"

const goldSymbol = symbol.default.gold
const foodSymbol = symbol.default.food

export default class Resources {
    constructor() {
        this[goldSymbol] = 0
        this[foodSymbol] = 0
    }

    get gold() {
        return this[goldSymbol]
    }

    get food() {
        return this[foodSymbol]
    }
}