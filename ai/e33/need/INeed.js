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
        return current / needed
    }

    rotatedWeight(weight) {
        return 1 - weight
    }
}