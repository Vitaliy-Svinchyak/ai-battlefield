import IEntity from "../IEntity.js"

export default class IResourceSource extends IEntity {

    /**
     * @return {IItem}
     */
    get item() {
        throw new Error('Implement item method!')
    }
}