"use strict"

import Painter from "./painter.js"

export default class Field {

    constructor(field) {
        this.fieldMap = field

        this.detectFieldSize()
        this.painter = new Painter(document.querySelector('#canvas-field'), this)
        this.draw()
    }

    draw() {
        this.painter.draw()
    }

    detectFieldSize() {
        this.fieldSize = {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        }
    }
}