const image = new Image()
image.src = 'images/peasant.png'

export default class Peasant {
    image = image

    constructor(team) {
        this.team = team
    }
}