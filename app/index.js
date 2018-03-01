"use strict";

const child_process = require('child_process');


function killProcesses(processes) {
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
			processes.forEach((process) => process.send(message));

			message = JSON.parse(message);

			if (message.state === 'next') {
				console.log(`${message.cutted}/${message.area} | ${message.free} | ${message.skipped} |`, message.process);

			} else if (message.state === 'done') {
				console.log(`${message.cutted}/${message.area} | ${message.free} | ${message.skipped} |`, message.process);
				console.log(message.process, 'done');
				console.timeEnd('all');
				killProcesses(processes)
			}
		});
	}
}

module.exports = index;