export default class ExampleAi {
    /**
     * @param {TeamApi} api
     */
    tick(api) {
        const units = api.getUnits()
        const y = units[0].position.y
        const move = api.move(units[0], y === 1 ? 2 : 1, units[0].position.x)

        return [move]
    }
}