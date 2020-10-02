import IResourceSource from "./IResourceSource.js"
import FoodItem from "../item/FoodItem.js"

const image = new Image()
image.src = 'images/food.png'

export default class FoodSource extends IResourceSource {
    image = image

    get item() {
        return new FoodItem()
    }

    get json() {
        return {type: 'foodSource'}
    }
}