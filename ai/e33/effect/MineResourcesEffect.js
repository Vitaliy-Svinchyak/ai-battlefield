import IEffect from "./IEffect.js"
import CreateUnitNeed from "../need/CreateUnitNeed.js"
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
        return [new CreateUnitNeed(this.api, Peasant, 1)]
    }

    run() {
        const freePeasants = this.api.idleUnits.Peasant
        let actions = []

        if (this.neededResources.gold > 0 && this.neededResources.food > 0) {
            let firstPart = freePeasants.length / 2
            const foodPeasants = freePeasants.splice(0, firstPart)
            actions = [...this._createMineActions(foodPeasants, FoodSource), ...this._createMineActions(freePeasants, GoldSource)]
        } else {
            const resourcePoint = this.neededResources.gold > 0 ? GoldSource : FoodSource
            actions = this._createMineActions(freePeasants, resourcePoint)
        }

        return actions
    }

    /**
     * @param {Peasant[]} peasants
     * @param {typeof IResourceSource} resourcePoint
     * @return {IAction[]}
     * @private
     */
    _createMineActions(peasants, resourcePoint) {
        const actions = []

        for (const peasant of peasants) {
            const resourcesNearPeasant = this._getResourcesNearPeasant(peasant, (e) => e instanceof resourcePoint)
            const inventoryItem = peasant.inventory.length > 0 ? peasant.inventory[0] : null

            // TODO refactor new resourcePoint()
            if (inventoryItem === null || (inventoryItem instanceof new resourcePoint().itemType && !inventoryItem.isFull())) {
                if (resourcesNearPeasant.length > 0) {
                    actions.push(this.api.actions.mine(peasant, resourcesNearPeasant[0]))
                } else {
                    const pointToGo = this.api.getPathToNearestResourceForUnit(peasant, (e) => e instanceof resourcePoint)
                    if (pointToGo != null) {
                        actions.push(this.api.actions.move(peasant, pointToGo))
                    }
                }
            } else {
                const townHallsNearPeasant = this._getTownHallsNearPeasant(peasant)

                if (townHallsNearPeasant.length > 0) {
                    actions.push(this.api.actions.unload(peasant, townHallsNearPeasant[0]))
                } else {
                    const pointToGo = this.api.getPathToTheNearestTownHall(peasant)
                    if (pointToGo != null) {
                        actions.push(this.api.actions.move(peasant, pointToGo))
                    }
                }
            }
        }

        return actions
    }

    _getResourcesNearPeasant(peasant, check) {
        return this.api.getPointsNearPoint(peasant.position).filter(check)
    }

    _getTownHallsNearPeasant(peasant) {
        return this.api.getBuildings().townHall.filter(t => this.api.pathFinder.getDistanceSq(t.position, peasant.position) <= 2)
    }
}