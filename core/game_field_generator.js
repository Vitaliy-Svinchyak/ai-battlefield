"use strict";
const type = {
    rock: '■',
    human: 'o',
    tree: '֏',
    empty: ' ',
    track: 'x',
    route: 'w',
    house: 'h',
    food: 'f',
    gold: 'g',
};

const solidObjects = [type.rock, type.tree, type.house, type.food, type.gold];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class GameFieldGenerator {

    gameMap(rows, cells) {
        this.size = {y: rows, x: cells};
        this.fieldMap = this.empty(rows, cells);
        let item;

        for (let y = 0; y <= rows; y++) {
            const yMap = this.fieldMap.get(y);

            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.rock;
                } else {
                    let rand = getRandomInt(0, 100);
                    if ((x < 10 && y < 10) || (x > rows - 10 && y > cells - 10)) {
                        rand = 0;
                    }

                    switch (rand) {
                        case 3:
                            this.generateChain(y, x, type.rock, rows, cells);
                            break;
                        case 4:
                            this.generateChain(y, x, type.tree, rows, cells);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        this.fieldMap.get(3).set(3, type.human);
        this.fieldMap.get(1).set(1, type.human);
        this.fieldMap.get(2).set(2, type.house);
        this.fieldMap.get(5).set(3, type.gold);
        this.fieldMap.get(5).set(2, type.gold);
        this.fieldMap.get(3).set(5, type.food);
        this.fieldMap.get(2).set(5, type.food);

        this.fieldMap.get(this.fieldMap.size - 4).set(this.fieldMap.get(0).size - 4, type.human);
        this.fieldMap.get(this.fieldMap.size - 2).set(this.fieldMap.get(0).size - 2, type.human);
        this.fieldMap.get(this.fieldMap.size - 3).set(this.fieldMap.get(0).size - 3, type.house);

        this.fieldMap.get(this.fieldMap.size - 6).set(this.fieldMap.get(0).size - 4, type.gold);
        this.fieldMap.get(this.fieldMap.size - 6).set(this.fieldMap.get(0).size - 3, type.gold);
        this.fieldMap.get(this.fieldMap.size - 4).set(this.fieldMap.get(0).size - 6, type.food);
        this.fieldMap.get(this.fieldMap.size - 3).set(this.fieldMap.get(0).size - 6, type.food);

        return this.fieldMap;
    }

    generateChain(y, x, type, rows, cells) {
        let startY = y;
        let startX = x;

        for (let i = 0; i < 5; i++) {
            const variant = this.getRandomVariant(startY, startX);

            if (variant) {
                startY = variant.y;
                startX = variant.x;
                this.fieldMap.get(startY).set(startX, type);
                let duplicatedY = rows - startY;
                let duplicatedX = cells - startX;
                this.fieldMap.get(duplicatedY).set(duplicatedX, type);
            }
        }
    }

    getRandomVariant(y, x) {
        const variants = this.getPossiblePointsToGo(y, x);
        return variants[getRandomInt(0, variants.length - 1)]
    }

    getPossiblePointsToGo(startY, startX) {
        const variants = [];

        for (let y = startY - 1; y <= startY + 1; y++) {
            const yMap = this.fieldMap.get(y);

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (!(y === 0 || y === this.size.y || x === 0 || x === this.size.x)
                    && solidObjects.indexOf(yMap.get(x)) === -1
                    && this.nearIsEmpty(y, x)
                ) {
                    variants.push({x: x, y: y});
                }
            }
        }

        return variants;
    }

    nearIsEmpty(startY, startX) {
        let count = 0;
        for (let y = startY - 1; y <= startY + 1; y++) {
            const yMap = this.fieldMap.get(y);

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (solidObjects.indexOf(yMap.get(x)) !== -1) {
                    count++;
                }
            }
        }

        return count <= 2;
    }

    empty(rows, cells) {
        let field = new Map();
        let item;

        for (let y = 0; y <= rows; y++) {
            const yMap = new Map();

            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.rock;
                } else {
                    item = type.empty;
                }

                yMap.set(x, item);
                field.set(y, yMap);
            }
        }

        return field;
    }
}

const gameFieldGenerator = new GameFieldGenerator();