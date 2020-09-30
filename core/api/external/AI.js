export default class AI {
    constructor(team) {
        this.team = team
    }

    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        throw new Error('implement tick getter!')
    }

    get color() {
        throw new Error('implement color getter!')
    }
}