import IEntity from "../IEntity.js"

const image = new Image()
image.src = 'images/house.png'

export default class TownHall  extends IEntity{
    image = image

    constructor(team) {
        super()
        this.team = team
    }
}