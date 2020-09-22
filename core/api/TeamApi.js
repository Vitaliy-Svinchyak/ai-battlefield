const teamSymbol = Symbol('team')
export default class TeamApi {
    /**
     * @param {int} team
     * @param {Api} api
     */
    constructor(team, api) {
        this[teamSymbol] = team
        this.api = api
    }

    getMap() {
        return this.api.getMap(this[teamSymbol])
    }

    getUnits() {
        return this.api.getOwnUnits(this[teamSymbol])
    }

    getResources() {
        return this.api.getResources(this[teamSymbol])
    }
}