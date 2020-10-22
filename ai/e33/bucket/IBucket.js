export default class IBucket {
    _weight
    _parent

    /**
     * @param {number} weight
     * @param {IBucket} parent
     */
    constructor(weight = 0.0, parent = null) {
        if (weight < 0 || weight > 1) {
            throw new Error('Wrong weight ' + weight)
        }

        this._weight = weight
        this._parent = parent
    }

    get weight() {
        const parentWeight = this._parent ? this._parent.weight : 0
        return this._weight + parentWeight
    }
}