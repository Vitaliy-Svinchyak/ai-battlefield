"use strict"
const ySymbol = Symbol('y')
const xSymbol = Symbol('x')

export default class Point {
    constructor(y, x) {
        this[ySymbol] = y
        this[xSymbol] = x
    }

    get y() {
        return this[ySymbol]
    }

    get x() {
        return this[xSymbol]
    }

    /**
     * @param {Api} api
     * @return {boolean}
     */
    validate(api) {
        if (!Number.isInteger(this.x) || !Number.isInteger(this.y)) {
            return false
        }

        if (api.getObject(this) === undefined) {
            return false
        }

        return true
    }
}