import IEntity from "./IEntity.js"

const image = new Image()
image.src = 'images/fog.png'
export default class Unexplored extends IEntity {
    image = image
}