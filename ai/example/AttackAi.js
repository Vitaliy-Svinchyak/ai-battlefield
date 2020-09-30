import AI from "../../core/api/external/AI.js"

export default class AttackAi extends AI {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        const units = api.getUnits()

        return [
            api.actions.attack(units[0], api.getMap().get(2).get(2)),
            api.actions.attack(units[1], api.getMap().get(2).get(2)),
        ]
    }

    get color() {
        return [55, 150, 30]
    }
}