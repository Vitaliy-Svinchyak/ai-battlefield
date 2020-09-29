export default class AI {
    constructor(team) {
        this.team = team
    }

    get color() {
        throw new Error('implement color getter!')
    }
}