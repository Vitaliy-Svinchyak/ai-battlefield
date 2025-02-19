import IEntity from "../IEntity.js"

const image = new Image()
image.src = 'images/rock.png'

export default class Rock extends IEntity {
    image = image


    get isSolid() {
        return true
    }

    get json() {
        return {
            type: 'rock'
        }
    }
}