import IEntity from "./IEntity.js"

const image = new Image()
export default class Empty extends IEntity {
    image = image

    get isSolid() {
        return false
    }

    get isEmpty() {
        return true
    }

    get json() {
        return {type: 'empty'}
    }
}