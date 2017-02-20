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

    valueOf() {
        return this.toString()
    }

    toString() {
        let string = `${this.points[0]} -> ${this.points[1]} =>> ${this.area}\n`;
        for (let row of this.cells) {
            string += (row.join(' | ') + '\n');
        }
        return string;
    }
}

Slice.createSlices = function createSlices(field, pointStart) {
    let cells = field.cells;
    let rMax = cells.length;
    let slices = [];

    for (let rI = 0; rI < rMax; rI++) {
        let rowCurrent = cells[rI];
        let maxLength = rowCurrent.length;

        for (let curLength = maxLength + 1; --curLength;) {

            let slice = [];
            for (let rowForSliceI = 0; rowForSliceI <= rI; rowForSliceI++) {
                let rowForSlice = cells[rowForSliceI].slice(0, curLength);
                slice.push(rowForSlice);
            }

            let l = slice.length;
            let r = slice[l - 1];
            let lr = r.length;
            let pointFinish = (r[lr - 1]).toPoint();

            let area = (pointFinish.r - pointStart.r + 1) * (pointFinish.c - pointStart.c + 1);

            slices.push(new Slice({points: [pointStart, pointFinish], cells: slice, area}))
        }
    }
    return slices;
}


module.exports = Slice;