"use strict";

const fs = require('fs');
const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');

process.on('message', function(message){
    console.log(message);
});

async function saveData(output, fileName, data, size) {
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
    let pathTemp = `${path}.${size}.${suffix}`;

    try {
        fs.writeFileSync(pathTemp, data);
        // fs.writeFileSync(path, data);
        // console.info(`${pathTemp} saved`);
    } catch (err) {
        err.message += 'File saving error\n';
        throw err
    }
}

async function index() {
    console.time('all');

    let output = config.output;
    let file = config.file;
    let fileName = path.basename(file, '.in');

    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);


    let skipped = state.area;

    function skipStateCb(state) {
        // console.log('index.js(skipStateCb):55 =>',skipped, state.areaSkipped);
        return skipped <= state.areaSkipped
    }

    function stopCb(state) {
        // console.log('index.js(stopCb):63 =>',state.areaSkipped);
        return state.areaSkipped === 0;
    }

    for (let set of state.getAnotherSet(skipStateCb, stopCb)) {
        skipped = set.areaSkipped;

        let message = {process: 'nerd', state: 'next', result: set.areaCutted};
        process.send(JSON.stringify(message));

        // console.log('index.js(index) =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
        let setDump = set.forSave();
        saveData(output, fileName, setDump, set.areaCutted);
    }

    let message = {process: 'nerd', state: 'done', result: state.areaCutted};
    process.send(JSON.stringify(message));

    console.timeEnd('all');
}

index();