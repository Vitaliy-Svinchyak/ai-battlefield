import * as symbol from "../symbol.js"

export default class IEntity {

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
}