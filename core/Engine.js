"use strict"

import Painter from "./Painter.js"
import Api from "./api/Api.js"
import ExampleAi from "../example/ExampleAi.js"
import EmptyAi from "../example/EmptyAi.js"
import UnitActionRegistry from "./api/UnitActionRegistry.js"
import Field from "./Field.js"
import IAction from "./api/action/IACtion.js"

export default class Engine {

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field
        this.api = new Api(this.field)

        this.painter = new Painter(document.querySelector('#canvas-field'), this.field.size)
    }

    onReady(callback) {
        this.painter.onReady(this.getCurrentFieldMap(), callback)
    }

    start() {
        const ai1 = new ExampleAi()
        const ai2 = new EmptyAi()

        setInterval(() => {
            UnitActionRegistry.clear()
            const actions1 = ai1.tick(this.api.team(1))
            this.performActions(actions1)

            const actions2 = ai2.tick(this.api.team(2))
            this.performActions(actions2)
            this.api.recalculateExploredMap()

            this.draw()
        }, 1000)
    }

    draw() {
        this.painter.draw(this.field.size, this.getCurrentFieldMap())
    }

    getCurrentFieldMap() {
        switch (window.selectedTeamToView) {
            case 0:
                return this.field
            case 1:
                return new Field(this.api.getMap(1))
            case 2:
                return new Field(this.api.getMap(2))
        }
    }

    /**
     * @param {IAction[]} actions
     */
    performActions(actions) {
        for (const action of actions) {
            if (!(action instanceof IAction)) {
                console.error(action, ' not an action!')
            }

            if (action instanceof IAction && action.validate(this.api)) {
                action.perform(this)
            }
        }
    }
}