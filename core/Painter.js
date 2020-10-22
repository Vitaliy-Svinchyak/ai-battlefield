"use strict"

import Peasant from "./entity/unit/Peasant.js"
import Rock from "./entity/solid/Rock.js"
import Tree from "./entity/solid/Tree.js"
import TownHall from "./entity/building/TownHall.js"
import GoldSource from "./entity/resource/GoldSource.js"
import FoodSource from "./entity/resource/FoodSource.js"
import Unexplored from "./entity/Unexplored.js"
import IMovable from "./entity/unit/IMovable.js"
import IBuilding from "./entity/building/IBuilding.js"
import Warrior from "./entity/unit/Warrior.js"
import Field from "./Field.js"
import MoveUnit from "./api/action/MoveUnit.js"

export default class Painter {

    constructor(canvas, fieldSize, colorSettings) {
        this.canvas = canvas
        this.colorSettings = colorSettings
        this.pointSize = this.calculatePointSize(fieldSize)
        this.fieldSize = fieldSize
        this.setCanvasSize(fieldSize)
    }

    onReady(fieldMap, callback) {
        this.preLoadImages(
            [
                new Peasant().image,
                new Warrior().image,
                new Tree().image,
                new Rock().image,
                new TownHall().image,
                new FoodSource().image,
                new GoldSource().image,
                new Unexplored().image
            ],
            () => {
                this.previousFieldMap = this.cloneMap(fieldMap)
                this.drawCanvasField(this.fieldSize, fieldMap)
                callback()
            }
        )
    }

    preLoadImages(arr, callback) {
        let loadedImageCount = 0

        for (let i = 0; i < arr.length; i++) {
            const img = arr[i]
            if (img.onload !== null) {
                loadedImageCount++
            } else {
                img.onload = imageLoaded
            }
        }

        function imageLoaded() {
            loadedImageCount++
            if (loadedImageCount >= arr.length) {
                callback()
            }
        }
    }

    /**
     * @param fieldSize
     * @param {Field} fieldMap
     * @param {IAction[]} performedActions
     */
    draw(fieldSize, fieldMap, performedActions) {
        const entitiesToAnimate = []
        for (const action of performedActions) {
            if (action instanceof MoveUnit) {
                entitiesToAnimate.push(action.unit)
            }
        }

        const gameSpeed = window.gameSettings.gameSpeed
        const maxFrames = 10
        const minFrameTime = 16
        let frames = Math.round(gameSpeed / minFrameTime)

        if (frames > maxFrames) {
            frames = maxFrames
        }

        let frameTime = Math.floor(gameSpeed / frames)
        console.log(frames, frameTime)

        for (let y = 0; y < this.fieldSize.rows; y++) {
            for (let x = 0; x < this.fieldSize.cells; x++) {
                if (this.sthHasChanged(y, x, fieldMap)) {
                    const entity = fieldMap.getObject(y, x)
                    const drawFog = !fieldMap.isVisible(y, x)

                    if (entitiesToAnimate.filter(e => e === entity).length === 0) {
                        this.drawEntity(entity, x, y, drawFog)
                    }
                }
            }
        }

        let frame = 0
        const interval = setInterval(() => {
            frame++

            for (const action of performedActions) {
                if (action instanceof MoveUnit) {
                    const entity = action.unit
                    this.animateEntityMove(
                        entity,
                        fieldMap,
                        action.oldPosition,
                        action.newPosition,
                        frame,
                        frames
                    )
                }
            }

            if (frame === frames) {
                clearInterval(interval)
            }
        }, frameTime)

        this.previousFieldMap = this.cloneMap(fieldMap)
    }

