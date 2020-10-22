import IBucket from "../IBucket.js"
import WarBucket from "../WarBucket.js"

export default class AttackBucket extends IBucket {
    constructor() {
        super(0.05, new WarBucket())
    }
}