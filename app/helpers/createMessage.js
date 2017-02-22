"use strict";

function createMessage(processName, data, state) {
    let message = {
        process: processName,
        state: state,
        area: data.area,
        cutted: data.areaCutted,
        skipped: data.areaSkipped,
        free: data.areaFree,
    }
    return message
}

module.exports = createMessage;