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

    cutSlice(item) {
        this.cutItem(item);
    }

    markPoint(point, mark) {
        let setCellState = this.setCellState.bind(this);
        let {r, c} = point;
        setCellState(r, c, mark);
    }

    skipPoint(item) {
        this.cutItem(item);
    }

    cutItem(item) {
        // console.log('State.js(cutItem):91 =>', item instanceof Point);
        // console.log('State.js(cutItem):91 =>', item instanceof Slice);
        // console.log('State.js(cutItem):91 =>', item.constructor.name);

        if (item instanceof Point) {
            this.all.push(item);
            this.skipped.push(item);
            this.markPoint(item, State.SKIP)
        } else if (item instanceof Slice) {
            this.all.push(item);
            this.cutted.push(item);
            this.markSlice(item, State.USED)
        }
    }

    uncutItem() {
        let item = this.all.pop();
        if (item instanceof Point) {
            this.skipped.pop();
            this.markPoint(item, State.FREE)
        } else {
            this.cutted.pop();
            this.markSlice(item, State.FREE)
        }

        return item
    }

    back(steps = 1) {
        let chunks = [];
        for (let step = 0; step < steps; step++) {
            let item = this.uncutItem();
            chunks.push(item);
        }
        return chunks;
    }

    changeLastSlice() {
        while (this.cutted.length) {
            // console.log('State.js(changeLastSlice):134 =>', `${this}`);

            let q = `${this}`;

            // console.log('State.js(changeLastSlice):140 =>', `${this}`);
            let [item] = this.back();

            if (item instanceof Slice) {
                let {points: {0: point}, N} = item;

                // console.log('State.js(changeLastSlice):152 =>', q);

                this.fillPosition(point, N + 1);
                // console.log('State.js(changeLastSlice):158 =>', `${this}`);

                return item;
            }
        }
    }


    fillPosition(point, N) {
        let field = this.pizza.createFieldForPoint(point);
        let slices = field.slices;

        if (N) {
            // console.log('State.js(fillPosition):148 =>', N);
            // console.log('State.js(fillPosition):150 =>', slices.length);
            slices = slices.slice(N);
            // console.log('State.js(fillPosition):150 =>', slices.length);
        }
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
            // console.log('State.js(fillPosition):170 =>', `${point}`);
            this.skipPoint(point);
        }

        // console.log('State.js(fillPosition):157 =>',`${this}`);

    }

    * getAnotherSet() {
        let skipped = this.area;

        do {

            for (let point of this.nextFreePoint()) {
                // console.log('State.js(getAnotherSet):180 =>', `${point}`);
                this.fillPosition(point);
                if (skipped <= this.areaSkipped) {
                    break;
                }
            }

            if (skipped > this.areaSkipped) {
                skipped = this.areaSkipped;
                yield this;
            }

            if (this.areaSkipped === 0) {
                break
            }

        } while (this.changeLastSlice());

    }

    [Symbol.iterator]() {
        return this.getAnotherSet();
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