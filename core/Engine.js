"use strict"

import Painter from "./Painter.js"
import Api from "./api/Api.js"
import UnitActionRegistry from "./api/UnitActionRegistry.js"
import Field from "./Field.js"
import IAction from "./api/action/IAction.js"

export default class Engine {

    /**
     * @param {Field} field
     * @param colorSettings
     */
    constructor(field, colorSettings) {
        this.tickNumber = 0
        this.field = field
        this.api = new Api(this.field)

        this.painter = new Painter(document.querySelector('#canvas-field'), this.field.size, colorSettings)
    }

    onReady(callback) {
        this.painter.onReady(this.getCurrentFieldMap(), callback)
    }

    start(ai1, ai2) {
        this.tick(ai1, ai2)
    }

    tick(ai1, ai2) {
        UnitActionRegistry.clear()
        const actions1 = ai1.tick(this.api.team(1))
        this.performActions(actions1)

        const actions2 = ai2.tick(this.api.team(2))
        this.performActions(actions2)

        this.api.tick()
        this.tickNumber++
        this.draw()
        setTimeout(() => {
            this.tick(ai1, ai2)
        }, window.gameSettings.gameSpeed)
    }

    draw() {
        this.painter.draw(this.field.size, this.getCurrentFieldMap())
        this.painter.drawInfo(this.api, this.tickNumber)
        this.painter.drawScore(this.api)
    }

    getCurrentFieldMap() {
        switch (window.gameSettings.selectedTeamToView) {
            case 0:
                return this.field
            case 1:
                return new Field(this.api.getMap(1), this.api.getVisibleMap(1))
            case 2:
                return new Field(this.api.getMap(2), this.api.getVisibleMap(2))
        }
    }

    /**
     * @param {IAction[]} actions
     */
    performActions(actions) {
        for (const action of actions) {
            if (action instanceof IAction && action.validate(this.api)) {
                action.perform(this)
            } else {
                // console.log(effect, ' invalid effect!')
                // throw 'her'
            }
        }
    }
}