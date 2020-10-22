export default class SquadValuer {

    /**
     * @param {ProxyApi} api
     */
    constructor(api) {
        this.api = api
    }

    getMyValueOnMyBase() {
        return this.calculateSquadPower(this.api.idleUnits.all.filter(e => this.isNearHome(e)))
    }

    getEnemyValueOnMyBase() {
        return this.calculateSquadPower(this.api.getEnemyUnits().all.filter(e => this.isNearHome(e)))
    }

    /**
     * @param {IMovable} unit
     * @return {number}
     */
    getUnitValue(unit) {
        return unit.attack
    }

    /**
     * @param {IMovable[]} squad
     * @return {number}
     */
    calculateSquadPower(squad) {
        return squad.reduce((t, u) => t + this.getUnitValue(u), 0)
    }

    isNearHome(unit) {
        const home = this.api.getBuildings().townHall[0]
        return this.api.pathFinder.getDistanceSq(unit.position, home.position) <= 10
    }
}