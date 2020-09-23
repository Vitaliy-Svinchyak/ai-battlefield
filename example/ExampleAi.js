export default class ExampleAi {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        const units = api.getUnits()
        const unit = units[0]
        const move = api.move(unit, unit.position.y + 1, unit.position.x + 1)

        return [move]
    }
}