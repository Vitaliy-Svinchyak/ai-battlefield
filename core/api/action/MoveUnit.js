import IAction from "./IACtion"

export default class MoveUnit  extends IAction{
    constructor(unit, position) {
        super()
        this.unit = unit
        this.position = position
    }
}