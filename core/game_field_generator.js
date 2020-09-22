"use strict"

import Rock from "./entity/solid/rock.js"
import Empty from "./entity/empty.js"
import Peasant from "./entity/unit/peasant.js"
import TownHall from "./entity/building/townHall.js"
import Gold from "./entity/resource/gold.js"
import Food from "./entity/resource/food.js"
import Tree from "./entity/solid/tree.js"
import Point from "./point.js"

let lastNumber = 0
const positionSymbol = Symbol('position')

const generatePeasant = (y, x, team) => {
    const peasant = new Peasant(team)
    peasant[positionSymbol] = new Point(y, x)
    return peasant
}
const generateTownHall = (y, x, team) => {
    const hall = new TownHall(team)
    hall[positionSymbol] = new Point(y, x)
    return hall
}
const generateGold = (y, x) => {
    const gold = new Gold()
    gold[positionSymbol] = new Point(y, x)
    return gold
}
const generateFood = (y, x) => {
    const food = new Food()
    food[positionSymbol] = new Point(y, x)
    return food
}

export default class GameFieldGenerator {

    static gameMap(rows, cells) {
        const fieldMap = GameFieldGenerator.emptyMap(rows, cells)
        const saveRadius = 8

        for (let y = 1; y < rows; y++) {
            for (let x = 1; x < cells; x++) {
                let chanceToSpawn = GameFieldGenerator.getRandomInt(0, 100)
                const isTopLeftCorner = (x < saveRadius && y < saveRadius)
                const isBottomRightCorner = (x > rows - saveRadius && y > cells - saveRadius)

                if (isTopLeftCorner || isBottomRightCorner) {
                    chanceToSpawn = 0
                }

                switch (chanceToSpawn) {
                    case 3:
                        GameFieldGenerator.generateChain(y, x, Rock, rows, cells, fieldMap)
                        break
                    case 4:
                        GameFieldGenerator.generateChain(y, x, Tree, rows, cells, fieldMap)
                        break
                }
            }
        }

        GameFieldGenerator.setCivilisations(fieldMap, rows, cells)

        return fieldMap
    }

    static setCivilisations(fieldMap, maxY, maxX) {
        fieldMap.get(3).set(3, generatePeasant(3, 3, 1))
        fieldMap.get(1).set(1, generatePeasant(1, 1, 1))
        fieldMap.get(2).set(2, generateTownHall(2, 2, 1))
        fieldMap.get(5).set(3, generateGold(5, 3))
        fieldMap.get(5).set(2, generateGold(5, 2))
        fieldMap.get(3).set(5, generateFood(3, 5))
        fieldMap.get(2).set(5, generateFood(2, 5))

        fieldMap.get(maxY - 4).set(maxX - 4, generatePeasant(maxY - 4, maxX - 4, 2))
        fieldMap.get(maxY - 2).set(maxX - 2, generatePeasant(maxY - 2, maxX - 2, 2))
        fieldMap.get(maxY - 3).set(maxX - 3, generateTownHall(maxY - 3, maxX - 3, 2))
        fieldMap.get(maxY - 6).set(maxX - 4, generateGold(maxY - 6, maxX - 4))
        fieldMap.get(maxY - 6).set(maxX - 3, generateGold(maxY - 6, maxX - 3))
        fieldMap.get(maxY - 4).set(maxX - 6, generateFood(maxY - 4, maxX - 6))
        fieldMap.get(maxY - 3).set(maxX - 6, generateFood(maxY - 3, maxX - 6))
    }

    static generateChain(y, x, type, maxY, maxX, fieldMap) {
        for (let i = 0; i < 5; i++) {
            const variant = GameFieldGenerator.getRandomVariant(y, x, fieldMap)

            if (variant !== undefined) {
                y = variant.y
                x = variant.x
                fieldMap.get(y).set(x, new type())

                let duplicatedY = maxY - y
                let duplicatedX = maxX - x
                fieldMap.get(duplicatedY).set(duplicatedX, new type())
            }
        }
    }

    static getRandomVariant(y, x, fieldMap) {
        const variants = GameFieldGenerator.getVariantsToPutSolidObject(y, x, fieldMap)

        return variants[GameFieldGenerator.getRandomInt(0, variants.length - 1)]
    }

    static getVariantsToPutSolidObject(startY, startX, fieldMap) {
        const variants = []

        for (let y = startY - 1; y <= startY + 1; y++) {
            const yMap = fieldMap.get(y)

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (yMap.get(x) instanceof Empty && GameFieldGenerator.nearIsEmpty(y, x, fieldMap)) {
                    variants.push({x: x, y: y})
                }
            }
        }

        return variants
    }

    static nearIsEmpty(startY, startX, fieldMap) {
        let count = 0
        for (let y = startY - 1; y <= startY + 1; y++) {
            const yMap = fieldMap.get(y)

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (!(yMap.get(x) instanceof Empty)) {
                    count++
                }
            }
        }

        return count <= 2
    }

    static emptyMap(rows, cells) {
        let field = new Map()
        let item

        for (let y = 0; y <= rows; y++) {
            const yMap = new Map()

            for (let x = 0; x <= cells; x++) {
                const isBorder = y === 0 || y === rows || x === 0 || x === cells

                if (isBorder) {
                    item = new Rock()
                } else {
                    item = new Empty()
                }

                yMap.set(x, item)
                field.set(y, yMap)
            }
        }

        return field
    }

    static getRandomInt(min, max) {
        if (lastNumber > max) {
            lastNumber = 0
        } else {
            lastNumber++
        }

        return lastNumber
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}