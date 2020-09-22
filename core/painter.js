"use strict";

class Painter {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Field} field
     */
    constructor(canvas, field) {
        this.canvas = canvas;
        this.fieldMap = field;
        this.pointSize = this.calculatePointSize();
        this.fieldReady = false;
        this.setCanvasSize();

        this.wallImg = new Image(this.pointSize.x, this.pointSize.y);
        this.wallImg.src = 'images/rock.png';
        this.treeImg = new Image(this.pointSize.x, this.pointSize.y);
        this.treeImg.src = 'images/tree.png';
        this.humanImg = new Image(this.pointSize.x, this.pointSize.y);
        this.humanImg.src = 'images/human.png';
        this.houseImg = new Image(this.pointSize.x, this.pointSize.y);
        this.houseImg.src = 'images/house.png';
        this.foodImg = new Image(this.pointSize.x, this.pointSize.y);
        this.foodImg.src = 'images/food.png';
        this.goldImg = new Image(this.pointSize.x, this.pointSize.y);
        this.goldImg.src = 'images/gold.png';
    }

    preLoadImages(arr, callback) {
        const images = {};
        let loadedImageCount = 0;

        for (let i = 0; i < arr.length; i++) {
            const img = arr[i];
            img.onload = imageLoaded;
            images[arr[i]] = img;
        }

        function imageLoaded(e) {
            loadedImageCount++;
            if (loadedImageCount >= arr.length) {
                callback();
            }
        }
    }

    draw() {
        this.preLoadImages(
            [this.wallImg, this.treeImg, this.humanImg, this.houseImg, this.foodImg, this.goldImg],
            () => {
                if (!this.fieldReady) {
                    this.drawCanvasField();
                } else {
                    for (const move of this.fieldMap.movesOnThisStep) {
                        const formYDraw = this.defaultY + (move.from.y * this.pointSize.y) + move.from.y;
                        const formXDraw = this.defaultX + (move.from.x * this.pointSize.x) + move.from.x;
                        this.drawTrack(formXDraw, formYDraw);

                        const yDraw = this.defaultY + (move.to.y * this.pointSize.y) + move.to.y;
                        const xDraw = this.defaultX + (move.to.x * this.pointSize.x) + move.to.x;
                        this.drawHuman(xDraw, yDraw);
                    }
                }
            })

    }

    /**
     * For first draw
     */
    drawCanvasField() {
        this.fieldReady = true;
        this.context = this.canvas.getContext("2d");

        if (this.canvas.width > window.innerWidth || this.canvas.height > window.innerHeight) {
            this.defaultY = 0;
            this.defaultX = 0;
        } else {
            this.defaultY = Math.floor((window.innerHeight - ((this.pointSize.y + 1) * this.fieldMap.fieldSize.rows)) / 2);
            this.defaultX = Math.floor((window.innerWidth - ((this.pointSize.x + 1) * this.fieldMap.fieldSize.cells)) / 2);
        }

        let yDraw = this.defaultY;

        for (let y = 0; y < this.fieldMap.fieldSize.rows; y++) {
            let xDraw = this.defaultX;
            const yMap = this.fieldMap.fieldMap.get(y);

            for (let x = 0; x < this.fieldMap.fieldSize.cells; x++) {
                switch (yMap.get(x)) {
                    case type.rock:
                        this.drawWall(xDraw, yDraw);
                        break;
                    case type.tree:
                        this.drawTree(xDraw, yDraw);
                        break;
                    case type.human:
                        this.drawHuman(xDraw, yDraw);
                        break;
                    case type.house:
                        this.drawHouse(xDraw, yDraw);
                        break;
                    case type.food:
                        this.drawFood(xDraw, yDraw);
                        break;
                    case type.gold:
                        this.drawGold(xDraw, yDraw);
                        break;
                }
                xDraw += this.pointSize.x + this.pointSize.margin;
            }
            yDraw += this.pointSize.y + this.pointSize.margin;
        }
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawWall(xDraw, yDraw) {
        this.context.drawImage(this.wallImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawHuman(xDraw, yDraw) {
        this.context.drawImage(this.humanImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    drawHouse(xDraw, yDraw) {
        this.context.drawImage(this.houseImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    drawFood(xDraw, yDraw) {
        this.context.drawImage(this.foodImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    drawGold(xDraw, yDraw) {
        this.context.drawImage(this.goldImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawTree(xDraw, yDraw) {
        this.context.drawImage(this.treeImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawTrack(xDraw, yDraw) {
        this.clearRect(xDraw, yDraw);
        this.context.fillStyle = 'rgba(128, 128, 128, 0.35)';
        this.context.fillRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
        this.context.fill();
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    clearRect(xDraw, yDraw) {
        this.context.clearRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    calculatePointSize() {
        let xSize = Math.floor((window.innerHeight - this.fieldMap.fieldSize.cells) / (this.fieldMap.fieldSize.cells + 1));
        let ySize = Math.floor((window.innerWidth - this.fieldMap.fieldSize.rows) / (this.fieldMap.fieldSize.rows + 1));

        let size = ySize > xSize ? xSize : ySize;
        if (size < 8) {
            size = 8;
        }
        if (size > 32) {
            size = 32;
        }

        return {y: size, x: size, margin: 1};
    }

    setCanvasSize() {
        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        let height = (this.pointSize.y + 1) * this.fieldMap.fieldSize.rows;
        let width = (this.pointSize.x + 1) * this.fieldMap.fieldSize.cells;

        if (height < h && width < w) {
            height = h;
            width = w;
            document.body.style.overflow = 'hidden';
        }

        this.canvas.height = height;
        this.canvas.width = width;
    }
}