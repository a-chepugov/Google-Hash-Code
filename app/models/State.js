const Point = require('./Point');
const Slice = require('./Slice');

class State {
    constructor(pizza) {
        this.pizza = pizza;
        const FREE = State.FREE;

        let cells = [];
        for (let r = this.R; r--;) {
            let row = Array(this.C).fill(FREE);
            cells.push(row)
        }
        this.cells = cells;

        this.cutted = [];
        this.skipped = [];
        this.all = [];
        this.position = new Point(0, 0);
    }

    get R() {
        return this.pizza.R
    }

    get C() {
        return this.pizza.C
    }

    get area() {
        return this.R * this.C
    }

    get areaCutted() {
        return this.cutted.reduce((result, item) => {
            return result + item.area
        }, 0)
    }

    get areaSkipped() {
        return this.skipped.length;
    }

    get areaFree() {
        return this.area - (this.areaCutted + this.areaSkipped)
    }

    getCellState(r, c) {
        return this.cells[r][c]
    }

    setCellState(r, c, value) {
        this.cells[r][c] = value;
    }


    isCuttable(slice) {
        let row = slice.getRow(0);
        const FREE = State.FREE;

        for (let point of row) {
            let state = this.getCellState(point.r, point.c);
            if (state !== FREE) {
                return false;
            }
        }
        return true;
    }

    markSlice(slice, mark) {
        let setCellState = this.setCellState.bind(this);

        for (let point of slice) {
            this.markPoint(point, mark)
        }
    }

    cutSlice(slice) {
        this.cutItem(slice);
        this.markSlice(slice, State.USED)
    }

    uncutSlice(slice) {
        this.markSlice(slice, State.FREE)
    }

    markPoint(point, mark) {
        let setCellState = this.setCellState.bind(this);
        let {r, c} = point;
        setCellState(r, c, mark);
    }

    skipPoint(point) {
        this.cutItem(point);
        this.markPoint(point, State.SKIP)
    }

    unskipPoint(point) {
        this.markPoint(point, State.FREE)
    }

    cutItem(item) {
        if (item instanceof Point) {
            this.all.push(item);
            this.skipped.push(item);
        } else if (item instanceof Slice) {
            this.all.push(item);
            this.cutted.push(item);
        }
    }

    uncutItem() {
        let item = this.all.pop();
        if (item instanceof Point) {
            this.skipped.pop();
        } else if (item instanceof Slice) {
            this.cutted.pop();
        }
        return item;
    }

    back(steps = 1) {
        let chunks = [];
        for (let step = 0; step < steps; step++) {
            let item = this.uncutItem();
            chunks.push(item);
            if (item instanceof Point) {
                this.unskipPoint(item);
            } else if (item instanceof Slice) {
                this.uncutSlice(item);
            }
        }
        return chunks;
    }

    changeLastSlice() {
        for (let item of this.cutted) {
            console.log(`State.js(changeLastSlice):138 => `,item.N);
        }


        let pizza = this.pizza;
        while (this.cutted.length) {
            let [item] = this.back();
            console.log(`State.js(changeLastSlice):140 => ${this}`);
            if (item instanceof Slice) {
                let {points: {0: point}, N} = item;
                console.log(`State.js(changeLastSlice):143 => `, N);
                N--;
                this.tryToCut(point, N);
                this.position = point;
                return item;
            } else {
                this.position = item;
            }
        }
    }

    * nextFreePoint() {
        let position = this.position;
        const R = this.R;
        const C = this.C;
        const FREE = State.FREE;
        let getCellState = this.getCellState.bind(this);

        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (getCellState(r, c) === FREE) {
                    let position = new Point(r, c);
                    yield position;
                }
            }
        }
    }

    tryToCut(point, N) {
        // console.log(`State.js(tryToCut):169 => `,N);
        let slicesBunch = this.pizza.createValidSlicesForPoint(point);

        // console.log(`State.js(tryToCut):172 => `,slicesBunch.length);

        if (slicesBunch.length) {
            for (let i = N ? N : 0, l = slicesBunch.length; i < l; i++) {

                let [slice] = slicesBunch;

                console.log(`State.js(tryToCut):182 => `, slice.N);

                let is = this.isCuttable(slice);
                if (this.isCuttable(slice)) {
                    this.cutSlice(slice);
                    break;
                } else {
                    if (i < l - 1) {
                        continue;
                    } else {
                        this.skipPoint(point);
                    }
                }
            }
        } else {
            this.skipPoint(point);
        }
    }

    * getAnotherSet() {
        let go = 3;

        do {
            go--
            // console.time('cut');

            for (let point of this.nextFreePoint()) {
                // console.time(`cut ${point}`);

                this.tryToCut(point);

                // console.timeEnd(`cut ${point}`);
            }

            console.log(`State.js(getAnotherSet):172 ==========`, `${this}`);

            // console.timeEnd('cut');

            yield this;

            // go = this.changeLastSlice();
            this.changeLastSlice();

            // console.log(`State.js(getAnotherSet):199 => `, !!go);

        } while (go);

    }

    [Symbol.iterator]() {
        return this.getAnotherSet();
    }

    toString() {
        let string = `\n`;
        let cells = this.cells;
        for (let row of cells) {
            let rowString = row
                    .map(item => item.valueOf())
                    .join('') + '\n';
            string += rowString;
        }
        return string;
    }

    forSave() {
        let slices = this.cutted;
        let string = `${slices.length}\n`;
        for (let item of slices) {
            let sliceLine = item.forSave() + '\n';
            string += sliceLine;
        }

        return string;
    }
}

State.FREE = 0;
State.USED = 8;
State.SKIP = 1;

module.exports = State;