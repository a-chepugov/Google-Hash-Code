const fs = require('fs');
const config = require('config');

const exec = require('child_process').exec;


const Pizza = require('./models/Pizza');
const Slice = require('./models/Slice');
const Point = require('./models/Point');

// let root = process.cwd();


exec("rm -rf ./cache", function (error, stdout, stderr) {
});

async function index() {
    let file = config.file;

    console.time('pizza');
    let pizza = await Pizza.createInstance(file);
    console.timeEnd('pizza');
    console.dir(`${pizza}`, {color: true, depth: null});

    let {R, C, L} = pizza;

    let state = pizza.createState();


    console.log(`index.js(index):28 ========== ${state}`);
    state.setCellState(1,1, 2);
    state.setCellState(1,3, 1);
    state.setCellState(3,3, 1);
    state.setCellState(4,2, 2);
    console.log(`index.js(index):28 ========== ${state}`);

    for(let point of state) {
        // console.log(`${point}`);
        console.dir(point, {color: true, depth: null});

    }



    console.time('slices tree');

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {

            // console.time('slice');
            let point = new Point(r, c);
            let field = pizza.fieldForSlice(point);
            // console.log(`${field}`);

            let slicesAll = Slice.createSlices(field, point);

            let slices = slicesAll.filter((item) => item.isEnoughItems(L));
            // for(let slice of slices) {
            //     console.log(`${slice}` + '\n========\n')
            // }
            // console.timeEnd('slice');

            // console.log('index.js:30', `(${point})`, slicesAll.length, slices.length);
        }
    }

    console.timeEnd('slices tree');
}

module.exports = index;