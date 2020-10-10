export default class INeed {
    /**
     * @param {ProxyApi} api
     */
    constructor(api) {
        this.api = api
    }

    /**
     * @return {number}
     * @abstract
     */
    getWeight() {
        throw new Error('Implement getWeight method')
    }

    /**
     * @return {boolean}
     * @abstract
     */
    isSatisfied() {
        throw new Error('Implement isSatisfied method')
    }

    /**
     * @return {IEffect[]}
     * @abstract
     */
    getEffects() {
        throw new Error('Implement getActions method')
    }

    /**
     * @return {IEffect[]}
     * @abstract
     */
    getEffectsToSatisfy() {
        throw new Error('Implement getActions method')
    }

    linearWeight(needed, current) {
        return this._borderWeight(current / needed)
    }

    rotatedWeight(weight) {
        return 1 - weight
    }

    quadraticWeight() {

    }

    logisticWeight() {

    }

    customWeight() {

    }

    _borderWeight(weight) {
        return weight > 1 ? 1 : weight < 0 ? 0 : weight
    }
}