import IResourceSource from "./IResourceSource.js"
import GoldItem from "../item/GoldItem.js"

const image = new Image()
image.src = 'images/gold.png'

export default class GoldSource extends IResourceSource {
    image = image

    get item() {
        return new GoldItem()
    }
}