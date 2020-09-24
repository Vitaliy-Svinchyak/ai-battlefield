let i = 0
export default class ExampleAi {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        const units = api.getUnits()
        const buildings = api.getBuilding()
        const unit = units[0]
        const mine = api.mine(unit, api.getResourcePoints()[0])
        const unload = api.unload(unit, buildings[0])
        const actions = [api.move(unit, 3, 4), mine, mine, mine, api.move(unit, 3, 3), unload]

        if (i > actions.length - 1) {
            i = 0
        }

        const currentAction = actions[i]
        i++
        return [currentAction]
    }
}