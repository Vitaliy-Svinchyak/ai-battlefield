export default class IAction {
    /**
     * @param {Api} api
     * @return boolean
     */
    validate(api) {
        throw new Error('Implement validate method!')
    }

    /**
     * @param {Engine} engine
     * @return {Point[]}
     */
    perform(engine) {
        throw new Error('Implement perform method!')
    }
}