import TeamApi from "./external/TeamApi.js"
import Resources from "./external/Resources.js"
import Unexplored from "../entity/Unexplored.js"
import Point from "../Point.js"
import Field from "../Field.js"
import IResourceSource from "../entity/resource/IResourceSource.js"
import UnitBuilder from "../UnitBuilder.js"
import Empty from "../entity/Empty.js"
import IMovable from "../entity/unit/IMovable.js"
import Peasant from "../entity/unit/Peasant.js"
import Warrior from "../entity/unit/Warrior.js"
import * as symbol from "../symbol.js"
import TownHall from "../entity/building/TownHall.js"
import IBuilding from "../entity/building/IBuilding.js"

const idSymbol = symbol.default.id
export default class Api {

    population = {
        1: 0,
        2: 0
    }

    resources = {
        1: new Resources(0, 0),
        2: new Resources(0, 0),
    }

    get maximumPopulation() {
        return 50
    }

    /**
     * @type {{"1": Map<typeof IMovable, int>, "2": Map<typeof IMovable, int>}}
     */
    unitsToSpawn = {
        1: new Map(),
        2: new Map(),
    }

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field

        this._indexUnits()
        this._indexBuildings()

        this.exploredMap = {
            1: this._unexploredMap(),
            2: this._unexploredMap()
        }

        this.visibleMap = {
            1: this._invisibleMap(),
            2: this._invisibleMap()
        }

