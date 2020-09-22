import IAction from "./IACtion"

export default class HitTarget  extends IAction{
    constructor(unit, target) {
        super()
        this.unit = unit
        this.target = target
    }
}