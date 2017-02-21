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

    for (let set of state) {

        console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);

        // let q = set.forSave();
        // console.log(q);
    }


}

module.exports = index;