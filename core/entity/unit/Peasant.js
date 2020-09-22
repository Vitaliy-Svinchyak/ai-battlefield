const image = new Image()
image.src = 'images/peasant.png'
const teamSymbol = Symbol('team')

export default class Peasant {
    image = image

    constructor(team) {
        this[teamSymbol] = team
    }

    getTeam() {
        return this[teamSymbol]
    }
}