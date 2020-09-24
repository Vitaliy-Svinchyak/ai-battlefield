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
     */
    perform(engine) {
        throw new Error('Implement perform method!')
    }
}