export default class IEffect {
    /**
     * @param {ProxyApi} api
     */
    constructor(api) {
        this.api = api
    }

    /**
     * @return {boolean}
     * @abstract
     */
    canRun() {
        throw new Error('Implement canRun method')
    }

    /**
     * @return {INeed[]}
     * @abstract
     */
    getNeeds() {
        throw new Error('Implement getNeeds method')
    }

    /**
     * @return {IAction[]}
     * @abstract
     */
    run() {
        throw new Error('Implement run method')
    }
}