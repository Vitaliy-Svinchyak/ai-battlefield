const goldSymbol = Symbol('gold')
const foodSymbol = Symbol('food')

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