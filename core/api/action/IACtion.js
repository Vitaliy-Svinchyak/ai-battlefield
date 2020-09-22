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
     * @return boolean
     */
    perform(engine) {
        throw new Error('Implement perform method!')
    }
}