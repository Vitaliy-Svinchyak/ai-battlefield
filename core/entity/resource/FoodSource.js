import IResource from "./IResource.js"
import FoodItem from "../item/FoodItem.js"

const image = new Image()
image.src = 'images/food.png'

export default class FoodSource extends IResource {
    image = image

    get item() {
        return new FoodItem()
    }
}