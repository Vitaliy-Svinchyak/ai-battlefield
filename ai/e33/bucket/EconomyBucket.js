import IBucket from "./IBucket.js"

export default class EconomyBucket extends IBucket {
    constructor() {
        super(0.5)
    }
}