"use strict"

import Painter from "./Painter.js"
import Api from "./api/Api.js"
import ExampleAi from "../example/ExampleAi.js"

export default class Engine {

    /**
     * @param {Field} field
     */
    constructor(field) {
        this.field = field

        this.painter = new Painter(document.querySelector('#canvas-field'), this.field.size)
        this.draw()
    }

    start() {
        const api = new Api(this.field)
        const ai1 = new ExampleAi()
        const ai2 = new ExampleAi()

        setInterval(() => {
            const actions1 = ai1.tick(api.team(1))
            this.performActions(actions1, api)

            const actions2 = ai2.tick(api.team(2))
            this.performActions(actions2, api)
            console.log('tick')
        }, 1000)
    }

    draw() {
        this.painter.draw(this.field.size, this.field)
    }

    /**
     * @param {IAction[]} actions
     * @param {Api} api
     */
    performActions(actions, api) {
        for (const action of actions) {
            if (action.validate(api)) {
                action.perform(this)
            }
        }
    }
}