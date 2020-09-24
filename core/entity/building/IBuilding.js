import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const teamSymbol = symbol.default.team

export default class IBuilding extends IEntity {
    constructor(team) {
        super()
        this[teamSymbol] = team
    }

    get team() {
        return this[teamSymbol]
    }
}