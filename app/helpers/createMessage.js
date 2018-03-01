"use strict";

function createMessage(processName, data, state) {
	return {
		process: processName,
		state: state,
		area: data.area,
		cutted: data.areaCutted,
		skipped: data.areaSkipped,
		free: data.areaFree,
	}
}

module.exports = createMessage;