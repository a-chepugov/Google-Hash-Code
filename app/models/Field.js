class Field {
    constructor (pizza, point) {
        let fieldCells = [];
        let {R, C, H, cells} = pizza;
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
            fieldCells.push(row);
        }
        this.point = point;
        this.cells = fieldCells;
    }

    valueOf() {
        return this.toString()
    }

    toString() {
        let string = `${this.point}\n`;
        for (let row of this.cells) {
            string += (row.join('') + '\n');
        }
        return string;
    }
}

module.exports = Field;