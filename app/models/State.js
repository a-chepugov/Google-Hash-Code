const Point = require('./Point');

class State {
    constructor(R, C) {
        this.R = R;
        this.C = C;
        const INIT = State.FREE;

        let cells = [];
        for (let rI = this.R; rI--;) {
            let row = Array(C).fill(INIT);
            cells.push(row)
        }
        this.cells = cells;

        // @todo размещать отрезанные и пропущенные куски
        this.cutted = [];
    }

    getCellState(r, c) {
        return this.cells[r][c]
    }

    setCellState(r, c, value) {
        this.cells[r][c] = value;
    }


    * iterateField() {
        let position = new Point(0, 0);
        const R = this.R;
        const C = this.C;
        const FREE = State.FREE;
        let getCellState = this.getCellState.bind(this);

        for (let rI = 0; rI < R; rI++) {
            for (let cI = 0; cI < C; cI++) {
                if (getCellState(rI, cI) === FREE) {
                    let position = new Point(rI, cI);
                    yield position;
                }
            }
        }

        return;
    }

    [Symbol.iterator]() {
        return this.iterateField();
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
}

State.FREE = 0;
State.USED = 1;
State.SKIP = 2;

module.exports = State;