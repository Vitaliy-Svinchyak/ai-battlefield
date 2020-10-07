import IBucket from "../IBucket.js"
import EconomyBucket from "../EconomyBucket.js"

export default class EconomyRecruitingBucket extends IBucket {
    constructor() {
        super(0.1, new EconomyBucket())
    }
}