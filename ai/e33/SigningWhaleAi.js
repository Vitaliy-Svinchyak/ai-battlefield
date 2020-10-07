import AI from "../../core/api/external/AI.js"

export default class SigningWhaleAi extends AI {

    get color() {
        return [0, 88, 186]
    }

    tick(api) {
        // TODO prevent endless needs
        return []
    }
}