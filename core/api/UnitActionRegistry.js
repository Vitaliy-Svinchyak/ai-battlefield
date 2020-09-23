export default class UnitActionRegistry {
    static registry = {}

    static clear() {
        UnitActionRegistry.registry = {}
    }

    static didAction(id) {
        return UnitActionRegistry.registry[id] !== undefined
    }

    static addAction(id) {
        UnitActionRegistry.registry[id] = true
    }
}