    /**
     * @param {Api} api
     * @param {int} tickNumber
     */
    drawInfo(api, tickNumber) {
        const resources = api.resources
        const maxPopulation = api.maximumPopulation
        const spaceSymbol = '⠀'

        const gold1 = resources[1].gold.toString()
        const food1 = resources[1].food.toString()
        const population1 = api.getPopulation(1)
        document.querySelector('#resources-1 .food').innerText = food1 + spaceSymbol.repeat(4 - food1.length)
        document.querySelector('#resources-1 .gold').innerText = gold1 + spaceSymbol.repeat(4 - gold1.length)
        document.querySelector('#resources-1 .population').innerText = population1 + ' / ' + maxPopulation

        const gold2 = resources[2].gold.toString()
        const food2 = resources[2].food.toString()
        const population2 = api.getPopulation(2)
        document.querySelector('#resources-2 .food').innerText = food2 + spaceSymbol.repeat(4 - food2.length)
        document.querySelector('#resources-2 .gold').innerText = gold2 + spaceSymbol.repeat(4 - gold2.length)
        document.querySelector('#resources-2 .population').innerText = population2 + ' / ' + maxPopulation

        document.getElementById('tick').innerText = tickNumber

        const production1 = api.getProductionStats(1)
        const production2 = api.getProductionStats(2)
        this._drawProduction(production1, 1)
        this._drawProduction(production2, 2)
    }

    _drawProduction(production, team) {
        if (production.Peasant > 0) {
            document.querySelector(`#production${team} .peasant`).innerText = production.Peasant
            document.querySelector(`#production${team} .peasant`).style.display = ''
        } else {
            document.querySelector(`#production${team} .peasant`).style.display = 'none'
        }

        if (production.Warrior > 0) {
            document.querySelector(`#production${team} .warrior`).innerText = production.Warrior
            document.querySelector(`#production${team} .warrior`).style.display = ''
        } else {
            document.querySelector(`#production${team} .warrior`).style.display = 'none'
        }
    }

    /**
     * @param {Api} api
     */
    drawScore(api) {
        let score1 = 0
        score1 += api.getOwnBuildings(1).townHall.length * 2
        score1 += api.getOwnUnits(1).Peasant.length
        score1 += api.getOwnUnits(1).Warrior.length * 2
        let score2 = 0
        score2 += api.getOwnBuildings(2).townHall.length * 2
        score2 += api.getOwnUnits(2).Peasant.length
        score2 += api.getOwnUnits(2).Warrior.length * 2
        document.getElementById('score-1').innerText = score1.toString()
        document.getElementById('score-2').innerText = score2.toString()
    }

