let foodI = 0
let goldI = 0

export default class ExampleAi {
    /**
     * @param {TeamApi} api
     * @return {IAction[]}
     */
    tick(api) {
        const units = api.getUnits()
        const buildings = api.getBuilding()
        const unitForFood = units[0]
        const unitForGold = units[1]
        const mineFood = api.actions.mine(unitForFood, api.getResourcePoints()[0])
        const mineGold = api.actions.mine(unitForGold, api.getResourcePoints()[2])
        const unloadFood = api.actions.unload(unitForFood, buildings[0])
        const unloadGold = api.actions.unload(unitForGold, buildings[0])
        const actionsFood = [api.actions.move(unitForFood, 3, 4), mineFood, mineFood, mineFood, api.actions.move(unitForFood, 3, 3), unloadFood]

        const actionsGold = [api.actions.move(unitForGold, 2, 1), api.actions.move(unitForGold, 3, 1), api.actions.move(unitForGold, 4, 1),
            mineGold, mineGold, mineGold, api.actions.move(unitForGold, 3, 1), unloadGold]

        const actionFood = actionsFood[foodI]
        const actionGold = actionsGold[goldI]
        foodI++
        goldI++

        if (foodI > actionsFood.length - 1) {
            foodI = 0
        }
        if (goldI > actionsGold.length - 1) {
            goldI = 2
        }

        if (api.getResources().enough(api.units.peasant.price)
            && api.getPopulation() + api.units.peasant.livingPlace <= api.maximumPopulation) {
            return [actionFood, actionGold, api.actions.createUnit(api.units.peasant)]
        }

        return [actionFood, actionGold]
    }
}