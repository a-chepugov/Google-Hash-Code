"use strict";

const fs = require('fs');
const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');
const shuffle = require('../helpers/shuffle');

process.on('message', function(message){
    console.log(message);
});

async function saveData(output, fileName, data, size = 0) {
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
    let pathString = `${output}/${fileName}`;

    // await prepareDirs(pathString);
    let pizza = await Pizza.createInstance(file);


    let positionCb = function(slices, N) {
        if(N) {
            slices = slices.slice(N)
        }
        shuffle(slices)
    };

    let skipped = Number.MAX_VALUE;

    while (skipped) {
        let state = State.createInstanse(pizza);

        let skipStateCb = function (state) {
            // console.log('index.js(skipStateCb):55 =>',skipped, state.areaSkipped);
            return skipped <= state.areaSkipped
        }

        let stopCb = function (state) {
            // console.log('index.js(stopCb):63 =>',state.areaSkipped);
            return state.areaSkipped === 0;
        };

        for (let set of state.getAnotherSet(skipStateCb, stopCb, positionCb)) {
            skipped = set.areaSkipped;



            // console.time('set');

            // console.log('index.js(index):26 =>', `${set}`);
            // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree);
            // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree, `${set}`);

            let setDump = set.forSave();
            // console.log(setDump);
            saveData(output, fileName, setDump, set.areaCutted);

            let message = {process: 'magician', state: 'next', result: state.areaCutted};
            process.send(JSON.stringify(message));

            // console.timeEnd('set');
        }

        if(state.areaSkipped) {
            let message = {process: 'magician', state: 'done', result: state.areaCutted};
            process.send(JSON.stringify(message));

            break;
        }
    }



    console.timeEnd('all');
}

index();