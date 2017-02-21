const Point = require('./Point');

class Slice {
    constructor({cells}) {
        this.cells = cells;
    }

    isEnoughItems(L) {
        let countM = 0;
        let countT = 0;

        let cells = this.cells;

        for (let rI = cells.length; rI--;) {
            let row = cells[rI];
            for (let cI = row.length; cI--;) {
                if (row[cI].valueOf() === 'M') {
                    countM++;
                } else {
                    countT++;
                }
                if (countT >= L && countM >= L) {
                    return true;
                }
            }
        }
        return false
    }

    get area() {
        let [{r: r1, c: c1} = {}, {r: r2, c: c2} = {}] = this.points;
        let area = (r2 - r1 + 1) * (c2 - c1 + 1);
        return area;
    }

    getPoint(N) {
        if (!this._inOneRow) {
            this._inOneRow = this.cells.reduce((result, row) => {
                return result.concat(row);
            }, []);
        }
        let inOneRow = this._inOneRow;

        return (
            N < 0 ? inOneRow[inOneRow.length + N] : inOneRow[N]
        )
    }

    getRow(N) {
        let cells = this.cells;
        return (
            N < 0 ? cells[cells.length + N] : cells[N]
        )
    }

    get points() {
        let start = this.getPoint(0);
        let finish = this.getPoint(-1);

        return [this.getPoint(0), this.getPoint(-1)]
    }

    * iterate() {
        let points = this.points;
        let [start, finish] = points;

        for (let rI = start.r, R = finish.r; rI <= R; rI++) {
            for (let cI = start.c, C = finish.c; cI <= C; cI++) {
                yield new Point(rI, cI);
            }
        }
    }

    [Symbol.iterator]() {
        return this.iterate();
    }

    valueOf() {
        return this.toString()
    }

    toString() {
        let string = `${this.points[0]} -> ${this.points[1]} =>> ${this.area} : ${this.N}\n`;
        for (let row of this.cells) {
            string += (row.join(' | ') + '\n');
        }
        return string;
    }

    forSave() {
        return `${this.points[0]} ${this.points[1]}`
    }
}

module.exports = Slice;