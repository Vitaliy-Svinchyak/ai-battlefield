"use strict";

/**
 * @property {Human[]} humans                 - all humans of the fieldMap
 * @property {CollectiveMind} collectiveMind
 * @property {HTMLTextAreaElement} textarea     - where we draw everything
 * @property {[[Point]]} fieldMap
 */
class Field {

    /**
     * @param {[[Point]]|string} field
     */
    constructor(field) {
        let fieldMap = field;

        if (typeof field === 'string') {
            fieldMap = this.parseString(field);
        }

        this.fieldMap = fieldMap;

        this.detectFieldSize();
        this.painter = new Painter(document.querySelector('#canvas-field'), this);
        this.draw();
    }

    /**
     * Parses string representation of fieldMap (for simulating purposes)
     *
     * @param {string} string
     *
     * @returns {[*]}
     */
    parseString(string) {
        const rows = string.split('\n');

        return rows.map(s => s.split(''));
    }

    cloneMap() {
        const map = [];

        for (let y = 0; y < this.fieldMap.size; y++) {
            const submapArr = [];
            const submap = this.fieldMap.get(y);

            for (let x = 0; x < submap.size; x++) {

                submapArr.push(submap.get(x));
            }

            map.push(submapArr);
        }

        this.fieldMapOrigin = map;
    }

    exportMap() {
        return this.fieldMapOrigin;
    }

    exportHistory() {
        const history = [];

        for (let human of this.collectiveMind.humans) {
            history.push(human.history);
        }

        return history;
    }

    draw() {
        this.painter.draw();
    }

    detectFieldSize() {
        this.fieldSize = {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        };
    }
}