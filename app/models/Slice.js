const Point = require('./Cell');

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
        let string = `${this.point}\n`;
        for (let row of this.cells) {
            string += (row.join('') + '\n');
        }
        return string;
    }
}

Slice.createSlices = function createSlices(field, point) {
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

            let point2 = r[lr -1];

            console.log('Slice.js:60',l,lr, point, point2);


            slices.push(new Slice({point, cells: slice}))
        }
    }
    return slices;
}


module.exports = Slice;