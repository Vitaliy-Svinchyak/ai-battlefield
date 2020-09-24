import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const teamSymbol = symbol.default.team

export default class IMovable extends IEntity {
    constructor(team) {
        super()
        this[teamSymbol] = team
    }

    get team() {
        return this[teamSymbol]
    }

    /**
     * @return {Point}
     */
    get position() {
        return this[symbol.default.position]
    }
}