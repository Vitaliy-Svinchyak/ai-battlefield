import IEntity from "../IEntity.js"
import FoodItem from "../item/FoodItem.js"

export default class IResourceSource extends IEntity {

    /**
     * @return {IItem}
     */
    get item() {
        throw new Error('Implement item method!')
    }

    /**
     * @return {typeof IItem}
     */
    get itemType() {
        return this.item.constructor
    }

    get isSolid() {
        return true
    }
}