"use strict";

const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');

const shuffle = require('../helpers/shuffle');
const saveResult = require('../helpers/saveResult');
const createMessage = require('../helpers/createMessage');

process.on('message', function (message) {
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


    let positionCb = function (slices, N) {
        if (N) {
            for (let i = 0, l = slices.length; i < l && i < N; i++) {
                slices[i].N = N
            }
        }
        shuffle(slices)
    };

    let skipped = Number.MAX_VALUE;

    while (skipped) {
        let state = State.createInstanse(pizza);

        let skipStateCb = function (state) {
            return skipped <= state.areaSkipped
        };

        let stopCb = function (state) {
            return state.areaSkipped === 0;
        };

        for (let set of state.getAnotherSet({skipStateCb, stopCb, positionCb})) {
            skipped = skipped < set.areaSkipped? skipped : set.areaSkipped;

            let setDump = set.forSave();
            saveResult(output, fileName, setDump, set.areaCutted);

            let message = createMessage('magician', state, 'next');
            process.send(JSON.stringify(message));
        }

        if (state.area === state.areaCutted) {
            let message = createMessage('magician', state, 'done');
            process.send(JSON.stringify(message));
            break;
        }
    }
    console.timeEnd('magician done');
}

index();