    drawCanvasField(fieldSize, fieldMap) {
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
                this.drawEntity(fieldMap.getObject(y, x), x, y, false)
                xDraw += this.pointSize.x + this.pointSize.margin
            }
            yDraw += this.pointSize.y + this.pointSize.margin
        }
    }

    /**
     * @param entity
     * @param {Field} fieldMap
     * @param oldPosition
     * @param newPosition
     * @param frame
     * @param frames
     */
    animateEntityMove(entity, fieldMap, oldPosition, newPosition, frame, frames) {
        const yMovePerFrame = (newPosition.y - oldPosition.y) / frames
        const xMovePerFrame = (newPosition.x - oldPosition.x) / frames

        const currentY = oldPosition.y + (yMovePerFrame * (frame))
        const currentX = oldPosition.x + (xMovePerFrame * (frame))

        const prevStepY = oldPosition.y + (yMovePerFrame * (frame - 1))
        const prevStepX = oldPosition.x + (xMovePerFrame * (frame - 1))

        this.clearRect(prevStepX, prevStepY)
        const prevStepY2 = oldPosition.y + (yMovePerFrame * (frame - 2))
        const prevStepX2 = oldPosition.x + (xMovePerFrame * (frame - 2))

        this.clearRect(prevStepX2, prevStepY2)
        const drawFog = !fieldMap.isVisible(newPosition.y, newPosition.x)
        this.clearRect(oldPosition.x, oldPosition.y - 1)

        // if (oldPosition.y - 1 !== newPosition.y) {
        for (const pos of oldPosition.neighbors()) {

            if (!pos.equals(newPosition) && !pos.equals(oldPosition)) {
                this.drawEntity(
                    fieldMap.getObject(pos.y, pos.x),
                    pos.x,
                    pos.y,
                    !fieldMap.isVisible(pos.y, pos.x)
                )
            }
        }
        // }

        this.drawEntity(entity, currentX, currentY, drawFog)
    }

    /**
     * @param {IEntity} entity
     * @param {int} eX
     * @param {int} eY
     * @param {boolean} drawFog
     */
    drawEntity(entity, eX, eY, drawFog) {
        this.clearRect(eX, eY)
        const y = this.defaultY + (eY * this.pointSize.y) + eY
        const x = this.defaultX + (eX * this.pointSize.x) + eX
        const image = entity.image

        if (image.src !== '') {
            if (entity instanceof IMovable || entity instanceof IBuilding) {
                this.drawEntityOverLay(entity, x, y)
            } else {
                this.context.drawImage(image, x - 1, y - 1, this.pointSize.x + 2, this.pointSize.y + 2)
            }
        }

        if (drawFog) {
            this.drawFogOverlay(x, y)
        }
    }

    drawFogOverlay(x, y) {
        this.context.fillStyle = 'rgba(0,0,0,0.3)'
        this.context.fillRect(x - 1, y - 1, this.pointSize.x + 2, this.pointSize.y + 2)
    }

    clearRect(eX, eY) {
        const yDraw = this.defaultY + (eY * this.pointSize.y) + eY
        const xDraw = this.defaultX + (eX * this.pointSize.x) + eX
        this.context.clearRect(xDraw - 1, yDraw - 1, this.pointSize.x + 2, this.pointSize.y + 2)
    }

    calculatePointSize(fieldSize) {
        let xSize = Math.floor((window.innerHeight - fieldSize.cells) / (fieldSize.cells + 1))
        let ySize = Math.floor((window.innerWidth - fieldSize.rows) / (fieldSize.rows + 1))

        let size = ySize > xSize ? xSize : ySize
        if (size < 20) {
            size = 20
        }
        if (size > 64) {
            size = 64
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

    drawEntityOverLay(entity, x, y) {
        const image = entity.image
        this.drawHp(entity, x, y, this.colorSettings[entity.team])
        this.context.drawImage(image, x, y, this.pointSize.x, this.pointSize.y)

        this.changeColor(x, y, this.colorSettings[entity.team])
    }

    drawHp(entity, x, y, color) {
        const thickness = 1
        const width = this.pointSize.x + (thickness * 2)
        const height = this.pointSize.y / 10 + (thickness * 2)
        this.context.fillStyle = '#000'
        this.context.fillRect(x - (thickness), y - (thickness) - 5, width, height)

        this.context.fillStyle = `rgb(${color.join(',')})`
        const hpPercent = entity.hp / entity.maxHp
        const hpWidth = width * hpPercent - 2
        this.context.fillRect(x - (thickness - 1), y - (thickness - 1) - 5, hpWidth, height - 2)
    }

    changeColor(x, y, newColor) {
        const imageData = this.context.getImageData(x, y, this.pointSize.x, this.pointSize.y)
        const data = imageData.data

        let was = false
        for (let y = 0; y < this.pointSize.y; y++) {
            for (let x = 0; x < this.pointSize.x; x++) {
                const red = data[((this.pointSize.x * y) + x) * 4]
                const green = data[((this.pointSize.x * y) + x) * 4 + 1]
                const blue = data[((this.pointSize.x * y) + x) * 4 + 2]

                if (green >= 250 && red <= 15 && blue <= 15) {
                    data[((this.pointSize.x * y) + x) * 4] = newColor[0]
                    data[((this.pointSize.x * y) + x) * 4 + 1] = newColor[1]
                    data[((this.pointSize.x * y) + x) * 4 + 2] = newColor[2]
                    was = true
                }
            }
        }

        this.context.putImageData(imageData, x, y)
    }

    /**
     * @param {Field} fieldMap
     * @return {Field}
     */
    cloneMap(fieldMap) {
        const yMap = new Map()

        for (let y = 0; y < fieldMap.size.rows; y++) {
            yMap.set(y, new Map(fieldMap.fieldMap.get(y)))
        }

        return new Field(yMap, fieldMap.visibleMap)
    }

    sthHasChanged(y, x, fieldMap) {
        const prevObj = this.previousFieldMap.getObject(y, x)
        const currObj = fieldMap.getObject(y, x)

        const hasHp = currObj instanceof IMovable || currObj instanceof IBuilding
            || prevObj instanceof IMovable || prevObj instanceof IBuilding

        return prevObj !== currObj
            || this.previousFieldMap.isVisible(y, x) !== fieldMap.isVisible(y, x)
            || (this.previousFieldMap.getObject(y + 1, x) !== fieldMap.getObject(y + 1, x)
                || this.previousFieldMap.isVisible(y + 1, x) !== fieldMap.isVisible(y + 1, x)) || hasHp
    }
}