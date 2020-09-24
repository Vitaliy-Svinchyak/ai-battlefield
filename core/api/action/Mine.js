import IAction from "./IACtion.js"

export default class Mine extends IAction {
    /**
     * @param {IMovable} unit
     * @param {IResource} resource
     */
    constructor(unit, resource) {
        super()
        this.unit = unit
        this.resource = resource
    }
}