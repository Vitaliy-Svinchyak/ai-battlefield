"use strict"
const type = {
    rock: '■',
    human: 'o',
    tree: '֏',
    empty: ' ',
    house: 'h',
    food: 'f',
    gold: 'g',
}

let lastNumber = 0

function getRandomInt(min, max) {
    // if (lastNumber > max) {
    //     lastNumber = 0
    // } else {
    //     lastNumber++
    // }
    //
    // return lastNumber
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class GameFieldGenerator {

    static gameMap(rows, cells) {
        const fieldMap = GameFieldGenerator.emptyMap(rows, cells)
        const saveRadius = 8

        for (let y = 1; y < rows; y++) {
            for (let x = 1; x < cells; x++) {
                let chanceToSpawn = getRandomInt(0, 100)
                const isTopLeftCorner = (x < saveRadius && y < saveRadius)
                const isBottomRightCorner = (x > rows - saveRadius && y > cells - saveRadius)

                if (isTopLeftCorner || isBottomRightCorner) {
                    chanceToSpawn = 0
                }

                switch (chanceToSpawn) {
                    case 3:
                        GameFieldGenerator.generateChain(y, x, type.rock, rows, cells, fieldMap)
                        break
                    case 4:
                        GameFieldGenerator.generateChain(y, x, type.tree, rows, cells, fieldMap)
                        break
                }
            }
        }

        fieldMap.get(3).set(3, type.human)
        fieldMap.get(1).set(1, type.human)
        fieldMap.get(2).set(2, type.house)
        fieldMap.get(5).set(3, type.gold)
        fieldMap.get(5).set(2, type.gold)
        fieldMap.get(3).set(5, type.food)
        fieldMap.get(2).set(5, type.food)

        fieldMap.get(rows - 4).set(cells - 4, type.human)
        fieldMap.get(rows - 2).set(cells - 2, type.human)
        fieldMap.get(rows - 3).set(cells - 3, type.house)
        fieldMap.get(rows - 6).set(cells - 4, type.gold)
        fieldMap.get(rows - 6).set(cells - 3, type.gold)
        fieldMap.get(rows - 4).set(cells - 6, type.food)
        fieldMap.get(rows - 3).set(cells - 6, type.food)

        return fieldMap
    }

    static generateChain(y, x, type, maxY, maxX, fieldMap) {
        for (let i = 0; i < 5; i++) {
            const variant = GameFieldGenerator.getRandomVariant(y, x, fieldMap)

            if (variant !== undefined) {
                y = variant.y
                x = variant.x
                fieldMap.get(y).set(x, type)

                let duplicatedY = maxY - y
                let duplicatedX = maxX - x
                fieldMap.get(duplicatedY).set(duplicatedX, type)
            }
        }
    }

    static getRandomVariant(y, x, fieldMap) {
        const variants = GameFieldGenerator.getVariantsToPutSolidObject(y, x, fieldMap)

        return variants[getRandomInt(0, variants.length - 1)]
    }

    static getVariantsToPutSolidObject(startY, startX, fieldMap) {
        const variants = []

        for (let y = startY - 1; y <= startY + 1; y++) {
            const yMap = fieldMap.get(y)

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (yMap.get(x) === type.empty && GameFieldGenerator.nearIsEmpty(y, x, fieldMap)) {
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
                if (yMap.get(x) !== type.empty) {
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
                    item = type.rock
                } else {
                    item = type.empty
                }

                yMap.set(x, item)
                field.set(y, yMap)
            }
        }

        return field
    }
}