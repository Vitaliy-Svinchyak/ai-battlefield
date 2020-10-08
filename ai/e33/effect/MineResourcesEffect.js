import IEffect from "./IEffect.js"
import UnitNeed from "../need/UnitNeed.js"
import Peasant from "../../../core/entity/unit/Peasant.js"
import GoldSource from "../../../core/entity/resource/GoldSource.js"
import FoodSource from "../../../core/entity/resource/FoodSource.js"

export default class MineResourcesEffect extends IEffect {
    /**
     * @param {ProxyApi} api
     * @param {Resources} resources
     */
    constructor(api, resources) {
        super(api)
        this.neededResources = resources
    }

    canRun() {
        return this.api.idleUnits.Peasant.length > 0
    }

    getNeeds() {
        return [new UnitNeed(this.api, Peasant, 1)]
    }

    run() {
        const freePeasants = this.api.idleUnits.Peasant
        const actions = []

        if (this.neededResources.gold > 0 && this.neededResources.food > 0) {
            // TODO
        } else {
            const resourcePoint = this.neededResources.gold > 0 ? GoldSource : FoodSource

            for (const peasant of freePeasants) {
                const resourcesNearPeasant = this._getResourcesNearPeasant(peasant, (e) => e instanceof resourcePoint)
                const inventoryItem = peasant.inventory.length > 0 ? peasant.inventory[0] : null

                // TODO refactor new resourcePoint()
                if (inventoryItem === null || (inventoryItem instanceof new resourcePoint().itemType && !inventoryItem.isFull())) {
                    if (resourcesNearPeasant.length > 0) {
                        actions.push(this.api.actions.mine(peasant, resourcesNearPeasant[0]))
                    } else {
                        const pointToGo = this.api.getPathToNearestResourceForUnit(peasant, (e) => e instanceof resourcePoint)
                        actions.push(this.api.actions.move(peasant, pointToGo))
                    }
                } else {
                    const townHallsNearPeasant = this._getTownHallsNearPeasant(peasant)

                    if (townHallsNearPeasant.length > 0) {
                        actions.push(this.api.actions.unload(peasant, townHallsNearPeasant[0]))
                    } else {
                        const pointToGo = this.api.getPathToTheNearestTownHall(peasant)
                        actions.push(this.api.actions.move(peasant, pointToGo))
                    }
                }
            }
        }

        return actions
    }

    isFinished() {
        return this.api.getResources().biggerThan(this.neededResources)
    }

    _getResourcesNearPeasant(peasant, check) {
        return this._getPointsNearPeasant(peasant).filter(check)
    }

    _getTownHallsNearPeasant(peasant) {
        return this.api.getBuildings().townHall.filter(t => this.api.pathFinder.getDistanceSq(t.position, peasant.position) <= 2)
    }

    _getPointsNearPeasant(peasant) {
        const p = peasant.position
        const map = this.api.getMap()

        return [
            map.get(p.y).get(p.x - 1),
            map.get(p.y).get(p.x + 1),
            map.get(p.y - 1).get(p.x + 1),
            map.get(p.y + 1).get(p.x + 1),
            map.get(p.y + 1).get(p.x - 1),
            map.get(p.y - 1).get(p.x - 1),
            map.get(p.y + 1).get(p.x),
            map.get(p.y - 1).get(p.x),
        ]
    }
}