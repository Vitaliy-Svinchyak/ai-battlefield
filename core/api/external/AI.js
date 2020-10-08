export default class AI {
    constructor(team) {
        this.team = team
    }

    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     * @abstract
     */
    tick(api) {
        throw new Error('implement tick getter!')
    }

    /**
     * @return number[]
     * @abstract
     */
    get color() {
        throw new Error('implement color getter!')
    }
}