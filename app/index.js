const fs = require('fs');
const config = require('config');

const exec = require('child_process').exec;

const Pizza = require('./models/Pizza');
const State = require('./models/State');

exec("rm -rf ./cache", function (error, stdout, stderr) {
});

async function index() {
    console.time('all');

    let file = config.file;
    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);

    for (let set of state.getAnotherSet()) {
        console.time('set');

        // console.log('index.js(index):26 =>', `${set}`);
        // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
        console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree, `${set}`);

        let q = set.forSave();
        console.log(q);

        console.timeEnd('set');
    }

    console.timeEnd('all');
}

module.exports = index;