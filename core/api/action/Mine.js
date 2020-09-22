import IAction from "./IACtion"

export default class Mine  extends IAction{
    constructor(unit, resource) {
        super()
        this.unit = unit
        this.resource = resource
    }
}