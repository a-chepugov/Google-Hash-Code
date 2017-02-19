const Point = require ('./Cell');

class Slice {
    constructor (data){
        this.cells = data
    }

    isEnoughItems(L) {
        let countM = 0;
        let countT = 0;

        for(let rI = this.length; rI--;) {
            let row = this[rI];
            for(let cI = row.length; cI--;) {
                if (row[cI] === 'M') {
                    countM++;
                } else {
                    countT++;
                }
                if (countT >= L && countM >= L ) {
                    // console.dir({countT, countM}, {color: true, depth: null});
                    // console.dir(slice, {color: true, depth: null});
                    return true;
                }
            }
        }
        return false
    }

    toString() {
        let data = this.field;
        let C = data.length;
        // for(let r = 0; ) {
        //
        // }
    }
}

Slice.createSlices =  function createSlices(field, point){
    let slices = [];

    let rMax = field.length;

    for (let rI = 0; rI < rMax; rI++) {
        let rowCurrent = field[rI];
        let maxLength = rowCurrent.length;

        for (let curLength = maxLength + 1; --curLength;) {

            let slice = [];
            for (let rowForSliceI = 0; rowForSliceI <= rI; rowForSliceI++) {
                let rowForSlice = field[rowForSliceI].slice(0, curLength);
                slice.push(rowForSlice);
            }
            slices.push(new Slice(point, point, points))

        }
    }
    return slices;
}


module.exports = Slice;