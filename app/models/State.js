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

    [Symbol.iterator]() {
        return {
            position: new Point(0, -1),
            R: this.R,
            C: this.C,
            getCellState: this.getCellState.bind(this),

            next() {
                let FREE = State.FREE;
                let {
                    R, C,
                    position: {r, c}
                } = this;

                c++;
                for (let rI = r; rI < R; rI++) {
                    for (let cI = c; cI < C; cI++) {
                        if (this.getCellState(rI, cI) === FREE) {
                            let position = new Point(rI, cI);
                            this.position = position;
                            return {
                                done: false,
                                value: position
                            };
                        }
                    }
                    c = -1;
                }

                // let rI = r, cI = c;

                // do {
                //     do {
                //         if (this.getCellState(rI, cI) === FREE) {
                //             let position = new Point(rI, cI);
                //             this.position = position;
                //             return {
                //                 done: false,
                //                 value: position
                //             };
                //         }
                //         cI++
                //     } while (cI < C);
                //     cI = 0;
                //     rI++
                //
                // } while (rI < R);

                return {
                    done: true
                }
            }
        }
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