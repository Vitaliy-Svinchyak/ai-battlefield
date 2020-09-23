import TeamApi from "./TeamApi.js"
import Resources from "./Resources.js"

export default class Api {

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field
        const allUnits = field.getAllUnits()

        this.units = {
            1: allUnits.filter(u => u.team === 1),
            2: allUnits.filter(u => u.team === 2),
        }

        this.resources = {
            1: new Resources(),
            2: new Resources(),
        }
    }

    /**
     * @param {int} teamNumber
     * @return {TeamApi}
     */
    team(teamNumber) {
        return new TeamApi(teamNumber, this)
    }

    getMap(teamNumber) {

    }

    getOwnUnits(teamNumber) {
        return this.units[teamNumber]
    }

    getResources(teamNumber) {
        return this.resources[teamNumber]
    }

    /**
     * @param {Point} point
     * @return {IEntity}
     */
    getObject(point) {
        return this.field.getObject(point.y, point.x)
    }
}