const fs = require('fs');

const Slice = require ('./Slice');
const Cell = require ('./Cell');

class Pizza {
    constructor(data) {
        Object.assign(this, data);
    }

    fieldForSlice(point) {
        let field = [];
        let {R, C, H, cells} = this;
        let {r, c} = point;
        let drMax = r + H < R? H : (R - r);

        for (let dr = 0; dr < drMax; dr++ ) {
            let rI = dr + r;

            let row = [];
            let dcH = Math.floor(H / (dr + 1));
            let dcMax = dcH + c < C? dcH : (C - c);

            for (let dc = 0; dc < dcMax; dc++ ) {
                let cI = dc + c;
                let cell = cells[rI][cI];
                row.push(cell)
            }
            field.push(row);
        }
        return {point, field};
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