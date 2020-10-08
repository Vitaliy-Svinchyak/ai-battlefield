import Peasant from "../../../core/entity/unit/Peasant.js"
import Warrior from "../../../core/entity/unit/Warrior.js"
import UnitsManager from "./UnitsManager.js"
import PathFinder from "./PathFinder.js"
import TownHall from "../../../core/entity/building/TownHall.js"
import ProxyActionsBuilder from "./ProxyActionsBuilder.js"

export default class ProxyApi {
    /**
     * @param {TeamApi} teamApi
     */
    constructor(teamApi) {
        this.teamApi = teamApi
        this.unitsManager = new UnitsManager(this)
        this.pathFinder = new PathFinder(this)
        this.actionsBuilder = new ProxyActionsBuilder(teamApi.actions, this.unitsManager, this.pathFinder)
    }

    get maximumPopulation() {
        return this.teamApi.maximumPopulation
    }

    /**
     * @return {ProxyActionsBuilder}
     */
    get actions() {
        return this.actionsBuilder
    }

    get production() {
        return this.teamApi.production
    }

    get team() {
        return this.teamApi.team
    }

    /**
     * @return {{Peasant: Peasant[], Warrior: Warrior[]}}
     */
    get idleUnits() {
        return this.unitsManager.idleUnits
    }

    /**
     * @return {Map<int, Map<int, IEntity>>}
     */
    getMap() {
        return this.teamApi.getMap()
    }

    /**
     * @return {{Peasant: Peasant[], Warrior: Warrior[], all: IMovable[]}}
     */
    getUnits() {
        return this.teamApi.getUnits()
    }

    /**
     * @return {{Peasant: Peasant[], Warrior: Warrior[], all: IMovable[]}}
     */
    getEnemyUnits() {
        return this.teamApi.getEnemyUnits()
    }

    /**
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getBuildings() {
        return this.teamApi.getBuildings()
    }

    /**
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getEnemyBuildings() {
        return this.teamApi.getEnemyBuildings()
    }

    /**
     * @return {Resources}
     */
    getResources() {
        return this.teamApi.getResources()
    }

    /**
     * @return {int}
     */
    getPopulation() {
        return this.teamApi.getPopulation()
    }

    /**
     * @return {IResourceSource[]}
     */
    getResourcePoints() {
        return this.teamApi.getResourcePoints()
    }

    /**
     * @param {IMovable} unit
     * @param {Function} check
     */
    getPathToNearestResourceForUnit(unit, check) {
        const resourcePoints = this.getResourcePoints().filter(check)
            .sort((a, b) => this.pathFinder.getDistanceSq(unit.position, a.position) - this.pathFinder.getDistanceSq(unit.position, b.position))

        return this.pathFinder.getNextPointToTheX(unit.position, (p) => this._isNearby(resourcePoints, p))
    }

    /**
     * @param {IMovable} unit
     */
    getPathToTheNearestTownHall(unit) {
        const townHalls = this.getBuildings().townHall
        return this.pathFinder.getNextPointToTheX(unit.position, (p) => this._isNearby(townHalls, p))
    }

    /**
     * @param {Point} p
     * @return {IEntity[]}
     */
    getPointsNearPoint(p) {
        const map = this.getMap()

        return [
            map.get(p.y).get(p.x - 1),
            map.get(p.y).get(p.x + 1),
            map.get(p.y - 1).get(p.x + 1),
            map.get(p.y + 1).get(p.x + 1),
            map.get(p.y + 1).get(p.x - 1),
            map.get(p.y - 1).get(p.x - 1),
            map.get(p.y + 1).get(p.x),
            map.get(p.y - 1).get(p.x),
        ]
    }

    /**
     * @param {IMovable[]|IBuilding[]|IResourceSource[]} entities
     * @param {Point} point
     * @return {boolean}
     * @private
     */
    _isNearby(entities, point) {
        return entities.filter(r => this.pathFinder.getDistanceSq(point, r.position) <= 2).length > 0
    }
}