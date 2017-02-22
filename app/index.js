"use strict";

const child_process = require('child_process');

async function index(payload, streams) {
    let nerd = child_process.fork(  './app/childs/nerd.js', ['--harmony']);
    nerd.on('message', function (message)  {
        message = JSON.parse(message);
        console.dir(message, {color: true, depth: null});

    });

    let champion = child_process.fork(  './app/childs/champion.js', ['--harmony']);
    champion.on('message', function (message)  {
        message = JSON.parse(message);
        console.dir(message, {color: true, depth: null});
    });
}

module.exports = index;