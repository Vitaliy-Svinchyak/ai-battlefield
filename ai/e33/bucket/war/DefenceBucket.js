import IBucket from "../IBucket.js"
import WarBucket from "../WarBucket.js"

export default class DefenceBucket extends IBucket {
    constructor() {
        super(0.4, new WarBucket())
    }
}