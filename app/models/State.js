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
        return this.skipped.length
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
        this.all.push(slice);
        this.cutted.push(slice);
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
        this.all.push(point);
        this.skipped.push(point);
        this.markPoint(point, State.SKIP)
    }

    unskipPoint(point) {
        this.markPoint(point, State.FREE)
    }

    back(steps = 1) {
        let chunks = [];
        for (let step = 0; step < steps; step++) {
            let item = this.all.pop();
            chunks.push(item);
            if (item instanceof Point) {
                this.skipped.pop();
                this.unskipPoint(item);
            } else if (item instanceof Slice) {
                this.cutted.pop();
                this.uncutSlice(item);
            }
        }
        return chunks;
    }

    changeLastSlice() {
        while (this.all.length) {
            let [item] = this.back();
            if (item instanceof Slice) {
                let {points: {0: point}, N} = item;
                let slices = this.pizza.createValidSlicesForPizzaPoint(point);
                return item;
            }
        }
    }

    * nextFreePoint() {
        let position = new Point(0, 0);
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

    * getAnotherSet() {
        console.log(`State.js(getAnotherSet):139 => `, `${this}`);

        do {
            console.time('cut');

            for (let point of this.nextFreePoint()) {
                console.time(`cut ${point}`);

                let slices = this.pizza.createValidSlicesForPizzaPoint(point);
                if (slices.length) {
                    for (let i = 0, l = slices.length; i < l; i++) {
                        let slice = slices[i];
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

                console.timeEnd(`cut ${point}`);
            }

            console.log(`State.js(getAnotherSet):172 ==========`, `${this}`);

            console.timeEnd('cut');

            yield this;

            this.changeLastSlice();

        } while (false);

    }

    [Symbol.iterator]() {
        return this.getAnotherSet();
    }

    toString() {
        let string = `${this.R} ${this.C}\n`;
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