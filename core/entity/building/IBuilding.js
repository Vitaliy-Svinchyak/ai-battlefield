import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const hpSymbol = symbol.default.hp
const teamSymbol = symbol.default.team

export default class IBuilding extends IEntity {
    constructor(team, hp) {
        super()
        this[teamSymbol] = team
        this[hpSymbol] = hp
    }

    get team() {
        return this[teamSymbol]
    }

    get hp() {
        return this[hpSymbol]
    }

    get isSolid() {
        return true
    }
}