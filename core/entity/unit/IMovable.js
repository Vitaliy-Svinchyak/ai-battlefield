import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const teamSymbol = symbol.default.team
const inventory = symbol.default.inventory

export default class IMovable extends IEntity {
    constructor(team) {
        super()
        this[teamSymbol] = team
        this[inventory] = []
    }

    get team() {
        return this[teamSymbol]
    }

    /**
     * @return {IItem[]}
     */
    get inventory() {
        return this[inventory]
    }
}