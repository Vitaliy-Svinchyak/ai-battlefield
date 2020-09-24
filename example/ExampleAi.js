let i = 0
export default class ExampleAi {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        const units = api.getUnits()
        const unit = units[0]
        const actions = [api.move(unit, 3, 4), api.mine(unit, api.getResourcePoints())]

        if (i > actions.length - 1) {
            return []
        }

        const currentAction = actions[i]
        i++
        return [currentAction]
    }
}