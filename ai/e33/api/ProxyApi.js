import Peasant from "../../../core/entity/unit/Peasant.js"
import Warrior from "../../../core/entity/unit/Warrior.js"
import UnitsManager from "./UnitsManager.js"
import PathFinder from "./PathFinder.js"
import TownHall from "../../../core/entity/building/TownHall.js"
import FoodSource from "../../../core/entity/resource/FoodSource.js"

export default class ProxyApi {
    /**
     * @param {TeamApi} teamApi
     */
    constructor(teamApi) {
        this.teamApi = teamApi
        this.unitsManager = new UnitsManager(this)
        this.pathFinder = new PathFinder(this)
    }

    get maximumPopulation() {
        return this.teamApi.maximumPopulation
    }

    /**
     * @return {ActionsBuilder}
     */
    get actions() {
        return this.teamApi.actions
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
        return this.pathFinder.getNextPointToTheX(unit.position, (p) => resourcePoints.indexOf(p) !== -1)
    }

    /**
     * @param {IMovable} unit
     */
    getPathToTheNearestTownHall(unit) {
        return this.pathFinder.getNextPointToTheX(unit.position, (p) => p instanceof TownHall)
    }
}