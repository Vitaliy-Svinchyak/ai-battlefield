export default class AttackAi {
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
}