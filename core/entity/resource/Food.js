import IResource from "./IResource.js"

const image = new Image()
image.src = 'images/food.png'

export default class Food extends IResource {
    image = image
}