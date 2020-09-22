"use strict"

import Painter from "./Painter.js"

export default class Engine {

    constructor(field) {
        this.fieldMap = field

        this.detectFieldSize()
        this.painter = new Painter(document.querySelector('#canvas-field'), this.fieldSize)
        this.draw()
    }

    draw() {
        this.painter.draw(this.fieldSize, this.fieldMap)
    }

    detectFieldSize() {
        this.fieldSize = {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        }
    }
}