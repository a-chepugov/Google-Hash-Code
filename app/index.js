const fs = require('fs');
const config = require('config');

const exec = require('child_process').exec;

const Pizza = require('./models/Pizza');
const Slice = require('./models/Slice');
const Point = require('./models/Point');
const Field = require('./models/Field');

exec("rm -rf ./cache", function (error, stdout, stderr) {
});

async function index() {
    let file = config.file;

    console.time('pizza');
    let pizza = await Pizza.createInstance(file);
    console.timeEnd('pizza');
    console.dir(`${pizza}`, {color: true, depth: null});

    let state = pizza.createState();

    console.log(`index.js(index):28 ========== ${state}`);

    console.time('cut');

    for (let point of state) {
        console.time(`cut ${point}`);

        let slices = Slice.createValidSlicesForPizzaPoint(pizza, point);
        let [slice] = slices;

        if (slice instanceof Slice) {
            state.cutSlice(slice)
        } else {
            state.skipPoint(point);
        }

        console.timeEnd(`cut ${point}`);
        // console.log(`index.js(index):28 ========== ${state}`);
    }
    console.log(`index.js(index):28 ========== ${state}`);

    console.timeEnd('cut');

    console.log('index.js(index):50 =>', state.getArea(), state.getSkippedArea());

    // let q = state.forSave();
    // console.log(q);

}

module.exports = index;