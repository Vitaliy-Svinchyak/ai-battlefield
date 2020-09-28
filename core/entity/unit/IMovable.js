import IEntity from "../IEntity.js"
import * as symbol from "../../symbol.js"

const hpSymbol = symbol.default.hp
const maxHpSymbol = symbol.default.maxHp
const teamSymbol = symbol.default.team
const inventorySymbol = symbol.default.inventory
const attackSymbol = symbol.default.attack

export default class IMovable extends IEntity {
    constructor(team, hp, attack) {
        super()
        this[teamSymbol] = team
        this[inventorySymbol] = []
        this[hpSymbol] = hp
        this[maxHpSymbol] = hp
        this[attackSymbol] = attack
    }

    get team() {
        return this[teamSymbol]
    }

    get maxHp() {
        return this[maxHpSymbol]
    }

    get hp() {
        return this[hpSymbol]
    }

    get attack() {
        return this[attackSymbol]
    }


    get isSolid() {
        return false
    }

    /**
     * @return {IItem[]}
     */
    get inventory() {
        return this[inventorySymbol]
    }

    /**
     * @return {Resources}
     */
    static get price() {
        throw new Error('Implement price getter!')
    }

    /**
     * @return {int}
     */
    static get livingPlace() {
        throw new Error('Implement livingPlace getter!')
    }

    /**
     * @return {int}
     */
    static get ticksForSpawn() {
        throw new Error('Implement ticksForSpawn getter!')
    }
}