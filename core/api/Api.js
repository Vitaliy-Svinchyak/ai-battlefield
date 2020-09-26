import TeamApi from "./external/TeamApi.js"
import Resources from "./external/Resources.js"
import Unexplored from "../entity/Unexplored.js"
import Point from "../Point.js"
import Field from "../Field.js"
import IResourceSource from "../entity/resource/IResourceSource.js"
import Empty from "../entity/Empty.js"

export default class Api {

    population = {
        1: 2,
        2: 2
    }

    resources = {
        1: new Resources(0, 0),
        2: new Resources(0, 0),
    }

    get maximumPopulation() {
        return 50
    }

    unitsToSpawn = {
        1: new Map(),
        2: new Map(),
    }

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field
        const allUnits = field.getAllUnits()
        const buildings = field.getAllBuildings()

        this.units = {
            1: allUnits.filter(u => u.team === 1),
            2: allUnits.filter(u => u.team === 2),
        }

        this.buildings = {
            1: buildings.filter(u => u.team === 1),
            2: buildings.filter(u => u.team === 2),
        }

        this.exploredMap = {
            1: this._unexploredMap(),
            2: this._unexploredMap()
        }

        this._recalculateExploredMap()
    }

    tick() {
        this._recalculateExploredMap()
        this._tickForSpawn()
    }

    /**
     * @param {int} teamNumber
     * @return {TeamApi}
     */
    team(teamNumber) {
        return new TeamApi(teamNumber, this)
    }

    /**
     * @param {int} teamNumber
     * @return {Map<int, Map<int, IEntity>>}
     */
    getMap(teamNumber) {
        return this.exploredMap[teamNumber]
    }

    /**
     * @param {int} teamNumber
     * @return {IMovable[]}
     */
    getOwnUnits(teamNumber) {
        return this.units[teamNumber]
    }

    /**
     * @param {int} teamNumber
     * @return {IBuilding[]}
     */
    getOwnBuildings(teamNumber) {
        return this.buildings[teamNumber]
    }

    /**
     * @param {int} teamNumber
     * @return {Resources}
     */
    getResources(teamNumber) {
        return this.resources[teamNumber]
    }

    /**
     * @param {int} teamNumber
     * @return {IResourceSource[]}
     */
    getResourcePoints(teamNumber) {
        const map = this.getMap(teamNumber)
        const resources = []

        for (let y = 0; y < map.size; y++) {
            for (let x = 0; x < map.get(y).size; x++) {
                if (map.get(y).get(x) instanceof IResourceSource) {
                    resources.push(map.get(y).get(x))
                }
            }
        }

        return resources
    }

    /**
     * @param {int} teamNumber
     * @return {int}
     */
    getPopulation(teamNumber) {
        return this.population[teamNumber]
    }

    /**
     * @param {Point} point
     * @return {IEntity}
     */
    getObject(point) {
        return this.field.getObject(point.y, point.x)
    }

    /**
     * @param {IMovable} unit
     * @param {int} ticks
     * @param {int} team
     */
    creteDelayedSpawn(unit, team, ticks) {
        this.unitsToSpawn[team].set(unit, ticks)
    }

    _tickForSpawn() {
        this._spawnForTeam(1)
        this._spawnForTeam(2)
    }

    _spawnForTeam(team) {
        if (this.unitsToSpawn[team].size === 0) {
            return
        }

        const unitsToSpawn = this.unitsToSpawn[team]
        const unit = unitsToSpawn.keys().next().value
        unitsToSpawn.set(unit, unitsToSpawn.get(unit) - 1)

        if (unitsToSpawn.get(unit) <= 0) {
            const townHall = this.getOwnBuildings(team)[0]
            if (townHall !== undefined) {
                for (let y = townHall.position.y - 1; y <= townHall.position.y + 1; y++) {
                    for (let x = townHall.position.x - 1; x <= townHall.position.x + 1; x++) {
                        if (this.field.getObject(y, x) instanceof Empty) {
                            this.field.putObject(y, x, unit)
                            unitsToSpawn.delete(unit)
                            return
                        }
                    }
                }
            }
        }
    }

    _recalculateExploredMap() {
        this._recalculateExploredMapForTeam(1)
        this._recalculateExploredMapForTeam(2)
    }

    _recalculateExploredMapForTeam(team) {
        const units = this.getOwnUnits(team)
        const buildings = this.getOwnBuildings(team)

        this._recalculateExploredMapForObjects(units, 2, team)
        this._recalculateExploredMapForObjects(buildings, 3, team)
    }

    _recalculateExploredMapForObjects(objects, viewDistance, team) {
        for (let object of objects) {
            for (let y = object.position.y - viewDistance; y <= object.position.y + viewDistance; y++) {
                for (let x = object.position.x - viewDistance; x <= object.position.x + viewDistance; x++) {
                    if (this.exploredMap[team].has(y) && this.exploredMap[team].get(y).has(x)) {
                        this.exploredMap[team].get(y).set(x, this.getObject(new Point(y, x)))
                    }
                }
            }
        }
    }

    _unexploredMap() {
        const field = new Map()

        for (let y = 0; y <= this.field.size.rows; y++) {
            const yMap = new Map()

            for (let x = 0; x <= this.field.size.cells; x++) {
                yMap.set(x, new Unexplored())
            }

            field.set(y, yMap)
        }

        return field
    }
}