import IBucket from "../IBucket.js"
import EconomyBucket from "../EconomyBucket"

export default class ResourcesBucket extends IBucket {
    constructor() {
        super(0.2, new EconomyBucket())
    }
}