import AI from "../../core/api/external/AI.js"

export default class EmptyAi extends AI {
    tick() {
        return []
    }

    get color() {
        return [133, 44, 157]
    }
}