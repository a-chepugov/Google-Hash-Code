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

    for (let skipNow = 0, skipMax = pizza.area; skipNow <= skipMax; skipNow++) {
        let state = State.createInstanse(pizza);

        let skipStateCb = function (state) {
            return state.areaSkipped > skipNow
        };

        let stopCb = function () {};

        for (let set of state.getAnotherSet({skipStateCb, stopCb})) {
            let setDump = set.forSave();
            saveResult(output, fileName, setDump, set.areaCutted);
            let message = createMessage('champion', set, 'next');
            process.send(JSON.stringify(message));
            break;
        }

        if (state.areaSkipped <= skipNow) {
            break
        }
    }

    let message = createMessage('champion', {}, 'done');
    process.send(JSON.stringify(message));

    console.timeEnd('champion done');
}

index();