import IAction from "./IACtion"

export default class CreateUnit extends IAction {
    constructor(unit) {
        super()
        this.unit = unit
    }
}