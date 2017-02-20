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

    console.time(1);

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {
            let point = new Point(r, c);
            let field = pizza.fieldForSlice(point);
            // console.dir(field.toString(), {color: true, depth: null});

            let slicesAll = Slice.createSlices(field, point);
            // for(let slice of slicesAll) {
            //     console.log(slice.toString())
            // }

            let slices = slicesAll.filter((item) => item.isEnoughItems(L));
            // for(let slice of slices) {
            //     console.log(slice.toString())
            // }

            console.log('index.js:30', slicesAll.length, slices.length);
        }
    }

    console.timeEnd(1);
}

module.exports = index;