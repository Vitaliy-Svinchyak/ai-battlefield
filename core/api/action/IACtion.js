export default class IAction {
    /**
     * @param {Api} api
     * @return boolean
     */
    validate(api) {
        throw new Error('Implement validate method!')
    }
}