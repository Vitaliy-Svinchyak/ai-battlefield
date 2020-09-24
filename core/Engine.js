"use strict"

import Painter from "./Painter.js"
import Api from "./api/Api.js"
import ExampleAi from "../example/ExampleAi.js"
import EmptyAi from "../example/EmptyAi.js"
import UnitActionRegistry from "./api/UnitActionRegistry.js"
import Field from "./Field.js"

export default class Engine {

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field

        this.painter = new Painter(document.querySelector('#canvas-field'), this.field.size)
        this.draw([])
    }

    start() {
        const api = new Api(this.field)
        const ai1 = new ExampleAi()
        const ai2 = new EmptyAi()

        setInterval(() => {
            UnitActionRegistry.clear()
            let changes
            const actions1 = ai1.tick(api.team(1))
            changes = this.performActions(actions1, api)

            const actions2 = ai2.tick(api.team(2))
            changes = [...changes, ...this.performActions(actions2, api)]
            api.recalculateExploredMap()

            this.draw(api, changes)
        }, 1000)
    }

    draw(api, changes) {
        let field
        switch (window.selectedTeamToView) {
            case 0:
                field = this.field
                break
            case 1:
                field = new Field(api.getMap(1))
                break
            case 2:
                field = new Field(api.getMap(2))
                break
        }

        this.painter.draw(this.field.size, field, changes)
    }

    /**
     * @param {IAction[]} actions
     * @param {Api} api
     * @return {Point[]}
     */
    performActions(actions, api) {
        let changes = []

        for (const action of actions) {
            if (action.validate(api)) {
                changes = [...changes, ...action.perform(this)]
            }
        }

        return changes
    }
}