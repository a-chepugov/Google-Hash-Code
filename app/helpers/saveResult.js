"use strict";

const fs = require('fs');

async function saveResult(output, fileName, data, size = 0) {
    let pathString = `${output}/${fileName}`;
    let is = fs.existsSync(pathString);
    if (!is) {
        let is = fs.existsSync(output);
        if (!is) {
            fs.mkdirSync(output);
        }
        fs.mkdirSync(pathString);
    }

    let path = `${pathString}/${fileName}.out`;

    let suffix = (new Date()).toISOString();
    let pathTemp = `${path}.${size}.${suffix}`;

    try {
        fs.writeFileSync(pathTemp, data);
        // fs.writeFileSync(path, data);
        // console.info(`${pathTemp} saved`);
    } catch (err) {
        err.message += 'File saving error\n';
        throw err
    }
}

module.exports = saveResult;