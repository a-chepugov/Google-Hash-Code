const Point = require('./Point');

class State {
    constructor(R, C) {
        this.R = R;
        this.C = C;
        const INIT = State.INIT;

        let cells = [];
        for (let rI = this.R; rI--;) {
            let row = Array(C).fill(INIT);
            cells.push(row)
        }
        this.cells = cells;
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
                let {
                    R, C,
                    position: {r, c}
                } = this;

                console.log(`State.js(next):36 ========== ${r} ${c}, ${R} ${C}`);

                while (!(r === R && c === C)) {
                    console.log(`State.js(next):39 ========== ${r} ${c}`);
                    if (c < C - 1) {
                        c++;
                    } else if (r < R - 1) {
                        r++;
                        c = 0;
                    }
                    if (this.getCellState(r, c) === State.INIT) {
                        let position = new Point(r, c);
                        this.position = position;
                        return {
                            done: false,
                            value: position
                        };
                    }
                }

                return {
                    done: true
                };
            }
        };
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

State.INIT = 0;
State.USED = 1;
State.SKIP = 2;

module.exports = State;