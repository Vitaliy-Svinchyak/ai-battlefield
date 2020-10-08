import AI from "../../core/api/external/AI.js"
import BuildEconomyNeed from "./need/BuildEconomyNeed.js"
import ProxyApi from "./api/ProxyApi.js"

export default class SigningWhaleAi extends AI {

    get color() {
        return [0, 88, 186]
    }

    tick(api) {
        const proxyApi = new ProxyApi(api)
        const needs = this._getNeeds(proxyApi)
        const effects = this._getRootEffects(needs)
        // console.log(effects)

        return this._getActions(effects)
    }

    /**
     * @param {ProxyApi} api
     * @return {INeed[]}
     * @private
     */
    _getNeeds(api) {
        return [
            new BuildEconomyNeed(api),
            // new DefeatEnemyNeed(api)
        ]
    }

    /**
     * @param {INeed[]} needs
     * @return {IEffect[]}
     * @private
     */
    _getRootEffects(needs) {
        // TODO prevent endless needs
        needs = needs.sort((a, b) => b.getWeight() - a.getWeight())
        let effectsToReturn = []

        for (const need of needs) {
            if (need.isSatisfied()) {
                const effects = need.getEffects()

                for (const effect of effects) {
                    if (effect.canRun()) {
                        effectsToReturn.push(effect)
                    } else {
                        effectsToReturn = [...effectsToReturn, ...this._getRootEffects(effect.getNeeds())]
                    }
                }
            } else {
                const effects = need.getEffectsToSatisfy()

                for (const effect of effects) {
                    if (effect.canRun()) {
                        effectsToReturn.push(effect)
                    } else {
                        effectsToReturn = [...effectsToReturn, ...this._getRootEffects(effect.getNeeds())]
                    }
                }
            }
        }

        return effectsToReturn
    }

    /**
     * @param {IEffect[]} effects
     * @return {IAction[]}
     * @private
     */
    _getActions(effects) {
        let actions = []

        for (const effect of effects) {
            actions = [...actions, ...effect.run()]
        }

        return actions
    }
}