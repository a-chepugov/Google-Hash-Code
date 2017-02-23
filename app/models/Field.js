const Slice = require('./Slice');

class Field {
    constructor(pizza, point) {
        let fieldCells = [];
        let {R, C, H, L, cells} = pizza;
        let {r, c} = point;
        let drMax = r + H < R ? H : (R - r);

        for (let dr = 0; dr < drMax; dr++) {
            let rI = dr + r;

            let row = [];
            let dcH = Math.floor(H / (dr + 1));
            let dcMax = dcH + c < C ? dcH : (C - c);

            for (let dc = 0; dc < dcMax; dc++) {
                let cI = dc + c;
                let cell = cells[rI][cI];
                row.push(cell)
            }
            fieldCells.push(row);
        }
        this.cells = fieldCells;

        this.slices = this.createSlices(L);
    }

    get point() {
        return this.cells[0][0].toPoint();
    }

    valueOf() {
        return this.toString()
    }

    toString() {
        let string = `${this.point}\n`;
        let cells = this.cells;
        for (let row of cells) {
            let rowSrting = row
                    .map(item => item.valueOf())
                    .join('')
                + '\n';
            string += rowSrting;
        }
        return string;
    }

    createSlices(L) {
        let cells = this.cells;
        let rMax = cells.length;
        let slices = [];

        for (let rI = 0; rI < rMax; rI++) {
            let rowCurrent = cells[rI];
            let maxLength = rowCurrent.length;

            for (let curLength = maxLength + 1; --curLength;) {

                let sliceCells = [];
                for (let rowForSliceI = 0; rowForSliceI <= rI; rowForSliceI++) {
                    let rowForSlice = cells[rowForSliceI].slice(0, curLength);
                    sliceCells.push(rowForSlice);
                }

                let slice = new Slice({cells: sliceCells});
                slices.push(slice)
            }
        }

        slices =
            slices
                .filter((item) => item.isEnoughItems(L))
        ;

        slices.forEach((item, index) => {
            item.N = index
        });

        return slices;
    };
}

module.exports = Field;