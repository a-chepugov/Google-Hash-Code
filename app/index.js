"use strict";

const fs = require('fs');
const path = require('path');
const config = require('config');


const Pizza = require('./models/Pizza');
const State = require('./models/State');

async function saveData(output, fileName, data) {
    let pathString = `${output}/${fileName}`;
    let is = fs.existsSync(pathString);
    if (!is) {
        let is = fs.existsSync(output);
        if (!is) {
            fs.mkdirSync(output);
        }
        fs.mkdirSync(pathString);
    }

    let path = `${pathString}/${fileName}.out`;

    let suffix = (new Date()).toISOString();
    let pathTemp = `${path}.${suffix}`;

    try {
        fs.writeFileSync(pathTemp, data);
        fs.writeFileSync(path, data);
        console.info(`${pathTemp} saved`);
    } catch (err) {
        err.message += 'File saving error\n';
        throw err
    }
}

async function prepareDirs(pathString) {
    let is = fs.existsSync(pathString);
    if (is) {
        let suffix = (new Date()).toISOString();
        fs.renameSync(pathString, `${pathString} ${suffix}`);
    }
}

async function index() {
    console.time('all');

    let output = config.output;
    let file = config.file;
    let fileName = path.basename(file, '.in');
    let pathString = `${output}/${fileName }`;

    await prepareDirs(pathString);
    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);

    for (let set of state.getAnotherSet()) {
        console.time('set');

        // console.log('index.js(index):26 =>', `${set}`);
        console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
        // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree, `${set}`);

        let setDump = set.forSave();
        // console.log(setDump);
        saveData(output, fileName, setDump);

        console.timeEnd('set');
    }

    console.timeEnd('all');
}

module.exports = index;