const fs = require('fs');
const config = require('config');

const exec = require('child_process').exec;

const Pizza = require('./models/Pizza');

exec("rm -rf ./cache", function (error, stdout, stderr) {
});

async function index() {
    let file = config.file;

    let pizza = await Pizza.createInstance(file);

    let state = pizza.createState();

    for (let set of state) {
        // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree, `${set}`);
        // console.log('index.js(index):26 =>', `${set}`);
        console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
        // let q = set.forSave();
        // console.log(q);
    }


}

module.exports = index;