"use strict";

const path = require('path');
const config = require('config');

const Pizza = require('../models/Pizza');
const State = require('../models/State');

const saveResult = require('../helpers/saveResult');
const createMessage = require('../helpers/createMessage');

process.on('message', function(message){
    console.log(message);
});

async function index() {
    console.time('champion done');

    let output = config.output;
    let file = config.file;
    let fileName = path.basename(file, '.in');

    let pizza = await Pizza.createInstance(file);

    let state = State.createInstanse(pizza);

    let skipped = state.area;

    function skipStateCb(state) {
        return skipped <= state.areaSkipped
    }

    function stopCb(state) {
        return state.areaSkipped === 0;
    }

    for (let set of state.getAnotherSet(skipStateCb, stopCb)) {
        skipped = set.areaSkipped;

        let message = createMessage('nerd', state, 'next');
        process.send(JSON.stringify(message));

        let setDump = set.forSave();
        saveResult(output, fileName, setDump, set.areaCutted);
    }

    let message = createMessage('nerd', state, 'done');
    process.send(JSON.stringify(message));

    console.timeEnd('champion done');
}

index();