import IBucket from "../IBucket.js"
import WarBucket from "../WarBucket.js"

export default class WarRecruitingBucket extends IBucket {
    constructor() {
        super(0.1, new WarBucket())
    }
}