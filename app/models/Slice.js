const Point = require('./Point');
const Field = require('./Field');
const Pizza = require('./Pizza');

class Slice {
    constructor(data) {
        Object.assign(this, data);
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

    setNumber(N) {
        this.N = N;
    }

    * iterate() {
        let [start, finish] = this.points;

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

Slice.createSlices = function (field, pointStart) {
    let cells = field.cells;
    let rMax = cells.length;
    let slices = [];

    for (let rI = 0; rI < rMax; rI++) {
        let rowCurrent = cells[rI];
        let maxLength = rowCurrent.length;

        for (let curLength = maxLength + 1; --curLength;) {

            let sliceCells = [];
            for (let rowForSliceI = 0; rowForSliceI <= rI; rowForSliceI++) {
                let rowForSlice = cells[rowForSliceI].slice(0, curLength);
                sliceCells.push(rowForSlice);
            }

            let l = sliceCells.length;
            let r = sliceCells[l - 1];
            let lr = r.length;
            let pointFinish = (r[lr - 1]).toPoint();

            let area = (pointFinish.r - pointStart.r + 1) * (pointFinish.c - pointStart.c + 1);
            let slice = new Slice({points: [pointStart, pointFinish], cells: sliceCells, area});
            slices.push(slice)
        }
    }
    return slices;
};

Slice.createValidSlicesForPizzaPoint = function (pizza, point) {
    let field = new Field(pizza, point);
    let slicesAll = Slice.createSlices(field, point);

    if (slicesAll.length) {
        let {L} = pizza;
        let slices =
                slicesAll
                    .filter((item) => item.isEnoughItems(L))
            ;

        slices.forEach((item, index) => item.setNumber(index));
        return slices
    } else {
        return [];
    }
};

module.exports = Slice;