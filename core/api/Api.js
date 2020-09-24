import TeamApi from "./TeamApi.js"
import Resources from "./Resources.js"
import Unexplored from "../entity/Unexplored.js"
import Point from "../Point.js"
import Field from "../Field.js"

export default class Api {

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

        this.resources = {
            1: new Resources(),
            2: new Resources(),
        }

        this.exploredMap = {
            1: this.unexploredMap(),
            2: this.unexploredMap()
        }

        this.recalculateExploredMap()
    }

    /**
     * @param {int} teamNumber
     * @return {TeamApi}
     */
    team(teamNumber) {
        return new TeamApi(teamNumber, this)
    }

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

    getResources(teamNumber) {
        return this.resources[teamNumber]
    }

    getResourcePoints(teamNumber) {
        return this.getMap(teamNumber)
        return this.resources[teamNumber]
    }

    /**
     * @param {Point} point
     * @return {IEntity}
     */
    getObject(point) {
        return this.field.getObject(point.y, point.x)
    }

    recalculateExploredMap() {
        this.recalculateExploredMapForTeam(1)
        this.recalculateExploredMapForTeam(2)
    }

    recalculateExploredMapForTeam(team) {
        const units = this.getOwnUnits(team)
        const buildings = this.getOwnBuildings(team)

        this.recalculateExploredMapForObjects(units, 2, team)
        this.recalculateExploredMapForObjects(buildings, 3, team)
    }

    recalculateExploredMapForObjects(objects, viewDistance, team) {
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

    unexploredMap() {
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