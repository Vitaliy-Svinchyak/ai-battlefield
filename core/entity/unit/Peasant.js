import IMovable from "./IMovable.js"

const image = new Image()
image.src = 'images/peasant.png'

export default class Peasant extends IMovable {
    image = image

    constructor(team) {
        super(team)
    }
}