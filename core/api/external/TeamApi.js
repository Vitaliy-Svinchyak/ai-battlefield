import * as symbol from "../../symbol.js"
import Peasant from "../../entity/unit/Peasant.js"
import ActionsBuilder from "./ActionsBuilder.js"
import Warrior from "../../entity/unit/Warrior.js"

const teamSymbol = symbol.default.team
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

    get production() {
        return this[apiSymbol].getProductionStats(this.team)
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
     * @return {{Peasant: Peasant[], Warrior: Warrior[], all: IMovable[]}}
     */
    getUnits() {
        return this[apiSymbol].getOwnUnits(this[teamSymbol])
    }

    /**
     * @return {{Peasant: Peasant[], Warrior: Warrior[], all: IMovable[]}}
     */
    getEnemyUnits() {
        return this[apiSymbol].getEnemyUnits(this[teamSymbol])
    }

    /**
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getBuildings() {
        return this[apiSymbol].getOwnBuildings(this[teamSymbol])
    }

    /**
     * @return {{townHall: TownHall[], all: IBuilding[]}}
     */
    getEnemyBuildings() {
        return this[apiSymbol].getEnemyBuildings(this[teamSymbol])
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