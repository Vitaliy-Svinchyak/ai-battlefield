import IEntity from "../IEntity.js"

const image = new Image()
image.src = 'images/tree.png'

export default class Tree  extends IEntity{
    image = image
}