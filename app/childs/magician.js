"use strict";

const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');

const shuffle = require('../helpers/shuffle');
const saveResult = require('../helpers/saveResult');
const createMessage = require('../helpers/createMessage');

process.on('message', function(message){
    console.log(message);
});


async function index() {
    console.time('magician done');

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

            // console.log('index.js(index):26 =>', set.area, set.areaCutted, set.areaSkipped, set.areaFree, `${set}`);

            let setDump = set.forSave();
            saveResult(output, fileName, setDump, set.areaCutted);

            let message = createMessage('magician', state, 'next');
            process.send(JSON.stringify(message));
        }

        if(state.areaSkipped) {
            let message = createMessage('magician', state, 'done');
            process.send(JSON.stringify(message));

            break;
        }
    }
    console.timeEnd('magician done');
}

index();