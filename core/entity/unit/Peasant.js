const image = new Image()
image.src = 'images/peasant.png'
const teamSymbol = Symbol('team')
import * as symbol from "../../symbol.js"

export default class Peasant {
    image = image

    constructor(team) {
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