import * as symbol from "../../symbol.js"
import Peasant from "../../entity/unit/Peasant.js"
import ActionsBuilder from "./ActionsBuilder.js"
import Warrior from "../../entity/unit/Warrior.js"

const teamSymbol = symbol.default.team
const idSymbol = symbol.default.id
const apiSymbol = Symbol('team')
const actionsSymbol = Symbol('actions')

export default class TeamApi {
    get maximumPopulation() {
        return this[apiSymbol].maximumPopulation
    }

    /**
     * @return {ActionsBuilder}
     */
    get actions() {
        return this[actionsSymbol]
    }

    units = {
        peasant: Peasant,
        warrior: Warrior
    }

    /**
     * @param {int} team
     * @param {Api} api
     */
    constructor(team, api) {
        this[teamSymbol] = team
        this[apiSymbol] = api
        this[actionsSymbol] = new ActionsBuilder(this.team)
    }

    get team() {
        return this[teamSymbol]
    }

    /**
     * @return {Map<int, Map<int, IEntity>>}
     */
    getMap() {
        return this[apiSymbol].getMap(this[teamSymbol])
    }

    /**
     * @return {IMovable[]}
     */
    getUnits() {
        return this[apiSymbol].getOwnUnits(this[teamSymbol])
            .sort((a, b) => a[idSymbol] - b[idSymbol])
    }

    /**
     * @return {IBuilding[]}
     */
    getBuilding() {
        return this[apiSymbol].getOwnBuildings(this[teamSymbol])
    }

    /**
     * @return {Resources}
     */
    getResources() {
        return this[apiSymbol].getResources(this[teamSymbol])
    }

    /**
     * @return {int}
     */
    getPopulation() {
        return this[apiSymbol].getPopulation(this[teamSymbol])
    }

    /**
     * @return {IResourceSource[]}
     */
    getResourcePoints() {
        return this[apiSymbol].getResourcePoints(this[teamSymbol])
    }
}