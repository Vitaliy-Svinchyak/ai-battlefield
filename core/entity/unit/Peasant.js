import IMovable from "./IMovable.js"
import Resources from "../../api/external/Resources.js"

const image = new Image()
image.src = 'images/peasant.png'

export default class Peasant extends IMovable {
    image = image

    constructor(team) {
        super(team)
    }

    static get price() {
        return new Resources(0, 5)
    }

    static get livingPlace() {
        return 1
    }

    static get ticksForSpawn() {
        return 10
    }
}