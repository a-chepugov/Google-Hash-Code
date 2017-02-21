const fs = require('fs');

const Cell = require('./Cell');

class Pizza {
    constructor(data) {
        Object.assign(this, data);
    }

    toString() {
        let string = `${this.R} ${this.C} ${this.L} ${this.H}\n`;
        let cells = this.cells;
        for (let row of cells) {
            let rowString = row
                    .map(item => item.valueOf())
                    .join('') + '\n';
            string += rowString;
        }
        return string;
    }
}

Pizza.createInstance = async function (file) {
    let promise = new Promise((s, f) => {

        fs.readFile(file, 'utf8', function (err, raw) {
            let lines = raw.split('\n');

            let dataProps = lines[0].split(' ');
            for (let i = 0, l = dataProps.length; i < l; i++) {
                dataProps[i] = parseInt(dataProps[i]);
            }

            let [R, C, L, H] = dataProps;
            let cells = [];

            for (let r = 0; r < R; r++) {
                let lineIndex = r + 1;
                let row = lines[lineIndex].split('').map((item, c) => new Cell(r, c, item));
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