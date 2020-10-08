export default class ProxyActionsBuilder {
    /**
     * @param {ActionsBuilder} actionsBuilder
     * @param {UnitsManager} unitsManager
     * @param {PathFinder} pathFinder
     */
    constructor(actionsBuilder, unitsManager, pathFinder) {
        this.actionsBuilder = actionsBuilder
        this.unitsManager = unitsManager
        this.pathFinder = pathFinder
    }

    /**
     * @param {IMovable} unit
     * @param {Point} point
     * @return {MoveUnit}
     */
    move(unit, point) {
        this.unitsManager.book(unit)
        this.pathFinder.book(point)
        return this.actionsBuilder.move(unit, point)
    }

    /**
     * @param {IMovable} unit
     * @param {IResourceSource} resource
     * @return {Mine}
     */
    mine(unit, resource) {
        this.unitsManager.book(unit)
        return this.actionsBuilder.mine(unit, resource)
    }

    /**
     * @param {IMovable} unit
     * @param {IBuilding} building
     * @return {UnloadResources}
     */
    unload(unit, building) {
        this.unitsManager.book(unit)
        return this.actionsBuilder.unload(unit, building)
    }

    /**
     * @param {IMovable} unit
     */
    createUnit(unit) {
        return this.actionsBuilder.createUnit(unit)
    }

    /**
     * @param {IMovable} unit
     * @param {IMovable|IBuilding} target
     */
    attack(unit, target) {
        this.unitsManager.book(unit)
        return this.actionsBuilder.attack(unit, target)
    }
}