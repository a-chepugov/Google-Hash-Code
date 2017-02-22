"use strict";

const child_process = require('child_process');

function killProcesses (processes) {
    for (let process of processes) {
        process.kill('SIGHUP');
    }
}

async function index(payload, streams) {
    const childs = ['champion', 'nerd', 'magician'];

    let processes = [];

    console.time('start');
    for (let child of childs) {
        let childProcess = child_process.fork(`./app/childs/${child}.js`, ['--harmony']);
        processes.push(childProcess);
    }

    for (let process of processes) {
        process.on('message', function (message) {
            message = JSON.parse(message);
            console.dir(message, {color: true, depth: null});

            if(message.state === 'done') {
                console.timeEnd('start');
                killProcesses(processes)
            }
        });
    }
}

module.exports = index;