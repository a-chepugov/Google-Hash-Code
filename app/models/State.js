const Point = require('./Point');
const Cell = require('./Cell');
const Slice = require('./Slice');
const Field = require('./Field');

class State {
    constructor(pizza) {
        this.pizza = pizza;
        const FREE = State.FREE;

        let cells = [];
        for (let r = 0, R = this.R; r < R; r++) {
            let row = [];
            for (let c = 0, C = this.C; c < C; c++) {
                let cell = new Cell(r, c, FREE);
                row.push(cell)
            }
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

    getCell(r, c) {
        return this.cells[r][c]
    }

    getCellState(r, c) {
        return this.cells[r][c].value
    }

    setCellState(r, c, value) {
        this.cells[r][c].value = value;
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
            let [item] = this.back();
            if (item instanceof Slice) {
                let {points: {0: point}, N} = item;
                this.fillPosition(point, N + 1);
                return item;
            }
        }
    }


    fillPosition(point, N, cb) {
        let field = this.createFieldForPoint(point);
        let slices = field.slices;

        if(cb instanceof Function) {
            cb(slices, N);
        }

        if (N) {
            slices = slices.slice(N);
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
            this.skipPoint(point);
        }
    }

    * getAnotherSet(skipStateCb, stopCb, positionCb) {
        let skipped = this.area;

        do {

            for (let point of this.nextFreePoint()) {
                this.fillPosition(point, positionCb);
                if (skipStateCb(this)) {
                    break;
                }
            }


            if (!(skipStateCb(this))) {
                skipped = this.areaSkipped;
                yield this;
            }

            if (stopCb(this)) {
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
        let getCell = this.getCell.bind(this);

        for (let r = 0; r < R; r++) {
            for (let c = 0; c < C; c++) {
                if (getCellState(r, c) === FREE) {
                    let position = getCell(r, c);
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
                    .map(item => {
                        return item.valueOf()
                    })
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

    createFieldForPoint(point) {
        let Fields = State.Fields;
        let field = Fields.get(point);
        if (!field) {
            field = new Field(this.pizza, point);
            Fields.set(point, field);
        }
        // let field = new Field(this, point);
        return field;
    }
}

State.FREE = 0;
State.USED = 8;
State.SKIP = 1;

State.Fields = new WeakMap();

State.createInstanse = function (pizza) {
    return new State(pizza)
}

module.exports = State;