import IBuilding from "./IBuilding.js"

const image = new Image()
image.src = 'images/house.png'

export default class TownHall extends IBuilding {
    image = image

    constructor(team) {
        super(team, 300)
    }

}