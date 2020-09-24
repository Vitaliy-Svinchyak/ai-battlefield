"use strict"

import Peasant from "./entity/unit/Peasant.js"
import Rock from "./entity/solid/Rock.js"
import Tree from "./entity/solid/Tree.js"
import TownHall from "./entity/building/TownHall.js"
import Gold from "./entity/resource/Gold.js"
import Food from "./entity/resource/Food.js"
import Unexplored from "./entity/Unexplored.js"

export default class Painter {

    constructor(canvas, fieldSize) {
        this.canvas = canvas
        this.pointSize = this.calculatePointSize(fieldSize)
        this.fieldSize = fieldSize
        this.fieldReady = false
        this.setCanvasSize(fieldSize)
    }

    preLoadImages(arr, callback) {
        const images = {}
        let loadedImageCount = 0

        for (let i = 0; i < arr.length; i++) {
            const img = arr[i]
            img.onload = imageLoaded
            images[arr[i]] = img
        }

        function imageLoaded() {
            loadedImageCount++
            if (loadedImageCount >= arr.length) {
                callback()
            }
        }
    }

    draw(fieldSize, fieldMap, redraws) {
        if (!this.fieldReady) {
            this.preLoadImages(
                [new Peasant().image, new Tree().image, new Rock().image, new TownHall().image, new Food().image, new Gold().image, new Unexplored().image],
                () => {
                    this.drawCanvasField(fieldSize, fieldMap)
                })
            return
        }

        for (const point of redraws) {
            const formYDraw = this.defaultY + (point.y * this.pointSize.y) + point.y
            const formXDraw = this.defaultX + (point.x * this.pointSize.x) + point.x
            this.drawImage(fieldMap.getImage(point.y, point.x), formXDraw, formYDraw)
        }

        if (window.fullRedraw) {
            window.fullRedraw = false

            for (let y = 0; y < this.fieldSize.rows; y++) {
                for (let x = 0; x < this.fieldSize.cells; x++) {
                    const formYDraw = this.defaultY + (y * this.pointSize.y) + y
                    const formXDraw = this.defaultX + (x * this.pointSize.x) + x
                    this.clearRect(formXDraw, formYDraw)
                    this.drawImage(fieldMap.getImage(y, x), formXDraw, formYDraw)
                }
            }
        }

    }

    drawCanvasField(fieldSize, fieldMap) {
        this.fieldReady = true
        this.context = this.canvas.getContext("2d")

        if (this.canvas.width > window.innerWidth || this.canvas.height > window.innerHeight) {
            this.defaultY = 0
            this.defaultX = 0
        } else {
            this.defaultY = Math.floor((window.innerHeight - ((this.pointSize.y + 1) * fieldSize.rows)) / 2)
            this.defaultX = Math.floor((window.innerWidth - ((this.pointSize.x + 1) * fieldSize.cells)) / 2)
            this.defaultY = 0
            // this.defaultX = 0
        }

        let yDraw = this.defaultY

        for (let y = 0; y < fieldSize.rows; y++) {
            let xDraw = this.defaultX

            for (let x = 0; x < fieldSize.cells; x++) {
                this.drawImage(fieldMap.getImage(y, x), xDraw, yDraw)
                xDraw += this.pointSize.x + this.pointSize.margin
            }
            yDraw += this.pointSize.y + this.pointSize.margin
        }
    }

    drawImage(image, xDraw, yDraw) {
        if (image.src === '') {
            return this.clearRect(xDraw, yDraw)
        }
        this.context.drawImage(image, xDraw, yDraw, this.pointSize.x, this.pointSize.y)
    }

    clearRect(xDraw, yDraw) {
        this.context.clearRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y)
    }

    calculatePointSize(fieldSize) {
        let xSize = Math.floor((window.innerHeight - fieldSize.cells) / (fieldSize.cells + 1))
        let ySize = Math.floor((window.innerWidth - fieldSize.rows) / (fieldSize.rows + 1))

        let size = ySize > xSize ? xSize : ySize
        if (size < 8) {
            size = 8
        }
        if (size > 32) {
            size = 32
        }

        return {y: size, x: size, margin: 1}
    }

    setCanvasSize(fieldSize) {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

        let height = (this.pointSize.y + 1) * fieldSize.rows
        let width = (this.pointSize.x + 1) * fieldSize.cells

        if (height < h && width < w) {
            height = h
            width = w
            document.body.style.overflow = 'hidden'
        }

        this.canvas.height = height
        this.canvas.width = width
    }
}