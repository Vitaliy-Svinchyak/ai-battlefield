import * as symbol from "../../symbol.js"

const amountSymbol = symbol.default.amount

export default class IItem {
    constructor() {
        this[amountSymbol] = 0
    }

    get amount() {
        return this[amountSymbol]
    }
}