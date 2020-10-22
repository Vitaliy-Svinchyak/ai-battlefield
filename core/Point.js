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

    toString() {
        return this.x + ':' + this.y
    }

    equals(point) {
        return this.x === point.x && this.y === point.y
    }

    neighbors() {
        return [
            new Point(this.y, this.x + 1),
            new Point(this.y, this.x - 1),
            new Point(this.y - 1, this.x),
            new Point(this.y + 1, this.x),

            new Point(this.y + 1, this.x - 1),
            new Point(this.y + 1, this.x + 1),
            new Point(this.y - 1, this.x - 1),
            new Point(this.y - 1, this.x + 1),
        ]
    }
}