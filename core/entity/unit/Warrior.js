import IMovable from "./IMovable.js"
import Resources from "../../api/external/Resources.js"

const image = new Image()
image.src = 'images/warrior.png'

export default class Warrior extends IMovable {
    image = image

    constructor(team) {
        super(team, 20, 2)
    }

    static get price() {
        return new Resources(50, 50)
    }

    static get livingPlace() {
        return 2
    }

    static get ticksForSpawn() {
        return 20
    }
}