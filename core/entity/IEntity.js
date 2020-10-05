import * as symbol from "../symbol.js"

export default class IEntity {
    image = new Image()

    /**
     * @param {Api} api
     */
    validate(api) {
        if (api.getObject(this.position) !== this) {
            return false
        }

        return true
    }

    /**
     * @return {Point}
     */
    get position() {
        return this[symbol.default.position]
    }

    /**
     * @return boolean
     */
    get isSolid() {
        throw new Error('Implement isSolid method!')
    }

    /**
     * @return boolean
     */
    get isEmpty() {
        return false
    }

    /**
     * @return boolean
     */
    get isExplored() {
        return true
    }

    /**
     * @return {number}
     */
    get hp() {
        return Infinity
    }

    get json() {
        throw new Error('Implement json getter!')
    }
}