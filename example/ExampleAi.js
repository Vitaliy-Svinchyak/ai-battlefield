export default class ExampleAi {
    /**
     * @param {TeamApi} api
     */
    tick(api) {
        console.log(api.getUnits())
        console.log(api.getResources())
        return []
    }
}