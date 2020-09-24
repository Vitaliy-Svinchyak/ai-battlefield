let i = 0
export default class ExampleAi {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        // console.log(api.getResourcePoints())
        return []
        const units = api.getUnits()
        const unit = units[0]
        const move = api.move(unit, unit.position.y, unit.position.x + 1)
        const actions = [api.move(unit, 3, 4)]

        if(i > actions.length){
            return []
        }

        const currentAction = actions[i]
        i++
        return [currentAction]
    }
}