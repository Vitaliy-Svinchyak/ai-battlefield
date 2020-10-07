import Empty from "../../core/entity/Empty.js"
import Point from "../../core/Point.js"
import AI from "../../core/api/external/AI.js"

let foodI = 0
let goldI = 0

export default class ExampleAi extends AI {
    /**
     * @param {TeamApi} api
     * @return {IEffect[]}
     */
    tick(api) {
        const units = api.getUnits().Peasant
        const warriors = api.getUnits().Warrior
        const buildings = api.getBuildings().townHall
        const unitForFood = units[0]
        const unitForGold = units[1]
        const mineFood = api.actions.mine(unitForFood, api.getResourcePoints()[0])
        const mineGold = api.actions.mine(unitForGold, api.getResourcePoints()[2])
        const unloadFood = api.actions.unload(unitForFood, buildings[0])
        const unloadGold = api.actions.unload(unitForGold, buildings[0])
        const actionsFood = [api.actions.move(unitForFood, new Point(3, 4)), mineFood, mineFood, mineFood, api.actions.move(unitForFood, new Point(3, 3)), unloadFood]

        const actionsGold = [api.actions.move(unitForGold, new Point(2, 1)), api.actions.move(unitForGold, new Point(3, 1)), api.actions.move(unitForGold, new Point(4, 1)),
            mineGold, mineGold, mineGold, api.actions.move(unitForGold, new Point(3, 1)), unloadGold]

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

        if (warriors.length > 0) {
            const map = api.getMap()
            for (let i = 0; i < warriors.length; i++) {
                const unit = warriors[i]

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
                        additionalActions.push(api.actions.move(unit, new Point(pos.y, pos.x)))
                        break
                    }
                }
            }
        }

        if (api.getResources().biggerThan(api.units.Warrior.price)
            && api.getPopulation() + api.units.Warrior.livingPlace <= api.maximumPopulation) {
            return [actionFood, actionGold, api.actions.createUnit(api.units.Warrior), ...additionalActions]
        }

        return [actionFood, actionGold, ...additionalActions]
    }


    get color() {
        return [55, 150, 30]
    }
}