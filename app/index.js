"use strict";

const child_process = require('child_process');
const fs = require('fs');


function killProcesses (processes) {
    for (let process of processes) {
        process.kill('SIGHUP');
    }
}

async function index() {
    const childs = ['champion', 'nerd', 'magician'];

    let processes = [];

    console.time('all');
    for (let child of childs) {
        let childProcess = child_process.fork(`./app/childs/${child}.js`, ['--harmony']);
        processes.push(childProcess);
    }

    for (let process of processes) {
        process.on('message', function (message) {
            message = JSON.parse(message);
            console.log(message.process, `${message.cutted}/${message.area} | ${message.free}`);

            if(message.state === 'done') {
                console.timeEnd('all');
                killProcesses(processes)
            }
        });
    }
}

module.exports = index;