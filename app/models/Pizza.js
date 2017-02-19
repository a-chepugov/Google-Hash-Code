const fs = require('fs');

const Slice = require ('./Slice');
const Cell = require ('./Cell');
const Field = require ('./Field');

class Pizza {
    constructor(data) {
        Object.assign(this, data);
    }

    fieldForSlice(point) {
        return new Field(this, point);
    }
}

Pizza.createInstance = async function createInstance(file) {
    let promise = new Promise((s, f) => {

        fs.readFile(file, 'utf8', function (err, raw) {
            let lines = raw.split('\n');

            let dataProps = lines[0].split(' ');
            for (let i = 0, l = dataProps.length; i < l; i ++) {
                dataProps[i] = parseInt(dataProps[i]);
            }

            let [R, C, L, H] = dataProps;
            let cells = [];

            for (let r = 0; r < R; r++) {
                let lineIndex = r + 1;
                let row = lines[lineIndex].split('').map((item, c)=> new Cell(r, c, item) );
                cells.push(row);
            }

            let data = {
                raw,
                cells,
                R, C, L, H
            };

            s(data);
        });
    });
    let pizzaData = await promise;
    return new Pizza(pizzaData);
};



module.exports = Pizza;