        this._recalculateExploredMap()
    }

    tick() {
        this._removeDeadUnits()
        this._removeDestroyedBuildings()
        this._tickForSpawn()
        this._indexUnits()
        this._recalculateExploredMap()
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
     * @return {Map<int, Map<int, boolean>>}
     */
    getVisibleMap(teamNumber) {
        return this.visibleMap[teamNumber]
    }

    /**
     * @param {int} teamNumber
     * @return {{peasant: Peasant[],warrior: Warrior[], all: IMovable[]}}
     */
    getOwnUnits(teamNumber) {
        return {
            peasant: this.units[teamNumber].filter(u => u instanceof Peasant).sort((a, b) => a[idSymbol] - b[idSymbol]),
            warrior: this.units[teamNumber].filter(u => u instanceof Warrior).sort((a, b) => a[idSymbol] - b[idSymbol]),
            all: this.units[teamNumber].sort((a, b) => a[idSymbol] - b[idSymbol])
        }
    }

    /**
     * @param {int} teamNumber
     * @return {{peasant: Peasant[],warrior: Warrior[], all: IMovable[]}}
     */
    getEnemyUnits(teamNumber) {
        let allUnits = []
        const map = this.getMap(teamNumber)

        for (let y = 0; y < map.size; y++) {
            for (let x = 0; x < map.get(y).size; x++) {
                const entity = map.get(y).get(x)
                if (entity instanceof IMovable && entity.team !== teamNumber) {
                    allUnits.push(entity)
                }
            }
        }

        return {
            peasant: allUnits.filter(u => u instanceof Peasant).sort((a, b) => a[idSymbol] - b[idSymbol]),
            warrior: allUnits.filter(u => u instanceof Warrior).sort((a, b) => a[idSymbol] - b[idSymbol]),
            all: allUnits.sort((a, b) => a[idSymbol] - b[idSymbol])
        }
    }

    /**
     * @param {int} teamNumber
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getOwnBuildings(teamNumber) {
        return {
            townHall: this.buildings[teamNumber].filter(u => u instanceof TownHall),
            all: this.buildings[teamNumber],
        }
    }

    /**
     * @param {int} teamNumber
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getEnemyBuildings(teamNumber) {
        let allBuildings = []
        const map = this.getMap(teamNumber)

        for (let y = 0; y < map.size; y++) {
            for (let x = 0; x < map.get(y).size; x++) {
                const entity = map.get(y).get(x)
                if (entity instanceof IBuilding && entity.team !== teamNumber) {
                    allBuildings.push(entity)
                }
            }
        }

        return {
            townHall: allBuildings.filter(u => u instanceof TownHall),
            all: allBuildings,
        }
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
     * @param {int} teamNumber
     * @return {{peasant: int, warrior: int}}
     */
    getProductionStats(teamNumber) {
        const response = {
            peasant: 0,
            warrior: 0,
        }

        for (const unit of this.unitsToSpawn[teamNumber].keys()) {
            if (unit === Peasant) {
                response.peasant++
            } else if (unit === Warrior) {
                response.warrior++
            }
        }
        return response
    }

    /**
     * @param {typeof IMovable} unit
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
            const townHall = this.getOwnBuildings(team).townHall[0]

            if (townHall !== undefined) {
                for (let y = townHall.position.y - 1; y <= townHall.position.y + 1; y++) {
                    for (let x = townHall.position.x - 1; x <= townHall.position.x + 1; x++) {
                        if (this.field.getObject(y, x).isEmpty) {
                            const createdUnit = UnitBuilder.buildUnit(y, x, team, unit)
                            this.field.putObject(y, x, createdUnit)
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
        const units = this.getOwnUnits(team).all
        const buildings = this.getOwnBuildings(team).all

        this._clearVisibleUnitsAndBuildings(team)
        this._recalculateExploredMapForObjects(units, 2, team)
        this._recalculateExploredMapForObjects(buildings, 3, team)
    }

    _clearVisibleUnitsAndBuildings(team) {
        this.visibleMap[team] = this._invisibleMap()
        const map = this.getMap(team)

        for (let y = 0; y < map.size; y++) {
            for (let x = 0; x < map.get(y).size; x++) {
                const object = map.get(y).get(x)

                if ((object instanceof IMovable) && object.team !== team) {
                    map.get(y).set(x, new Empty())
                }
            }
        }
    }

    _recalculateExploredMapForObjects(objects, viewDistance, team) {
        const map = this.getMap(team)

        for (let object of objects) {
            for (let y = object.position.y - viewDistance; y <= object.position.y + viewDistance; y++) {
                for (let x = object.position.x - viewDistance; x <= object.position.x + viewDistance; x++) {
                    if (map.has(y) && map.get(y).has(x)) {
                        map.get(y).set(x, this.getObject(new Point(y, x)))
                        this.visibleMap[team].get(y).set(x, true)
                    }
                }
            }
        }
    }

    _unexploredMap() {
        const field = new Map()

        for (let y = 0; y < this.field.size.rows; y++) {
            const yMap = new Map()

            for (let x = 0; x < this.field.size.cells; x++) {
                yMap.set(x, new Unexplored())
            }

            field.set(y, yMap)
        }

        return field
    }

    _indexUnits() {
        const allUnits = this.field.getAllUnits()
        this.units = {
            1: allUnits.filter(u => u.team === 1),
            2: allUnits.filter(u => u.team === 2),
        }
        this.population[1] = this.getOwnUnits(1).all.reduce((s, u) => s + u.livingPlace, 0)
        this.population[2] = this.getOwnUnits(2).all.reduce((s, u) => s + u.livingPlace, 0)
    }

    _indexBuildings() {
        const allBuildings = this.field.getAllBuildings()

        this.buildings = {
            1: allBuildings.filter(u => u.team === 1),
            2: allBuildings.filter(u => u.team === 2),
        }
    }

    _removeDeadUnits() {
        const allUnits = this.field.getAllUnits()

        for (const unit of allUnits) {
            if (unit.hp <= 0) {
                this.field.putObject(unit.position.y, unit.position.x, new Empty())
            }
        }
    }

    _removeDestroyedBuildings() {
        const allBuildings = this.field.getAllBuildings()

        for (const building of allBuildings) {
            if (building.hp <= 0) {
                this.field.putObject(building.position.y, building.position.x, new Empty())
                throw new Error('Team ' + building.team + ' lose!')
            }
        }
    }

    _invisibleMap() {
        const field = new Map()

        for (let y = 0; y < this.field.size.rows; y++) {
            const yMap = new Map()

            for (let x = 0; x < this.field.size.cells; x++) {
                yMap.set(x, false)
            }

            field.set(y, yMap)
        }

        return field
    }
}