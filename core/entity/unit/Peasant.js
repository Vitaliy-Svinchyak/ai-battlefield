import * as symbol from "../../symbol.js"
import IMovable from "../IMovable.js"

const image = new Image()
image.src = 'images/peasant.png'
const teamSymbol = Symbol('team')

export default class Peasant extends IMovable {
    image = image

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