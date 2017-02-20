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

    for (let point of state) {
        let field = pizza.fieldForSlice(point);
        // let field = new Field (pizza, point);
        let slicesAll = Slice.createSlices(field, point);

        let slices =
                slicesAll
                    .filter((item) => item.isEnoughItems(L))
            ;

        slices.forEach((item, index) => item.setNumber(index));

        let [slice] = slices;

        if(slice instanceof Slice) {
            state.cutSlice(slice)
        } else {
            state.skipPoint(point);
        }

        console.log(`index.js(index):28 ========== ${state}`);
    }

    console.log(`index.js(index):28 ========== ${state}`);

    console.time('slices tree');

    for (let r = 0; r < R; r++) {
        for (let c = 0; c < C; c++) {

            // console.time('slice');
            let point = new Point(r, c);
            let field = pizza.fieldForSlice(point);
            // console.log(`${field}`);

            let slicesAll = Slice.createSlices(field, point);

            let slices =
                    slicesAll
                        .filter((item) => item.isEnoughItems(L))
                ;

            slices.forEach((item, index) => item.setNumber(index));

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