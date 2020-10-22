import IItem from "./IItem.js"

export default class IItemResource extends IItem {
    isFull() {
        return this.amount === 10
    }
}