import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const hpSymbol = symbol.default.hp
const teamSymbol = symbol.default.team
const maxHpSymbol = symbol.default.maxHp

export default class IBuilding extends IEntity {
    constructor(team, hp) {
        super()
        this[teamSymbol] = team
        this[hpSymbol] = hp
        this[maxHpSymbol] = hp
    }

    get team() {
        return this[teamSymbol]
    }

    get hp() {
        return this[hpSymbol]
    }

    get maxHp() {
        return this[maxHpSymbol]
    }

    get isSolid() {
        return true
    }
}