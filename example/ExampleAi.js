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
        const mineFood = api.mine(unitForFood, api.getResourcePoints()[0])
        const mineGold = api.mine(unitForGold, api.getResourcePoints()[2])
        const unloadFood = api.unload(unitForFood, buildings[0])
        const unloadGold = api.unload(unitForGold, buildings[0])
        const actionsFood = [api.move(unitForFood, 3, 4), mineFood, mineFood, mineFood, api.move(unitForFood, 3, 3), unloadFood]

        const actionsGold = [api.move(unitForGold, 2, 1), api.move(unitForGold, 3, 1), api.move(unitForGold, 4, 1),
            mineGold, mineGold, mineGold, api.move(unitForGold, 3, 1), unloadGold]

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

        return [actionFood, actionGold]
    }
}