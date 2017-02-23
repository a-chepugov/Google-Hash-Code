"use strict";

const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');

const saveResult = require('../helpers/saveResult');
const createMessage = require('../helpers/createMessage');

process.on('message', function (message) {
    console.log(message);
});


async function index() {
    console.time('champion done');

    let output = config.output;
    let file = config.file;
    let fileName = path.basename(file, '.in');

    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);

    for (let skipNow = 0, skipMax = state.area; skipNow <= skipMax; skipNow++) {
        let skipStateCb = function (state) {
            return skipNow < state.areaSkipped
        };

        let stopCb = function stopCb(state) {
            return state.areaSkipped === skipNow;
        };

        let stop = false;

        for (let set of state.getAnotherSet(skipStateCb, stopCb)) {
            let setDump = set.forSave();
            saveResult(output, fileName, setDump, set.areaCutted);
            stop = true
        }
        if (stop) {
            break
        }
    }

    let message = createMessage('champion', state, 'done');;
    process.send(JSON.stringify(message));

    console.timeEnd('champion done');
}

index();