const fs = require('fs');
const config = require('config');

const exec = require('child_process').exec;


const Pizza = require('./models/Pizza');
const Slice = require('./models/Slice');
const Cell = require('./models/Cell');
const Point = require('./models/Point');

// let root = process.cwd();


exec("rm -rf ./cache", function (error, stdout, stderr) {
});

async function index() {
    let file = config.file;
    let pizza = await Pizza.createInstance(file);
    // console.dir(pizza, {color: true, depth: null});

    let {R, C, L} = pizza;

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            let p = new Point(r, c);
            // let field = fieldForSlice(pizza, p);
            let field = pizza.fieldForSlice(p);
            let slicesAll = createSlices(field);
            // console.dir(slicesAll, {color: true, depth: null});

            let slices = slicesAll.filter((item) => isValidSlice(item, L));
            // let slices = slicesAll.filter((item)=>item.isEnoughItems(L))
            console.log('index.js:30', slicesAll.length, slices.length);
        }
    }
}

function isValidSlice(slice, L) {
    let countM = 0;
    let countT = 0;

    console.dir(arguments, {color: true, depth: null});


    for (let rI = slice.length; rI--;) {
        let row = slice[rI];
        for (let cI = row.length; cI--;) {
            if (row[cI] === 'M') {
                countM++;
            } else {
                countT++;
            }
            if (countT >= L && countM >= L) {
                // console.dir({countT, countM}, {color: true, depth: null});
                // console.dir(slice, {color: true, depth: null});
                return true;
            }
        }
    }
    return false
}

function createSlices(field, point) {
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
            slices.push(slice)

        }
    }

    return slices;
}


function isValidSlice(slice, L) {
    let countM = 0;
    let countT = 0;

    for (let rI = slice.length; rI--;) {
        let row = slice[rI];
        for (let cI = row.length; cI--;) {
            if (row[cI] === 'M') {
                countM++;
            } else {
                countT++;
            }
            if (countT >= L && countM >= L) {
                // console.dir({countT, countM}, {color: true, depth: null});
                // console.dir(slice, {color: true, depth: null});
                return true;
            }
        }
    }
    return false
}

function fieldForSlice(pizza, point) {
    let field = [];
    let {R, C, H, cells} = pizza;
    let {r, c} = point;
    let drMax = r + H < R ? H : (R - r);

    for (let dr = 0; dr < drMax; dr++) {
        let rI = dr + r;

        let row = [];
        let dcH = Math.floor(H / (dr + 1));
        let dcMax = dcH + c < C ? dcH : (C - c);

        for (let dc = 0; dc < dcMax; dc++) {
            let cI = dc + c;
            let cell = cells[rI][cI];
            row.push(cell)
        }
        field.push(row);
    }
    return field;
}

module.exports = index;