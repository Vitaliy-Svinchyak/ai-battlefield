import Empty from "../core/entity/Empty.js"
import Point from "../core/Point.js"
import AI from "../core/api/external/AI.js"

let foodI = 0
let goldI = 0

export default class ExampleAi extends AI {
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

        const additionalActions = []

        if (units.length > 2) {
            const map = api.getMap()
            for (let i = 2; i < units.length; i++) {
                const unit = units[i]

                const positions = [
                    new Point(unit.position.y - 1, unit.position.x - 1),
                    new Point(unit.position.y - 1, unit.position.x),
                    new Point(unit.position.y - 1, unit.position.x + 1),

                    new Point(unit.position.y, unit.position.x + 1),
                    new Point(unit.position.y, unit.position.x - 1),


                    new Point(unit.position.y + 1, unit.position.x - 1),
                    new Point(unit.position.y + 1, unit.position.x),
                    new Point(unit.position.y + 1, unit.position.x + 1),
                ].sort(() => Math.random() - 0.5)
                for (const pos of positions) {
                    if (map.get(pos.y).get(pos.x) instanceof Empty) {
                        additionalActions.push(api.actions.move(unit, pos.y, pos.x))
                        break
                    }
                }
            }
        }

        if (api.getResources().enough(api.units.warrior.price)
            && api.getPopulation() + api.units.warrior.livingPlace <= api.maximumPopulation) {
            return [actionFood, actionGold, api.actions.createUnit(api.units.warrior), ...additionalActions]
        }

        return [actionFood, actionGold, ...additionalActions]
    }


    get color() {
        return [55, 150, 30]
    }
}