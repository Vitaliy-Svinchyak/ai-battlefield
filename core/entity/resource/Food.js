import IEntity from "../IEntity.js"

const image = new Image()
image.src = 'images/food.png'

export default class Food  extends IEntity{
    image = image
}